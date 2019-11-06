const app = require("./backend/app");
const debug = require("debug")("node-angular");
const http = require("http");

//When we try to set up a port, this code makes sure is a valid number
const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};
//This function checks what tipe of error occured and exits via exit(1) from the node.js server
const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};
//This just provides an output saying that we are listeninig successfuly to the incoming request
const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const server = http.createServer(app);
server.on("error", onError);//This registers a listener and throws the error if occured.
server.on("listening", onListening);//This registers the action of Listening executing the onListeninig function made above
server.listen(port);//This starts the actual server
