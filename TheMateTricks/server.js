const http = require ('http');
const app = require ('./Backend/app');
const port = process.env.PORT || 3000;

app.set('port', port);

const server = http.createServer(app);

server.listen(port);