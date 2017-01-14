"using strict";

// Create the http object, server, port and server callback for each request
var http = require("http");
var server = http.createServer(requestHandler);
var port = 5555;
server.listen(port, () => {
    console.log("Server created. Listening on port: " + 
                port.toString());});

function requestHandler(request, response){

    // Set the proper server path relative to server.js
    var path = '../';
    var url = request.url; 
    var extension = '.html';
    var contentType = 'text/html';
    console.log(`Attempting to route ${url}.`)
    
    // Ignore the favicon search
    if(url === "/favicon.ico") {
        console.log('Ignoring favicon.ico route');
        return;
    }

    // Load index if no file given
    if(url === '/') {
        url = "index";
    }

    // If URL contains extension, handle based on file type
    if(url.indexOf('.') !== -1) {
        var directory = '';
        extension = url.slice(url.indexOf('.') + 1, url.length);
        switch(extension) {
            case 'bmp':
                directory = 'images/';
                contentType = 'image/bmp';
            break;
            case 'jpg':
                directory = 'images/';
                contentType = 'image/jpeg';
            break;
            case 'png':
                directory = 'images/';
                contentType = 'image/png';
                break;
            case 'php':
                directory = 'php/';
                contentType = 'text/plain';
                break;
            case 'js':
                // Javascript files are in same directly as server.js
                path = './';
                directory = '';
                contentType = 'application/javascript';
                break;
        }

        // Extension is already contained in URL. Delete now.
        extension = '';

        // Make sure directory isn't already at beginning of URL
        if(url.indexOf('/' + directory) !== 0) {
            url = directory + url;
        }
    } 
    

    path += url + extension;
    
    // Determine of GET or POST or other method
    var method = request.method;
    
    // Parse the text in the file
    var fs = require("fs"); 
    fs.readFile(path, (error, source) => {
        if(error){
            console.log(error);
            response.writeHead(404, {'Content-type': contentType});

            // Get rid of initial "/" in url for message
            url = url.slice(1, url.length) + extension;
            var errorMessage = `
            <!DOCTYPE html>
            <html lang='eng'>
            <head>
                <meta charset='utf-8' />
                <meta name='viewport' content='width=device-widthy' />
                <meta name='description' content='Oh no! ERROR 404!' />
                <title>Whoops! Page not found: ${url}</title>
            </head>
            <body>
                <h1>Whoops! Error 404</h1>
                <p>Page not found: ${url}</p>
            </body>
            </html>`;
            response.end(errorMessage);
            return;
        }

        // Convert byte data to string for HTML source
        if(contentType === 'text/html' || contentType === 'text/plain') {
            source = source.toString();
        }

        // Run any scripts called and return
        if(contentType === 'application/javascript') {
            var script = require('child_process').exec;
            console.log(script);

            // Drop the initial '/'
            url = url.slice(1, url.length);
            console.log(url);
            script(`node ${url}`, (error, stdout, stderr) => {

                // If the script performed a task, return that
                if(stdout !== '') {
                    console.log('executing script');
                    response.end(stdout);
                    return;
                }
            });
        }

        // Otherwise, return page of content
        response.writeHead(200, {'Content-type': contentType});
        response.end(source);
        console.log(`Successfully loaded page: ${url + extension}`);
        console.log(source);

        return;
    });
}