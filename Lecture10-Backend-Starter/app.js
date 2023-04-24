const express = require("express");
const bodyParser = require("body-parser");

//STEP 1 import Mongoose
const Mongoose = require("mongoose");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const { default: mongoose } = require("mongoose");

const app = express();

//STEP 1 add a new MiddleWare that parses the data
//routes are read top to bottom
//first parse the body then reach the routes
//NOTE: bodyParser.JSON will parse any JSON data and desearlize into JavaScript
//then it will call NEXT and fall into the next middleware which is "/api/places"
app.use(bodyParser.json());

//STEP 1 - add a middleware function
//the idea is that we do not send back a response but add certain headers to the response
app.use((req, res, next) => {
  //This allows us to controls with domains have access to these resources
  res.setHeader("Access-Control-Allow-Origin", "*");

  //This controls within headers are allowed
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  //This basically controls which HTTP methods can be used on the frontend
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  //move to next middleware
  next();
});

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured" });
});

//STEP 2
//mongoose.connect().then().catch();
const url =
  "mongodb+srv://george72:dvBQ7CguvfLhq6y3@cluster0.kbt6yyp.mongodb.net/products_lecture?retryWrites=true&w=majority";
mongoose
  .connect(url)
  .then(() => {
    //if connection was successful then we start our backend server
    app.listen(3001);
  })
  .catch((err) => {
    console.log(err);
  });

//app.listen(3001);
