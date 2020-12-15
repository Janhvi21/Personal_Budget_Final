const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const setFirebase = require("./firebase/setData");
const getFirebase = require("./firebase/getData");

const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


const admin = require('./firebase-admin/admin');
app.use(cors());


let userRecord = null;

app.listen(port, () => {
  console.log(`API served at http://localhost:${port}`);
});
app.get("/budget/", function (req, res) {
  res.send("Budget is working");
});

app.post("/createNewUser/", function (req, res) {
  let token = "";
  admin.auth().createUser({
      email: req.body.email,
      emailVerified: false,
      password: req.body.password,
      displayName: req.body.username,
      disabled: false,
    }).then((userRecord) => {
      admin.auth().createCustomToken(userRecord.uid, {
          expiresAt: Date.now() + (1000 * 60)
        })
        .then((customToken) => {

          token = customToken;
          setFirebase.createNewUser(userRecord);
          res.send({
            "tokenID": token
          });
        })
        .catch((error) => {
          console.log("Token Error:", error);
        })
    })
    .catch((error) => {
      console.log('Error creating new user:', error);
    })

})
app.get("/verifyUser/", verifyToken, function (req, res) {
  res.send({
    "message": "OK"
  });
});
app.get("/getAllData/", verifyToken, function (req, res) {
  getFirebase.getUserInfo(req.body.uid.user_id, function (err, data) {
    res.send(data);
  })
})
app.get("/insertCategory/", verifyToken, function (req, res) {
  setFirebase.insertCategory(req, function (err, data) {
    res.send(data);
  })
})

app.get("/deleteCategory/", verifyToken, function (req, res) {
  setFirebase.deleteCategory(req, function (err, data) {
    res.send(data);
  })
})

app.get("/insertTransaction/", verifyToken, function (req, res) {
  setFirebase.insertTransaction(req, function (err, data) {
    res.send(data);
  })
})

app.get("/deleteTransactions/", verifyToken, function (req, res) {
  setFirebase.deleteTransactions(req, function (err, data) {
    res.send(data);
  })
})
app.get("/addMonthtoDB/", verifyToken, function (req, res) {
  setFirebase.addMonthtoDB(req, function (err, data) {
    res.send(data);
  })
})
async function verifyToken(req, res, next) {
  const idToken = req.query.token;
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    if (decodedToken) {
      req.body.uid = decodedToken;
      return next();

    } else {
      return res.status(401).send("You are not authorized| error!");
    }
  } catch (e) {
    return res.status(401).send("You are not authorized | error! " + e);
  }
}