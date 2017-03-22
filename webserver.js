'use strict';
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
let mimes = {
  '.htm' : 'text/html',
  '.css' : 'text/css',
  '.js' : 'text/javascript',
  '.gif' : 'image/gif',
  '.jpg' : 'image/jpeg',
  '.jpg' : 'image/png'
}

function webserver(req,res){
  //if the route requested is '/', then load index.html
  // or else load the file

  let baseUri = url.parse(req.url);
  let filepath = __dirname + (baseUri.pathname === '/' ? '/index.htm' : baseUri.pathname);

  // Check if the requested file is accessible or not
  fs.access(filepath, fs.F_OK, error => {
    if(!error){
      console.log('Serving: ', filepath);
      // Read and Serve the file over response
      fs.readFile(filepath, (error, content) => {
        if(!error){
          // Resolve Content Type
          let contentType = mimes[path.extname(filepath)];

          // Server the file
          res.writeHead(200, {'Content-type' : contentType});
          res.end(content, 'utf-8');
        } else {
          // Serve a 500
          res.writeHead(500);
          res.end('The server could not read file');
        }
      });
    } else{
      // Serve 404
      res.writeHead(404);
      res.end('Content not found');
    }
  });

}

http.createServer(webserver).listen(3000, () => {
  console.log('Webserver runnning on port 3000');
})
