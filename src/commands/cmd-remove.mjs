export const command = "remove [note-id] [all]";

export const describe = "  =>    remove all notes or a note with specific id";

export const builder = {
    "note-id": {
        type: 'string',
        alias: 'i'
    },
    all: {
        type: 'boolean',
        alias: 'a'
    }
}

export function handler(argv) {
    // TBD
} 