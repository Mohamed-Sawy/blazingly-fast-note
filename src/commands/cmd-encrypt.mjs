export const command = "encrypt <note> [tag]";

export const describe = "  =>    save the note encrypted";

export const builder = {
    "note": {
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