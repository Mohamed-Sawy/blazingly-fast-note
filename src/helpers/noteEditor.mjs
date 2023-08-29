import db from '../database/index.mjs';
import secureNoteHandler from './secureNoteHandler.mjs';



async function editNote(id, {content, tag, globalKey, secondKey} = {}) {
    const {noteDocument, type} = await getNoteById(id, {globalKey, secondKey});
    if (!noteDocument.status) {
        return {
            status: false,
            errorMsg: noteDocument.errorMsg
        };
    }

    const noteModel = noteDocument.noteModel;

    if (type === 'note') {
        noteModel.content = content ?? noteModel.content;
        content = noteModel.content;
    }
    else if (type === 'secureNote') {
        if (content) {
            const secureNote = secureNoteHandler.getSecureNote(content, secondKey);
            noteModel.content = secureNote.content;
            noteModel.iv = secureNote.iv;
            noteModel.key = secureNote.key ?? noteModel.key;
        }
        content = '***ENCRYPTED NOTE***';
    }

    noteModel.tag = tag ?? noteModel.tag;
    
    await noteModel.save();
    return {
        status: true,
        note: {
            content,
            tag: noteModel.tag,
            id: noteModel.id
        }
    };
}

async function deleteNote(id, {globalKey, secondKey} = {}) {
    const { noteDocument } = await getNoteById(id, {globalKey, secondKey});

    if (noteDocument.status) {
        const noteModel = noteDocument.noteModel;
        await noteModel.deleteOne();

        return { status: true };
    }

    return noteDocument;
}

async function getNoteById(id, {globalKey, secondKey}) {
    let noteDocument = await getNote(id);

    if (noteDocument.status) {
        return {
            noteDocument,
            type: 'note'
        };
    }

    if (globalKey) {
        noteDocument = await getSecureNote(id, globalKey, secondKey);
        return {
            noteDocument,
            type: 'secureNote'
        }
    }

    return { noteDocument };
}

function getNote(id) {
    return getNoteDocument(db.models.note, id);
}

async function getSecureNote(id, globalKey, secondKey) {
    const noteDocument = await getNoteDocument(db.models.secureNote, id);
    if (noteDocument.status && !secureNoteHandler.validateKeys(noteDocument.noteModel, globalKey, secondKey)) {
        return {
            status: false,
            errorMsg: 'Incorrect password'
        };
    }
    
    return noteDocument;
}

async function getNoteDocument(dbModel, id) {
    const errorMsg = "Couldn't find a note with this id";
    try {
        const noteDocument = await dbModel.findById(id);
        if (!noteDocument) {
            throw new Error();
        }

        return {
            status: true,
            noteModel: noteDocument
        };
    }
    catch (err) {
        return {
            status: false,
            errorMsg
        }
    }
}

export default { editNote, deleteNote, getNoteById };