const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');

const base = path.resolve(path.join(__dirname, "../"));
const orig = path.join(base, "quiz_express");
const dest = path.join(base ,"CORE19-10_quiz_tips.zip");
const output = fs.createWriteStream(dest);

archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    })
    .pipe(output)
    .glob(`${orig}/*`, {"ignore": ['node_modules', 'README.md', 'LICENSE']})
    .finalize();

