import db from '../database/index.mjs';
import ioHandler from '../helpers/ioHandler.mjs';
import passwordHandler from '../helpers/passwordHandler.mjs';

export const command = "tags [--all] [--secure]";

export const describe = "  =>    show current available tags";

export const builder = {
    all: {
        type: 'boolean',
        alias: 'a'
    },
    secure: {
        type: 'boolean',
        alias: 's'
    }
}

export async function handler(argv) {
    if (argv.all) {
        await showTags();
    }
    else if (argv.secure) {
        await showTags({showPublic: false});
    }
    else {
        await showTags({showPrivate: false});
    }
}

async function showTags({showPublic = true, showPrivate = true} = {}) {
    if (showPublic) {
        const publicTags = await getTags(db.models.note);
        ioHandler.showOutput('Available public tags:', 'success');
        ioHandler.showOutput(publicTags, 'queryResult');
    }

    if (showPrivate) {
        const password = await passwordHandler.askForGlobalPassword();
        if (!password.status) {
            ioHandler.showError(password.errorMsg);
            return;
        }

        const privateTags = await getTags(db.models.secureNote);
        ioHandler.showOutput('Available private tags:', 'success');
        ioHandler.showOutput(privateTags, 'queryResult');
    }
}

async function getTags(dbModel) {
    // as app scale is relatively small, getting all notes even with repeated tags is fine and we don't need to optmize it
    const tags = new Set();

    const notes = await dbModel.find({});
    for (const note of notes) {
        tags.add(note.tag);
    }

    return Array.from(tags.values()).join('\n');
}