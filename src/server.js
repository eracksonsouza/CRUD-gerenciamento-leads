import http from 'node:http'

const server = http.createServer((req, res) => {
    console.log('servidor rodando');
    
})

server.listen(3333)