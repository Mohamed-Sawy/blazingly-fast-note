export const command = "edit <note-id> [content] [tag]";

export const describe = "  =>    edit the content or tag of a note based on id";

export const builder = {
    "note-id": {
        type: 'string',
        alias: 'i'
    },
    content: {
        type: 'string'
    },
    tag: {
        type: 'string',
        alias: 't'
    }
}

export function handler(argv) {
    // TBD
} 