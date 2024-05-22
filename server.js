const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const session = require("express-session");
const userRoute = require("./routes/userRoute");
const { errorMiddleware } = require("./middlewares/error");
const setupSwagger = require('./swagger');

// Create a new express application instance
const app = express();

// Load environment variables
dotenv.config();


//Swagger configuration
setupSwagger(app);

// Middleware for sessions
app.use(
  session({
    name: "sessionID",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true in production with HTTPS
  })
);

// Middleware for parsing JSON bodies
app.use(bodyParser.json());

// Routes
app.use("/api", userRoute);

//Error handlers
app.use(errorMiddleware);

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});
