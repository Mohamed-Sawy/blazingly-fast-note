import db from '../database/index.mjs';
import ioHandler from '../helpers/ioHandler.mjs';
import passwordHandler from '../helpers/passwordHandler.mjs';
import secureNoteHandler from '../helpers/secureNoteHandler.mjs';

export const command = "show [tag] [--all] [--secure]";

export const describe = "  =>    show all notes or notes with specific tag";

export const builder = {
    tag: {
        type: 'string',
        alias: 't'
    },
    all: {
        type: 'boolean',
        alias: 'a',
    },
    secure: {
        type: 'boolean',
        alias: 's'
    }
}

export async function handler(argv) {
    let filterQuery;
    if (argv.tag) {
        filterQuery = {tag: argv.tag};
    }

    if (argv.all) {
        await showNotes({filterQuery});
    }
    else if (argv.secure) {
        await showNotes({filterQuery, showPublic: false});
    }
    else {
        await showNotes({filterQuery, showPrivate: false});
    }
}

async function showNotes({showPublic = true, showPrivate = true, filterQuery = {}} = {}) {
    if (showPublic) {
        const publicNotes = await getNotesPresentation(db.models.note, {filterQuery});
        ioHandler.showOutput('Available public notes:', 'success');
        ioHandler.showOutput(publicNotes, 'queryResult');
    }

    if (showPrivate) {
        const passwords = await passwordHandler.askForExistingPasswords({isSecure: true});
        if (!passwords.status) {
            ioHandler.showError(passwords.errorMsg);
            return;
        }

        const privateNotes = await getNotesPresentation(db.models.secureNote, {
            filterQuery,
            secure: true,
            globalPassword: passwords.globalPassword,
            secondPassword: passwords.secondPassword
        });

        ioHandler.showOutput('Available private notes:', 'success');
        ioHandler.showOutput(privateNotes, 'queryResult');
    }
}

async function getNotesPresentation(dbModel, {filterQuery = {}, secure = false, globalPassword, secondPassword} = {}) {
    const notesBasedOnTags = {};

    let noteModels = await dbModel.find(filterQuery);
    if (secure) {
        noteModels = decryptSecureNotes(noteModels, globalPassword, secondPassword);
    }

    for (const note of noteModels) {
        if (!notesBasedOnTags[note.tag]) notesBasedOnTags[note.tag] = [];

        notesBasedOnTags[note.tag].push(`[ ${note.content} ]\nid -> ${note.id}`);
    }

    const notesPresentation = [];
    for (const [tag, notes] of Object.entries(notesBasedOnTags)) {
        notesPresentation.push(`Notes with tag( ${tag} ):\n${notes.join('\n____\n')}`);
    }

    return notesPresentation.join('\n--------------------------------------------\n');
}

function decryptSecureNotes(secureNotes, globalPassword, secondPassword) {
    const notes = [];
    for (const sNote of secureNotes) {
        const decryptedNote = secureNoteHandler.getNoteContent(sNote, globalPassword, secondPassword);
        if (!decryptedNote.status) {
            decryptedNote.content = '***ENCRYPTED NOTE***';
        }
        
        notes.push({content: decryptedNote.content, tag: sNote.tag, id: sNote._id});
    }

    return notes;
}