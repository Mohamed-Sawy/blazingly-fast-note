export const command = "new <note> [tag]";

export const describe = "  =>    Create a new note";

export const builder = {
    note: {
        type: 'string',
    },
    tag: {
        type: 'string',
        default: 'general',
        alias: 't'
    }
}

export function handler(argv) {
    // TBD
} 