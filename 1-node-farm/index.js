const path = require("path");
const fs = require('fs');

//Synchronous way
const textIn = fs.readFileSync(path.resolve(__dirname,'./final/txt/input.txt'), 'utf-8');

const textOut = `Avacados are wild ${textIn}\nCreated On: ${Date.now()}`;

fs.writeFileSync(path.resolve(__dirname,'./final/txt/output.txt'), textOut);

console.log('file written');

//Async way
const textInAsync = fs.readFile(path.resolve(__dirname,'./final/txt/start.txt'), 'utf-8', (err,data) => {
    console.log(data);
});