import bodyParser from "body-parser";
import chalk from "chalk";
import { error } from "console";
import express from "express";
import { existsSync, mkdir, read, readFile, writeFile } from "fs";

const app = express();
const staticPath = `../express_tuts/public/index.html`;
app.use(express.static(staticPath));
app.use(bodyParser.json());

const urlEncodedParser = bodyParser.urlencoded({ extended: false });

//Check if the directory json exists or not
if (!existsSync("../express_tuts/json/")) {
  mkdir("../express_tuts/json/", (err) => {
    if (err) {
      errorLog(err);
    } else {
      successLog("Directory created");
    }
  });
}

//Check if the file posts.json exists or not
if (!existsSync("../express_tuts/json/posts.json")) {
  writeFile("../express_tuts/json/posts.json", "[]", (err) => {
    if (err) {
      errorLog(err);
    } else {
      successLog("File created");
    }
  });
}
//check if the file users.json exists or not
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

//####################### POSTS ############################

//get all posts from posts.json
app.get("/posts", (req, res) => {
  readFile("../express_tuts/json/posts.json", "utf8", (err, data) => {
    if (err) {
      errorLog(err);
      res.setHeader("Content-Type", "application/json");
      //500 is internal server error
      res.status(500).send({
        code: 500,
        message: "Internal server error",
      });
    } else {
      res.setHeader("Content-Type", "application/json");
      res.status(200).send(data);
    }
  });
});

//Get a single post from posts.json by id
app.get("/posts/:id", (req, res) => {
  readFile("../express_tuts/json/posts.json", "utf8", (err, data) => {
    if (err) {
      errorLog(err);
      //500 is internal server error
      res.setHeader("Content-Type", "application/json");
      res.status(500).send({
        code: 500,
        message: "Internal server error",
      });
    } else {
      const posts = JSON.parse(data);
      const post = posts.find((post) => post.id === parseInt(req.params.id));
      if (post) {
        res.setHeader("Content-Type", "application/json");
        res.status(200).send(post);
      } else {
        res.setHeader("Content-Type", "application/json");
        res.status(404).send({
          code: 404,
          message: `Post with id ${req.params.id} not found`,
        });
      }
    }
  });
});

//Create a new post
app.post("/posts", urlEncodedParser, (req, res) => {
  readFile("../express_tuts/json/posts.json", "utf8", (err, data) => {
    if (err) {
      errorLog(err);
      res.setHeader("Content-Type", "application/json");
      res.status(500).send({
        code: 500,
        message: "Internal server error",
      });
    } else {
      const posts = JSON.parse(data);
      const newPost = {
        id: posts.length + 1,
        title: req.body.title,
        body: req.body.body,
        author: req.body.author,
      };
      posts.push(newPost);
      writeFile(
        "../express_tuts/json/posts.json",
        JSON.stringify(posts),
        (err) => {
          if (err) {
            errorLog(err);
            res.setHeader("Content-Type", "application/json");
            res.status(500).send({
              code: 500,
              message: "Internal server error",
            });
          } else {
            res.setHeader("Content-Type", "application/json");

            res.status(201).send({
              code: 201,
              message: "Post created successfully",
              data: newPost,
            });
          }
        },
      );
    }
  });
});

//Update a post
app.put("/posts/:id", urlEncodedParser, (req, res) => {
  readFile("../express_tuts/json/posts.json", "utf8", (err, data) => {
    if (err) {
      errorLog(err);
      res.setHeader("Content-Type", "application/json");
      res.status(500).send({
        code: 500,
        message: "Internal server error",
      });
    } else {
      const posts = JSON.parse(data);
      const post = posts.find((post) => post.id === parseInt(req.params.id));
      if (post) {
        const postIndex = posts.indexOf(post);
        const keys = Object.keys(req.body);
        keys.forEach((key) => {
          if (key !== "id") post[key] = req.body[key];
        });
        posts[postIndex] = post;
        writeFile(
          "../express_tuts/json/posts.json",
          JSON.stringify(posts),
          (err) => {
            if (err) {
              errorLog(err);
              res.setHeader("Content-Type", "application/json");
              res.status(500).send({
                code: 500,
                message: "Internal server error",
              });
            } else {
              res.setHeader("Content-Type", "application/json");
              res.status(200).send({
                code: 200,
                message: "Post updated successfully",
                data: post,
              });
            }
          },
        );
      } else {
        res.setHeader("Content-Type", "application/json");
        res.status(404).send({
          code: 404,
          message: `Post with id ${req.params.id} not found`,
        });
      }
    }
  });
});

//Patch a post
app.patch("/posts/:id", urlEncodedParser, (req, res) => {
  readFile("../express_tuts/json/posts.json", "utf8", (err, data) => {
    if (err) {
      errorLog(err);
      res.setHeader("Content-Type", "application/json");
      res.status(500).send({
        code: 500,
        message: "Internal server error",
      });
    } else {
      const posts = JSON.parse(data);
      const post = posts.find((post) => post.id === parseInt(req.params.id));
      if (post) {
        const updatedPost = { ...post, ...req.body };
        const postIndex = posts.indexOf(post);
        posts[postIndex] = updatedPost;
        writeFile(
          "../express_tuts/json/posts.json",
          JSON.stringify(posts),
          (err) => {
            if (err) {
              errorLog(err);
              res.setHeader("Content-Type", "application/json");
              res.status(500).send({
                code: 500,
                message: "Internal server error",
              });
            } else {
              res.setHeader("Content-Type", "application/json");
              res.status(200).send({
                code: 200,
                message: "Post updated successfully",
                data: updatedPost,
              });
            }
          },
        );
      } else {
        res.setHeader("Content-Type", "application/json");
        res.status(404).send({
          code: 404,
          message: `Post with id ${req.params.id} not found`,
        });
      }
    }
  });
});

//Delete a post
app.delete("/posts/:id", (req, res) => {
  readFile("../express_tuts/json/posts.json", "utf8", (err, data) => {
    if (err) {
      errorLog(err);
      res.setHeader("Content-Type", "application/json");
      res.status(500).send({
        code: 500,
        message: "Internal server error",
      });
    } else {
      const posts = JSON.parse(data);
      const post = posts.find((post) => post.id === parseInt(req.params.id));
      if (post) {
        const postIndex = posts.indexOf(post);
        posts.splice(postIndex, 1);
        writeFile(
          "../express_tuts/json/posts.json",
          JSON.stringify(posts),
          (err) => {
            if (err) {
              errorLog(err);
              res.setHeader("Content-Type", "application/json");
              res.status(500).send({
                code: 500,
                message: "Internal server error",
              });
            } else {
              res.setHeader("Content-Type", "application/json");
              res.status(200).send({
                code: 200,
                message: "Post deleted successfully",
              });
            }
          },
        );
      } else {
        res.setHeader("Content-Type", "application/json");
        res.status(404).send({
          code: 404,
          message: `Post with id ${req.params.id} not found`,
        });
      }
    }
  });
});

//####################### USERS ############################
//get all users
app.get("/users", (req, res) => {
  readFile("../express_tuts/json/users.json", "utf8", (err, data) => {
    if (err) {
      errorLog(err);
      res.setHeader("Content-Type", "application/json");
      res.status(500).send({
        code: 500,
        message: "Internal server error",
      });
    } else {
      res.setHeader("Content-Type", "application/json");
      res.status(200).send({
        code: 200,
        message: "Users retrieved successfully",
        data: JSON.parse(data),
      });
    }
  });
});

//Get single user by id
app.get("/users/:id", (req, res) => {
  readFile("../express_tuts/json/users.json", "utf8", (err, data) => {
    if (err) {
      errorLog(err);
      res.setHeader("Content-Type", "application/json");
      res.status(500).send({
        code: 500,
        message: "Internal server error",
      });
    } else {
      const users = JSON.parse(data);
      const user = users.find((user) => user.id === parseInt(req.params.id));
      if (user) {
        res.setHeader("Content-Type", "application/json");
        res.status(200).send({
          code: 200,
          message: "User retrieved successfully",
          data: user,
        });
      } else {
        res.setHeader("Content-Type", "application/json");
        res.status(404).send({
          code: 404,
          message: `User with id ${req.params.id} not found`,
        });
      }
    }
  });
});

//Create a user
app.post("/users", urlEncodedParser, (req, res) => {
  readFile("../express_tuts/json/users.json", "utf8", (err, data) => {
    if (err) {
      errorLog(err);
      res.setHeader("Content-Type", "application/json");
      //500 Internal server error
      res.status(500).send({
        code: 500,
        message: "Internal server error",
      });
    } else {
      const user = JSON.parse(data);
      const newUser = {
        id: user.length + 1,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
      };
      user.push(newUser);
      writeFile(
        "../express_tuts/json/users.json",
        JSON.stringify(user),
        (err) => {
          if (err) {
            errorLog(err);
            res.setHeader("Content-Type", "application/json");
            res.status(500).send({
              code: 500,
              message: "Internal server error",
            });
          } else {
            res.setHeader("Content-Type", "application/json");
            res.status(201).send({
              code: 201,
              message: "User created successfully",
              data: newUser,
            });
          }
        },
      );
    }
  });
});

//Update a user
app.put("/users/:id", urlEncodedParser, (req, res) => {
  readFile("../express_tuts/json/users.json", "utf8", (err, data) => {
    if (err) {
      errorLog(err);
      res.setHeader("Content-Type", "application/json");
      //500 Internal server error
      res.status(500).send({
        code: 500,
        message: "Internal server error",
      });
    } else {
      const users = JSON.parse(data);
      const user = users.find((user) => user.id === parseInt(req.params.id));
      if (user) {
        const userIndex = users.indexOf(user);
        const keys = Object.keys(req.body);
        keys.forEach((key) => {
          if (key !== "id") user[key] = req.body[key];
        });
        users[userIndex] = user;
        writeFile(
          "../express_tuts/json/users.json",
          JSON.stringify(users),

          (err) => {
            if (err) {
              //500 Internal server error
              errorLog(err);
              res.setHeader("Content-Type", "application/json");
              res.status(500).send({
                code: 500,
                message: "Internal server error",
              });
            } else {
              //User updated successfully 200
              res.setHeader("Content-Type", "application/json");
              res.status(200).send({
                code: 200,
                message: "User updated successfully",
                data: user,
              });
            }
          },
        );
      } else {
        //404 Not found
        res.setHeader("Content-Type", "application/json");
        res.status(404).send({
          code: 404,
          message: `User with id ${req.params.id} not found`,
        });
      }
    }
  });
});

//Patch a user
app.patch("/users/:id", urlEncodedParser, (req, res) => {
  readFile("../express_tuts/json/users.json", "utf8", (err, data) => {
    if (err) {
      errorLog(err);
      res.setHeader("Content-Type", "application/json");
      //500 Internal server error
      res.status(500).send({
        code: 500,
        message: "Internal server error",
      });
    } else {
      const users = JSON.parse(data);
      const user = users.find((user) => user.id === parseInt(req.params.id));
      if (user) {
        const updatedUser = { ...user, ...req.body };
        const userIndex = users.indexOf(user);
        users[userIndex] = updatedUser;
        writeFile(
          "../express_tuts/json/users.json",
          JSON.stringify(users),
          (err) => {
            if (err) {
              errorLog(err);
              res.setHeader("Content-Type", "application/json");
              //500 Internal server error
              res.status(500).send({
                code: 500,
                message: "Internal server error",
              });
            } else {
              //User updated successfully 200
              res.setHeader("Content-Type", "application/json");
              res.status(200).send({
                code: 200,
                message: "User updated successfully",
                data: updatedUser,
              });
            }
          },
        );
      } else {
        //404 Not found
        res.setHeader("Content-Type", "application/json");
        res.status(404).send({
          code: 404,
          message: `User with id ${req.params.id} not found`,
        });
      }
    }
  });
});

//Delete a user
app.delete("/users/:id", (req, res) => {
  readFile("../express_tuts/json/users.json", "utf8", (err, data) => {
    if (err) {
      errorLog(err);
      res.setHeader("Content-Type", "application/json");
      //500 Internal server error
      res.status(500).send({
        code: 500,
        message: "Internal server error",
      });
    } else {
      const users = JSON.parse(data);
      const user = users.find((user) => user.id === parseInt(req.params.id));
      if (user) {
        const userIndex = users.indexOf(user);
        users.splice(userIndex, 1);
        writeFile(
          "../express_tuts/json/users.json",
          JSON.stringify(users),
          (err) => {
            if (err) {
              //500 Internal server error
              errorLog(err);
              res.setHeader("Content-Type", "application/json");
              res.status(500).send({
                code: 500,
                message: "Internal server error",
              });
            } else {
              //User deleted successfully 200
              res.setHeader("Content-Type", "application/json");
              res.status(200).send({
                code: 200,
                message: "User deleted successfully",
              });
            }
          },
        );
      } else {
        //404 Not found

        res.setHeader("Content-Type", "application/json");
        res.status(404).send({
          code: 404,
          message: `User with id ${req.params.id} not found`,
        });
      }
    }
  });
});

//If called with '/' route
app.all("/", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.status(200).send({
    code: 200,
    message: "You should either try '/posts' or '/users' to continue",
  });
});

//If no route is matched
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
