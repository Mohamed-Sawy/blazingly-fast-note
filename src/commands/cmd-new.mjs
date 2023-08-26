import db from "../database/index.mjs";
import ioHandler from "../helpers/ioHandler.mjs";
import secureNoteHandler from '../helpers/secureNoteHandler.mjs'

export const command = "new <note> [--tag] [--secure]";

export const describe = "  =>    Create a new note";

export const builder = {
    note: {
        type: 'string',
    },
    tag: {
        type: 'string',
        default: 'general',
        alias: 't'
    },
    secure: {
        type: 'boolean',
        alias: 's'
    }
}

export async function handler(argv) {
    if (!argv.secure) {
        await db.models.note.create({
            content: argv.note,
            tag: argv.tag
        });

        ioHandler.showOutput('Note has been added successfully.', 'success');
        return;
    }

    const noteBuilder = await buildSecureNote(argv);
    if (noteBuilder.globalPassword !== process.env.SNOTES_PASSWORD) {
        ioHandler.showOutput('Global Passowrd incorrect', 'failure');
        return;
    }

    const secureNote = secureNoteHandler.getSecureNote(noteBuilder.note, noteBuilder.secondPassword);
    secureNote.tag = noteBuilder.tag;

    ioHandler.showOutput('Note has been encrypted successfully', 'success');
    if (noteBuilder.secondPassword) {
        ioHandler.showOutput(`use the tag: {${secureNote.tag}} with the password provided to retrieve it.`);
    }

    await db.models.secureNote.create(secureNote);
}

async function buildSecureNote(argv) {
    const noteBuilder = {note: argv.note};

    noteBuilder.globalPassword = await ioHandler.getInput('Enter the global password for notes:', 'password');

    const allowSecLayer = await ioHandler.getInput('Do you wanna add another password for this note?', 'confirm');

    if (allowSecLayer) {
        noteBuilder.secondPassword = await ioHandler.getInput('Enter a password for this note:', 'password');
        
        if (argv.tag === 'general') {
            argv.tag = await ioHandler.getInput('You must specify a tag to be able to retrieve the note (or type "general"):');
        }
    }

    noteBuilder.tag = argv.tag;
    return noteBuilder;
}