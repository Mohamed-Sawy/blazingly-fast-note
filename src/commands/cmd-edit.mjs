import ioHandler from '../helpers/ioHandler.mjs';
import noteEditor from '../helpers/noteEditor.mjs';
import passwordHandler from '../helpers/passwordHandler.mjs';


export const command = "edit <noteId> [--content] [--tag]";

export const describe = "  =>    edit the content or tag of a note based on id";

export const builder = {
    noteId: {
        type: 'string',
        alias: 'i'
    },
    content: {
        type: 'string',
        alias: 'c'
    },
    tag: {
        type: 'string',
        alias: 't'
    }
}

export async function handler(argv) {
    const passwords = await passwordHandler.askForExistingPasswords();
    if (!passwords.status) {
        ioHandler.showError(passwords.errorMsg);
        return;
    }

    const result = await noteEditor.editNote(argv.noteId, {
        content: argv.content,
        tag: argv.tag,
        globalKey: passwords.globalPassword,
        secondKey: passwords.secondPassword
    });

    if (!result.status) {
        ioHandler.showError(`No changes made.`);
        ioHandler.showOutput(`Due to: ${result.errorMsg}`);
    }
    else {
        ioHandler.showOutput('The note has been modified successfully.', 'success');
        ioHandler.showOutput(`Content: [ ${result.note.content} ]\nTag: ${result.note.tag}\nId: ${result.note.id}`);
    }
}