const { validationResult } = require("express-validator");

const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Fetching places has failed, please try again later" });
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  //   const errors = validationResult(req);
  //   if (!errors.isEmpty()) {
  //     return res.status(422).json( { message: 'Invalid inputs please try again'  });
  //   }
  console.log("here");
  const { name, email, password, places } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Signup failed, please try again later" });
  }

  if (existingUser) {
    return res.status(422).json({ message: "User already exists" });
  }

  const createdUser = new User({
    name,
    email,
    image: "http://elvis.rowan.edu/~burnse/assets/profs-logo.png",
    password,
    places,
  });

  console.log(createdUser);

  try {
    await createdUser.save();
  } catch (err) {
    console.log("fail");
    return res.status(500).json({ message: err.message });
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) }); // createdUser includes the PW
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return res.status(500).json({ message: "Login failed" });
  }

  if (!existingUser || existingUser.password !== password) {
    return res.status(422).json({ message: "Invalid credentials" });
  }

  res.json({ message: "Logged in!" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
