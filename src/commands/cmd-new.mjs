import db from '../database/index.mjs';
import ioHandler from '../helpers/ioHandler.mjs';
import secureNoteHandler from '../helpers/secureNoteHandler.mjs';
import passwordHandler from '../helpers/passwordHandler.mjs';


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

    const passwords = await passwordHandler.askForNewPasswords();
    if (!passwords.status) {
        ioHandler.showError(passwords.errorMsg);
        return;
    }

    if (argv.tag === 'general') {
        argv.tag = await ioHandler.getInput('You must specify a tag to be able to retrieve the note (or type "general"):');
    }

    const secureNote = secureNoteHandler.getSecureNote(argv.note, passwords.secondPassword);
    secureNote.tag = argv.tag;

    ioHandler.showOutput('Note has been encrypted successfully', 'success');
    if (passwords.secondPassword) {
        ioHandler.showOutput(`use the tag: {${secureNote.tag}} with the password provided to retrieve it.`);
    }

    await db.models.secureNote.create(secureNote);
}