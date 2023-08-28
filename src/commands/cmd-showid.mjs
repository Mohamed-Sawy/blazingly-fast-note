import ioHandler from '../helpers/ioHandler.mjs';
import noteEditor from '../helpers/noteEditor.mjs';
import passwordHandler from '../helpers/passwordHandler.mjs';
import secureNoteHandler from '../helpers/secureNoteHandler.mjs';


export const command = "showid <noteId>";

export const describe = "  =>    show a specific note based on id";

export const builder = {
    noteId: {
        type: 'string',
    }
}

export async function handler(argv) {
    const passwords = await passwordHandler.askForExistingPasswords();
    if (!passwords.status) {
        ioHandler.showError(passwords.errorMsg);
        return;
    }

    const {noteDocument, type} = await noteEditor.getNoteById(argv.noteId, {
        globalKey: passwords.globalPassword,
        secondKey: passwords.secondPassword
    });

    if (!noteDocument.status) {
        ioHandler.showError(noteDocument.errorMsg);
        return;
    }

    let {content, tag, _id: id} = noteDocument.noteModel;

    if (type === 'secureNote') {
        const decryptedNote = secureNoteHandler.getNoteContent(
            noteDocument.noteModel, passwords.globalPassword, passwords.secondPassword
        );
        
        if (!decryptedNote.status) {
            content = '***ENCRYPTED NOTE***';
        }
        else {
            content = decryptedNote.content;
        }
    }

    ioHandler.showOutput(`Content: [ ${content} ]\nTag: ${tag}\nId: ${id}`);
}