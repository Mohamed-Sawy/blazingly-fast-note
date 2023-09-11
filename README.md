# Blazingly Fast Notes
![logo](logo.png)


## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)

---
## Introduction

bnote is a simple and lightweight command-line note-taking application for managing your notes and ideas efficiently. It provides a range of commands that allow you to create, edit, remove, and view your notes, as well as organize them using tags.

bnote is designed to be fast and easy to use, making it a great tool for developers, writers, and anyone who prefers a terminal-based note-taking solution.

---
## Installation

To install bnote, follow these simple steps:

1. Clone the bnote repository to your local machine:

   ```bash
   git clone https://github.com/Mohamed-Sawy/bnote.git
   ```

2. Change the CWD to the bnote directory:

   ```bash
   cd bnote
   ```

3. Install the required packages:

   ```bash
   npm install
   ```

4. Create a symlink to the `bnote` script using npm link:

   ```bash
   npm link
   ```

Now you have successfully installed bnote, but you need to configure the environment before using it.


## Configuration

To configure bnote, you'll need to create a `.env` file in the root directory of the project and set the following environment variables:

1. `DB_CONNECTION_STRING`: This variable should contain the URL for your MongoDB database, allowing bnote to store and retrieve notes.

2. `SNOTES_PASSWORD`: This password will be used globally to encrypt and decrypt notes.

Example for `.env` file:
```
DB_CONNECTION_STRING=mongodb://localhost:27017/bnote
SNOTES_PASSWORD=GLOBAL_PASSWORD
```

After setting these environment variables, you can start using it via the `bnote` command in your terminal.

---
## Usage

bnote provides a set of commands and options to help you manage your notes effectively. Here is an overview of the available commands and their usage:

### `bnote new <note> [--tag] [--secure]`

Create a new note.

- `note`: The content of the new note.
- `--tag`: Assign a tag to the note.
- `--secure`: Enable secure mode to encrypt the note (optional).

Example usage:

```bash
bnote new "This is a new note" --tag "work"
```

Output:

```bash
Note has been added successfully.
```

### `bnote editor [--tag] [--secure]`

Open a text editor to type your notes.

- `--tag`: Assign a tag to the note.
- `--secure`: Enable secure mode to encrypt the note (optional).

Example usage:

```bash
bnote editor --tag "ideas"
```

Output after typing the content in the text editor:

```bash
Note has been added successfully.
```

### `bnote show [tag] [--all] [--secure]`

Show all notes or notes with a specific tag.  
The default behavior is to show only public notes. 

- `tag`: Show notes with a specific tag (optional).
- `--all`: Show all notes (optional).
- `--secure`: Show secure notes (optional).

Example usage:

```bash
bnote show
bnote show "work"
```

Output:

```bash
Notes with tag( work ):
[ This is a new note ]
id -> 64feb3b4830cc649d1610dd9
```

### `bnote showid <noteId>`

Show a specific note based on its ID.

- `noteId`: The ID of the note you want to display.

Example usage:

```bash
bnote showid 64feb3b4830cc649d1610dd9
```

Output:

```bash
? Is the note encrypted? No
Content: [ This is a new note ]
Tag: work
Id: 64feb3b4830cc649d1610dd9
```

### `bnote tags [--all] [--secure]`

Show current available tags.  
The default behavior is to show only public tags.

- `--all`: Show all tags (optional).
- `--secure`: Show secure tags (optional).

Example usage:

```bash
bnote tags
bnote tags --all
```

Output:

```bash
Available public tags:
work
```

### `bnote edit <noteId> [--content] [--tag]`

Edit the content or tag of a note based on its ID.

- `noteId`: The ID of the note you want to edit.
- `--content`: Edit the content of the note.
- `--tag`: Edit the tag of the note.

Example usage:

```bash
bnote edit 64feb3b4830cc649d1610dd9 --content "This is a modified work note"
```

Output:

```bash
? Is the note encrypted? No
The note has been modified successfully.
Content: [ This is a modified work note ]
Tag: work
Id: 64feb3b4830cc649d1610dd9
```

### `bnote remove <noteId>`

Remove a note based on its ID.

- `noteId`: The ID of the note you want to remove.

Example usage:

```bash
bnote remove 64feb3b4830cc649d1610dd9
```

Output:

```bash
? Are you sure you  wanna delete this note? Yes
? Is the note encrypted? No
The note has been deleted successfully.
```

Making sure it has been deleted:

```bash
bnote showid 64feb3b4830cc649d1610dd9
? Is the note encrypted? No
Error: Couldn't find a note with this id
```

For additional information and command usage, you can use the `--help` option with any bnote command to display detailed instructions.

---
Enjoy using bnote and don't hesitate to reach out in case of **any criticism**.
