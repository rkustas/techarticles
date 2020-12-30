// Import AWS SDK
const AWS = require("aws-sdk");

// Import User model
const User = require("../models/user");

// Import an use jwt web token
const jwt = require("jsonwebtoken");

// Import registerEmailParams helper
const {
  registerEmailParams,
  forgotPasswordEmailParams,
} = require("../helpers/email");

// Import short id
const shortId = require("shortid");

// Import jwt-express
const expressJwt = require("express-jwt");

// Bring in lodash
const _ = require("lodash");

const Link = require("../models/link");

// Update AWS settings
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Create SES object
const ses = new AWS.SES({ apiVersion: "2010-12-01" });

// Register function and parameters to be used in SDK sendemail function
exports.register = (req, res) => {
  // console.log('REGISTER CONTROLLER', req.body);
  const { name, email, password, categories } = req.body;

  // Check if user exists in database
  User.findOne({ email }).exec((err, user) => {
    if (user) {
      // If user exists, there is an email already, return invalid response JSON
      console.log(error);
      return res.status(400).json({
        error: "Email is taken",
      });
    }
    // Generate Json web token with username,email, pw and random account activation code

    const token = jwt.sign(
      { name, email, password, categories },
      process.env.JWT_ACCOUNT_ACTIVATION,
      {
        expiresIn: "10m",
      }
    );

    // Use email parameter helper function
    const params = registerEmailParams(email, token);

    //   Send Email function promise
    const sendEmailOnRegister = ses.sendEmail(params).promise();

    //   Upon promise do some things
    sendEmailOnRegister
      .then((data) => {
        console.log("email submitted to SES", data);
        res.json({
          message: `Email has been sent to ${email}. Follow the instructions to complete your registration`,
        });
      })
      .catch((error) => {
        console.log("ses email on register", error);
        res.json({
          message: `We could not verify you email.  Please try again`,
        });
      });
  });
};

// Function to activate registration, links to and is used in the auth.js for routes
exports.registerActivate = (req, res) => {
  const { token } = req.body;
  // console.log(token);

  // If token has expired
  jwt.verify(
    token,
    process.env.JWT_ACCOUNT_ACTIVATION,
    function (err, decoded) {
      if (err) {
        return res.status(401).json({
          error: "Expired link.  Try again",
        });
      }

      // Create user if token valid and email is unique
      const { name, email, password, categories } = jwt.decode(token);
      // Create username
      const username = shortId.generate();

      // Query db
      User.findOne({ email }).exec((err, user) => {
        if (user) {
          // User is found, return email taken
          return res.status(401).json({
            error: "Email is taken",
          });
        }
        // User not found, create new user
        const newUser = new User({
          username,
          name,
          email,
          password,
          categories,
        });
        newUser.save((err, result) => {
          if (err) {
            return res.status(401).json({
              error: "Error saving user in database.  Try again later",
            });
          }
          return res.json({
            message: "Registration success. Please login",
          });
        });
      });
    }
  );
};

// Login function
exports.login = (req, res) => {
  // Grab login information use POSTMAN to verify the POST is working
  const { email, password } = req.body;

  // console.table({ email, password });

  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with that email does not exist.  Please register",
      });
    }
    // If there is user, then authenticate
    if (!user.authenticate(password)) {
      // The email and password do not match, there isn't a user
      return res.status(400).json({
        error: "Email and password do not match",
      });
    }
    // Generate token and send to client
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    const { _id, name, email, role } = user;

    return res.json({
      token,
      user: { _id, name, email, role },
    });
  });
};

// Validation of user returns req.user_id
exports.reqSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  // Better for cross-origin and oauth types
  algorithms: ["HS256"],
});

// Once we have req.user_id
exports.authMiddleware = (req, res, next) => {
  const authUserId = req.user._id;
  // Query database
  User.findOne({ _id: authUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found!",
      });
    }
    // We have the user, populate a profile for that user
    req.profile = user;
    next();
  });
};

// Once we have req.user_id
exports.adminMiddleware = (req, res, next) => {
  const adminUserId = req.user._id;
  // Query database
  User.findOne({ _id: adminUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found!",
      });
    }
    // Check if user.role is not the admin
    if (user.role != "admin") {
      // Send error message
      return res.status(400).json({
        error: "Admin resource.  Access denied.",
      });
    }

    // We have the user, populate a profile for that user
    req.profile = user;
    next();
  });
};

exports.forgotPassword = (req, res) => {
  // Check if user exists based on email
  const { email } = req.body;
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with that email does not exist",
      });
    }
    // Generate a token
    const token = jwt.sign(
      { name: user.name },
      process.env.JWT_RESET_PASSWORD,
      { expiresIn: "10m" }
    );
    // Email that token
    // Send email
    const params = forgotPasswordEmailParams(email, token);

    // Populate the database with user reset password link
    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        return res.status(400).json({
          error: "Password reset failed. Try later.",
        });
      }
      const sendEmail = ses.sendEmail(params).promise();
      sendEmail
        .then((data) => {
          console.log("ses reset pw success", data);
          return res.json({
            message: `Email has been sent to ${email}, click on the link to reset the password`,
          });
        })
        .catch((error) => {
          console.log("ses reset pw failed", error);
          return res.json({
            message: `We could not verify your email. Try later`,
          });
        });
    });
  });
};

exports.resetPassword = (req, res) => {
  // Reset password link and new password

  const { resetPasswordLink, newPassword } = req.body;

  if (resetPasswordLink) {
    // Check if time on link has expired by secret
    jwt.verify(
      resetPasswordLink,
      process.env.JWT_RESET_PASSWORD,
      (err, success) => {
        if (err) {
          return res.status(400).json({
            error: "Expired Link.  Try again.",
          });
        }
        // Once we verify, find the user based on the reset link
        User.findOne({ resetPasswordLink }).exec((err, user) => {
          if (err || !user) {
            return res.status(400).json({
              error: "Invalid token. Try again.",
            });
          }

          // Update fields, password and password reset link
          const updatedFields = {
            password: newPassword,
            resetPasswordLink: "",
          };

          // Using lodash to merge user object with updatedFields
          user = _.extend(user, updatedFields);

          // Save user back to database
          user.save((err, result) => {
            if (err || !user) {
              return res.status(400).json({
                error: "Password reset failed.  Try again",
              });
            }

            // Message that you are successful
            res.json({
              message: "Password Reset! Login with your new password",
            });
          });
        });
      }
    );
  }
};

exports.canUpdateDeleteLink = (req, res, next) => {
  // Grab slug
  const { id } = req.params;

  Link.findOne({ _id: id }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "Could not find link",
      });
    }
    let authorizedUser =
      data.postedBy._id.toString() === req.user._id.toString();
    if (!authorizedUser) {
      return res.status(400).json({
        error: "You are not authorized",
      });
    }
    // Continue to execute
    next();
  });
};
