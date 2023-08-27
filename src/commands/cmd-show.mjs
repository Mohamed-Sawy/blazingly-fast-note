import db from '../database/index.mjs';
import ioHandler from '../helpers/ioHandler.mjs';
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
        if (! await checkGlobalPassword()) {
            ioHandler.showOutput('Global Passowrd incorrect', 'failure');
            return;
        }

        const privateNotes = await getNotesPresentation(db.models.secureNote, {filterQuery, secure: true});
        ioHandler.showOutput('Available private notes:', 'success');
        ioHandler.showOutput(privateNotes, 'queryResult');
    }
}

async function getNotesPresentation(dbModel, {filterQuery = {}, secure = false} = {}) {
    const notesBasedOnTags = {};

    let noteModels = await dbModel.find(filterQuery);
    if (secure) {
        noteModels = await decryptSecureNotes(noteModels);
    }

    for (const note of noteModels) {
        if (!notesBasedOnTags[note.tag]) notesBasedOnTags[note.tag] = [];

        notesBasedOnTags[note.tag].push(`[ ${note.content} ]`);
    }

    const notesPresentation = [];
    for (const [tag, notes] of Object.entries(notesBasedOnTags)) {
        notesPresentation.push(`Notes with tag( ${tag} ):\n${notes.join('\n__\n')}`);
    }

    return notesPresentation.join('\n--------------------------------------------\n');
}

async function decryptSecureNotes(secureNotes) {
    const checkSecLayer = await ioHandler.getInput(
        'Do you wanna use a second password to decrypt notes?(only global password will be used instead)'
        , 'confirm');

    let secondPassword;
    if (checkSecLayer) {
        secondPassword = await ioHandler.getInput('Enter second security layer password:', 'password');
    }

    const notes = [];
    for (const sNote of secureNotes) {
        const decryptedNote = secureNoteHandler.getNoteContent(sNote, process.env.SNOTES_PASSWORD, secondPassword);
        if (!decryptedNote.status)
            decryptedNote.content = '***ENCRYPTED NOTE***';

        notes.push({content: decryptedNote.content, tag: sNote.tag});
    }

    return notes;
}

async function checkGlobalPassword() {
    const globalPassword = await ioHandler.getInput('Enter the global password for notes:', 'password');
    if (globalPassword !== process.env.SNOTES_PASSWORD) {
        return false;
    }

    return true;
}