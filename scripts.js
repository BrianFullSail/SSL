// loading the libraries to use
const fs = require("fs")
const http = require("http")
const path = require("path")
const url = require("url")

// creating the server
http.createServer(function(req, res){

    let parsed = url.parse(req.url)
    let filename = path.parse(parsed.pathname)

    let filen = filename.name == "" ? "index" : filename.name
    let ext = filename.ext == "" ? ".html" : filename.ext
    let dir = filename.dir == "/" ? "" : filename.dir + "/"
    let page = filename.name == "" ? "index.html" : filename.name

    let f = (dir + filen + ext).replace("/", "") //removing the / and replacing with a blank

    // create dictionary for file types
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif'
    }

    if(f){

        fs.readFile(f, function(err, data) {

            if(page){
                if(mimeTypes.hasOwnProperty(ext)){
                    // go through the dictionary and match the file type
                    res.writeHead(200, { 'Content-Type': mimeTypes[ext] })
                    // if the ext is a .html write to the file
                    if(ext == ".html"){
                        res.write("<script>var page = '" + page + "';</script>")
                    }
                    res.end(data, 'utf-8')
                }
            }
        })
    }
// listen on port 8080
}).listen("8080")