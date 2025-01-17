const path = require('path');
const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');
const slugify = require('slugify');

//FILES
//Synchronous way
// const textIn = fs.readFileSync(path.resolve(__dirname,'./final/txt/input.txt'), 'utf-8');

// const textOut = `Avacados are wild ${textIn}\nCreated On: ${Date.now()}`;

// fs.writeFileSync(path.resolve(__dirname,'./final/txt/output.txt'), textOut);

// console.log('file written');

//Async way
/* fs.readFile(path.resolve(__dirname,'./final/txt/start.txt'), 'utf-8', (err,data) => {
    if (err) return console.log('this didnt work sry');
    fs.readFile(path.resolve(__dirname,`./final/txt/${data}.txt`), 'utf-8', (err,data2) => {
        console.log(data2);
        fs.readFile(path.resolve(__dirname,`./final/txt/append.txt`), 'utf-8', (err,data3) => {
            console.log(data3);
            fs.writeFile(path.resolve(__dirname,`./final/txt/final.txt`), `${data2}\n${data3}\nWritten On: ${Date.now()}`, 'utf-8', err => {
                console.log('written boi test');
            });
        });
    });
});

console.log('reading first'); */

///////////////////////////
// SERVER

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');

const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');

const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) =>
  slugify(el.productName, {
    lower: true,
  })
);

console.log(slugs);
console.log(
  slugify('Fresh Avocados', {
    lower: true,
  })
);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === '/' || pathname === '/overview') {
    const cardHtml = dataObj.map((el) => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardHtml);
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    res.end(output);
  } else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>Page not found</h1>');
  }
  //res.end('The server talkin');
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});
