import ioHandler from '../helpers/ioHandler.mjs';
import noteEditor from '../helpers/noteEditor.mjs';
import passwordHandler from '../helpers/passwordHandler.mjs';


export const command = "remove <noteId>";

export const describe = "  =>    edit the content or tag of a note based on id";

export const builder = {
    noteId: {
        type: 'string',
        alias: 'i'
    }
}

export async function handler(argv) {
    const confirmDelete = await ioHandler.getInput('Are you sure you  wanna delete this note?', 'confirm');
    if (!confirmDelete) {
        return;
    }

    const passwords = await passwordHandler.askForExistingPasswords();
    if (!passwords.status) {
        ioHandler.showError(passwords.errorMsg);
        return;
    }

    const result = await noteEditor.deleteNote(argv.noteId, {
        globalKey: passwords.globalPassword,
        secondKey: passwords.secondPassword
    });

    if (!result.status) {
        ioHandler.showError('No changes made.');
        ioHandler.showOutput(`Due to: ${result.errorMsg}`);
    }
    else {
        ioHandler.showOutput('The note has been deleted successfully.', 'success');
    }
}