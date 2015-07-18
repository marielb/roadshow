var Hoganizer = require('hoganizer');
var hoganizer = new Hoganizer({
    templateDir: './templates',
    extension: '.html',
    writeLocation: './public/tmp/templates.js'
});

// Compile all mustache templates in `./templates` and write
// them into frontend js file to `./templates.js`.
hoganizer.write();

// Compile but save the script as a string
var vanillaJS = hoganizer.precompile();

// Grab the latest compiled version
var vanillaJS = hoganizer.getCached();