# Monad Documentation

The web documentation component of Monad.

## Editing, Building, and Deploying

This documentation is maintained via [GitBook](https://github.com/GitbookIO/gitbook).

**Editing**

To edit, just make changes to any markdown file within this directory (`docs/`).
The generic file structure required by GitBook looks like:

```
.
├── README.md
├── SUMMARY.md
├── chapter-1/
|   ├── README.md
|   └── something.md
└── chapter-2/
    ├── README.md
    └── something.md
```

Run `npm run serve` to preview and serve the documentation at `localhost:4000`.

Editing existing files is straightforward; the changes will propagate automatically.

In the event you need to create a new directory (which typically corresponds to a new GitBook chapter), you must then edit the `SUMMARY.md` file to specify where this new file or directory should live in the hierarchy. GitBook uses this file to build the documentation.

**Building**

Run `npm run build` to build the static site. Build output is located in the `_book` directory.

**Deploying**

You must have the `surge` command line tool installed globally.
Run `npm install -g surge` to accomplish this.

Then, run `npm run deploy` to deploy the documentation.
