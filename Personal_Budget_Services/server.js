const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const setFirebase = require("./firebase/setData");
const getFirebase = require("./firebase/getData");
const compression = require('compression');
const jwt = require('jsonwebtoken');

const exjwt = require('express-jwt');


const app = express();
app.use(compression());
const port = 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
  next();
});
const secretKey = 'My super secret key';

const jwtMW = exjwt({
  secret: secretKey,
  algorithms: ['HS256']
});


const admin = require('./firebase-admin/admin');
app.use(cors());


let userRecord = null;

app.listen(port, () => {
  console.log(`API served at http://localhost:${port}`);
});
app.get("/budget/", function (req, res) {
  res.send("Budget is working");
});
app.get("/allUsers", function (req, res) {
  getFirebase.getallUsers(req, function (err, data) {
    res.send(data);
  })
});
app.post("/createToken/", function (req, res) {
  let token = jwt.sign({
    uid: req.body.uid,
    username: req.body.username
  }, secretKey, {
    expiresIn: "60s"
  });
  res.send({
    success: true,
    err: null,
    token: token
  });
})
app.get("/verifyToken/", jwtMW, function (req, res) {
  res.send(req.user);
})
app.post("/createNewUser/", function (req, res) {
  let token = "";
  admin.auth().createUser({
      email: req.body.email,
      emailVerified: false,
      password: req.body.password,
      displayName: req.body.username,
      disabled: false,
    }).then((userRecord) => {
      setFirebase.createNewUser(userRecord);
      res.send({
        success: true,
        message: 'User Created SuccessFully'
      })
    })
    .catch((error) => {
      res.send({
        success: false,
        statusCode: 500,
        message: error == null || isEmptyObject(error) ? "Some error at the server" : error,
      })
    })

})
app.get("/getAllData/", jwtMW, function (req, res) {
  getFirebase.getUserInfo(req.headers.uid, function (err, data) {
    res.send(data);
  })
})
app.post("/insertCategory/", jwtMW, function (req, res) {
  setFirebase.insertCategory(req, function (err, data) {
    res.send(data);
  })
})

app.post("/deleteCategory/", jwtMW, function (req, res) {
  setFirebase.deleteCategory(req, function (err, data) {
    res.send(data);
  })
})

app.post("/insertTransaction/", jwtMW, function (req, res) {
  setFirebase.insertTransaction(req, function (err, data) {
    res.send(data);
  })
})

app.post("/deleteTransactions/", jwtMW, function (req, res) {
  setFirebase.deleteTransactions(req, function (err, data) {
    res.send(data);
  })
})
app.post("/addMonthtoDB/", jwtMW, function (req, res) {
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

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send({
      success: false,
      officialError: err,
      err: 'Username or password is incorrect 2'
    });

  } else {
    next(err);
  }
});

function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}