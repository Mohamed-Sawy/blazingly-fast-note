export const command = "show [all] [tag]";

export const describe = "  =>    show all notes or notes with specific tag";

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