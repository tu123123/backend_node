const http= require('http')
const hostname='127.0.0.1'
const port= 3000;
const server= http.createServer((a,b)=>{
    b.statusCode=200;
    b.setHeader('Content-Type','text/plain')
    b.end('helol')
})
server.listen(port,hostname,()=>{
    console.log('running')
})