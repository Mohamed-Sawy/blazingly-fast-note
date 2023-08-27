import ioHandler from '../helpers/ioHandler.mjs';
import { handler as newNoteHandler } from './cmd-new.mjs';


export const command = 'editor [--tag] [--secure]';

export const describe = '  =>    Open editor to type your note(s)';

export const builder = {
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
    argv.note = await ioHandler.getInput('type your note(s) and it will be saved the way you structure it.', 'editor');

    await newNoteHandler(argv);
}