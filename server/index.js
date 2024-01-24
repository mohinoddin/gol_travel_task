const mongoose = require("mongoose");
const express = require("express");
const app = express();
const signupModal = require("./models/signup-Modal");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const cors = require("cors");

app.listen(process.env.PORT || 3001, (err) => {
  if (!err) {
    console.log("server started on port 3001");
  } else {
    console.log(err);
  }
});

const checkExistinguser = async (email) => {
  let existinguser = false;
  await signupModal.find({ email: email }).then((userData) => {
    if (userData.length) {
      existinguser = true;
    }
  });
  return existinguser;
};

const generatePasswordHash = (password) => {
  const salt = 10;
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(salt).then((saltHash) => {
      bcrypt.hash(password, saltHash).then((passwordHash) => {
        resolve(passwordHash);
      });
    });
  });
};

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));

const db_URL = process.env.db_URL;
mongoose
  .connect(db_URL, {})
  .then((res) => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("home route");
});

app.post("/signup", async (req, res) => {
  if (await checkExistinguser(req.body.email)) {
    res.status(200).send("email already exist");
  } else {
    generatePasswordHash(req.body.password).then((passwordHash) => {
      signupModal
        .create({ email: req.body.email, password: passwordHash })
        .then((data) => {
          res.status(200).send("user signedup sucessfully");
        })
        .catch((err) => {
          res.status(400).send(err.message);
        });
    });
  }
});

app.post("/signin", (req, res) => {
  signupModal.find({ email: req.body.email }).then((userData) => {
    if (userData.length) {
      bcrypt.compare(req.body.password, userData[0].password).then((val) => {
        if (val) {
          const authToken = jwt.sign(userData[0].email, process.env.SECRET_KEY);
          res.status(200).send({ authToken });
        } else {
          res
            .status(400)
            .send("invalid password please enter correct password");
        }
      });
    } else {
      res.status(400).send("email not exist please signup");
    }
  });
});
