const http = require('http')

http.createServer((request, response) => {
    let body = []
    request.on('error', (err) => {
        console.error(err)
    }).on('data', (chunk) => {
        console.log(chunk, 'chunk')
        body.push(chunk)
    }).on('end', () => {
        console.log('body', body)
        // body.push(Buffer.from)
        body = Buffer.concat(body).toString()
        response.writeHead(200, { 'Content-Type': 'text/html' })
        response.end('Hello World\n')
    })
}).listen(8099)
console.log('server started....')
