export const command = "get-file [all] [tag]";

export const describe = "  =>    save all notes or notes with specific tag in notes.txt";

export const builder = {
    all: {
        type: 'boolean',
        alias: 'a'
    },
    tag: {
        type: 'boolean',
        alias: 't'
    }
}

export function handler(argv) {
    // TBD
} 