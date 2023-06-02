import bodyParser from "body-parser";
import chalk from "chalk";
import express from "express";
import { existsSync, readFile, writeFile } from "fs";

const app = express();
const staticPath = `../express_tuts/public/index.html`;
app.use(express.static(staticPath));
app.use(bodyParser.json());

const urlEncodedParser = bodyParser.urlencoded({ extended: false });

if (!existsSync("../express_tuts/json/posts.json")) {
  writeFile("../express_tuts/json/posts.json", "[]", (err) => {
    if (err) {
      errorLog(err);
    } else {
      successLog("File created");
    }
  });
}
if (!existsSync("../express_tuts/json/users.json")) {
  writeFile("../express_tuts/json/users.json", "[]", (err) => {
    if (err) {
      errorLog(err);
    } else {
      successLog("File created");
    }
  });
}
const errorLog = (message) => {
  console.log(chalk.red(message));
};

const successLog = (message) => {
  console.log(chalk.green(message));
};

const infoLog = (message) => {
  console.log(chalk.blue(message));
};

app.all("/", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.status(200).send({
    code: 200,
    message: "You should either try '/posts' or '/users' to continue",
  });
});

//##################
//##################
//## User methods ##
//##################
//##################

//Get all users
app.get("/users", (req, res) => {
  readFile("../express_tuts/json/users.json", "utf8", (err, data) => {
    res.setHeader("Content-Type", "application/json");
    if (err) {
      errorLog(err);
      res.status(500).send({
        code: 500,
        message: "Server error",
      });
    } else {
      res.status(200).send(data);
    }
  });
});

//Get a single user by ID
app.get("/users/:id", (req, res) => {
  readFile("../express_tuts/json/users.json", "utf8", (err, data) => {
    res.setHeader("Content-Type", "application/json");
    if (err) {
      errorLog(err);
      res.status(500).send({
        code: 500,
        message: "Server error",
      });
    } else {
      if (req.params.id === "all") {
        //If user tries to retrieve all users,even though it's dumb way, But who knows what user wants;
        res.status(200).send(data);
      } else {
        data = JSON.parse(data);
        const user = data.find((user) => user.id === parseInt(req.params.id));
        res.status(200).send(user);
      }
    }
  });
});

//Add new user
app.post("/users", urlEncodedParser, (req, res) => {
  readFile("../express_tuts/json/users.json", "utf8", (err, data) => {
    if (err) {
      errorLog(err);
      res.status(500).send({
        code: 500,
        message: "Server error",
      });
    } else {
      data = JSON.parse(data);
      if (data.find((user) => user.id === req.body.id)) {
        res.status(409).send({
          code: 409,
          message: "User already exists",
        });
      } else {
        data.push(req.body);
        writeFile(
          "../express_tuts/json/users.json",
          JSON.stringify(data),
          (err) => {
            if (err) {
              errorLog(err);
              res.status(500).send({
                code: 500,
                message: "Server error",
              });
            } else {
              successLog("User added");
              res.status(200).send({
                code: 200,
                message: "User added",
              });
            }
          },
        );
      }
    }
  });
});

//Delete a single user by id
app.delete("/users/:id", urlEncodedParser, (req, res) => {
  readFile("../express_tuts/json/users.json", "utf8", (err, data) => {
    if (err) {
      errorLog(err);
      res.status(500).send({
        code: 500,
        message: "Server error",
      });
    } else {
      data = JSON.parse(data);
      const index = data.findIndex(
        (user) => user.id === parseInt(req.params.id),
      );
      if (index === -1) {
        res.status(404).send({
          code: 404,
          message: "User not found",
        });
      } else {
        data.splice(index, 1);
        writeFile(
          "../express_tuts/json/users.json",
          JSON.stringify(data),
          (err) => {
            if (err) {
              errorLog(err);
              res.status(500).send({
                code: 500,
                message: "Server error",
              });
            } else {
              successLog("User deleted");
              res.status(200).send({
                code: 200,
                message: "User deleted",
              });
            }
          },
        );
      }
    }
  });
});

//Update a single user
app.put("/users/:id", urlEncodedParser, (req, res) => {
  readFile("../express_tuts/json/users.json", "utf8", (err, data) => {
    if (err) {
      errorLog(err);
      res.status(500).send({
        code: 500,
        message: "Server error",
      });
    } else {
      var obj = JSON.parse(data);
      const index = obj.findIndex(
        (user) => user.id === parseInt(req.params.id),
      );
      infoLog(req.params.id);
      if (index === -1) {
        res.status(404).send({
          code: 404,
          message: "User not found",
        });
      } else {
        obj[index] = req.body;
        writeFile(
          "../express_tuts/json/users.json",
          JSON.stringify(obj),
          (err) => {
            if (err) {
              errorLog(err);
              res.status(500).send({
                code: 500,
                message: "Server error",
              });
            } else {
              successLog("User updated");
              res.status(200).send({
                code: 200,
                message: "User updated",
              });
            }
          },
        );
      }
    }
  });
});

app.patch("/users/:id", urlEncodedParser, (req, res) => {
  readFile("../express_tuts/json/users.json", "utf8", (err, data) => {
    if (err) {
      errorLog(err);
      res.status(500).send({
        code: 500,
        message: "Server error",
      });
    } else {
      data = JSON.parse(data);
      const index = data.findIndex(
        (user) => user.id === parseInt(req.params.id),
      );
      if (index === -1) {
        res.status(404).send({
          code: 404,
          message: "User not found",
        });
      } else {
        const src = data[index];
        const dst = req.body;
        for (var key in dst) {
          src[key] = dst[key];
        }
        writeFile(
          "../express_tuts/json/users.json",
          JSON.stringify(data),
          (err) => {
            if (err) {
              errorLog(err);
              res.status(500).send({
                code: 500,
                message: "Server error",
              });
            } else {
              successLog("User patched");
              res.status(200).send({
                code: 200,
                message: "User patched",
              });
            }
          },
        );
      }
    }
  });
});

//##################
//##################
//## Post methods ##
//##################
//##################

// Get all posts
app.get("/posts", (req, res) => {
  readFile("../express_tuts/json/posts.json", "utf8", (err, data) => {
    res.setHeader("Content-Type", "application/json");
    if (err) {
      errorLog(err);
      res.status(500).send({
        code: 500,
        message: "Server error",
      });
    } else {
      res.status(200).send(data);
    }
  });
});

// Get a single post by ID
app.get("/posts/:id", (req, res) => {
  readFile("../express_tuts/json/posts.json", "utf8", (err, data) => {
    res.setHeader("Content-Type", "application/json");
    if (err) {
      errorLog(err);
      res.status(500).send({
        code: 500,
        message: "Server error",
      });
    } else {
      if (req.params.id === "all") {
        //If user tries to retrieve all posts,even though it's dumb way, But who knows what user wants;
        res.status(200).send(data);
      } else {
        data = JSON.parse(data);
        const post = data.find((post) => post.id === parseInt(req.params.id));
        res.status(200).send(post);
      }
    }
  });
});

app.all("*", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.status(404).send({
    code: 404,
    message: `http://localhost:3000${req.url} not found`,
  });
});

//Listen on port 3000
app.listen(3000, () => {
  infoLog(`Server is running on ${chalk.underline("http://localhost:3000")}`);
  infoLog("Press Ctrl+C to quit");
});
