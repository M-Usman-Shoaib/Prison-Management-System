const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const path = require("path");
const pino = require("pino")();
const expressPino = require("express-pino-logger");
const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const cors = require("cors");
const cookieParser = require('cookie-parser'); // Added

// Load environment variables
require("dotenv").config();

const authRoutes = require("./routes/auth");
const User = require("./models/User");
const prisonRoutes = require("./routes/prison");
const cellRoutes = require("./routes/cell");
const crimeRoutes = require("./routes/crime");
const inmateRoutes = require("./routes/inmate");
const visitorRoutes = require("./routes/visitor");
// const actionRoutes = require("./routes/action");

// Create an instance of Express
const app = express();

// Enable JSON parsing for incoming requests
app.use(express.json());

app.use(
  session({
      secret: "hfhfhffhf", // You should use a secret key here
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }, // Set `secure: true` if you're using HTTPS
  })
);

const corsOptions = {
  origin: ['http://localhost:5173'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser()); // Added
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Prison_Managment', {
    useNewUrlParser: true,
  })
  .catch((err) => {
    pino.error("Error occurred while connecting to MongoDB");
    pino.error(err);
  });

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || "herecomesthesecretkey",
};

passport.use(
  new JwtStrategy(jwtOptions, async function (jwt_payload, done) {
    try {
      const user = await User.findOne({ _id: jwt_payload.identifier });

      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (err) {
      done(err, false);
    }
  })
);

const logger = expressPino({ logger: pino });
app.use(logger);

app.use("/prison", prisonRoutes);
app.use("/cell", cellRoutes);
app.use("/crime", crimeRoutes);
app.use("/inmate", inmateRoutes);
app.use("/visitor", visitorRoutes);
app.use("/auth", authRoutes);

// Serve static files from the React build folder
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

// Handle React routing, return all requests to React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, async () => {
  pino.info(`Server is running on port ${port}`);
});
