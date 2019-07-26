const express = require("express");
const helmet = require("helmet");
const logger = require("morgan");
const checkJwt = require("./middlewares/checkJwt");
const app = express();
require("./db/DB")(); // Connect DB

const port = process.env.PORT || 5000;

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger("combined"));

// app.use(checkJwt);

app.use("/api/polls", require("./routers/Polls"));
app.use("/api/user", require("./routers/User"));

app.use((err, req, res, next) => {
  if (!err.output) {
    return res.status(401).json(err.message);
  }
  return res.status(err.output.statusCode).json(err.output.payload);
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(port, console.log(`Server started at port ${port}`));

process.on("SIGABRT", () => {
  console.log("Shutting down server...");
  process.exit(0);
  console.log("Server is down.");
});
