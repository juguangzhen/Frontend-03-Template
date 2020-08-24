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
        response.end(
`<html lang='en'>
<head>
    <meta charset="UTF-8" />
    <title>Title</title>
    <style>
        body div #myid{
            color: #f00;
            background-color: #f11;
        }
        body div img{
            width: 100px;
            background-color: #fff;
        }
    </style>
</head>
<body>
    <div>
        <img id='myid'/>
        <img />
    </div>
</body>
</html>`)
    })
}).listen(8099)
console.log('server started....')
