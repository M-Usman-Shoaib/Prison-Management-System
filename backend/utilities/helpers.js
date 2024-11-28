// Import the jsonwebtoken library for handling JSON Web Tokens (JWT)
const jwt = require("jsonwebtoken");

// Create an object to store exports
exports = {};

// Export an object with a single method called "getToken"
exports.getToken = (email, user) => {
    // Generate a JWT with the user's identifier (usually user ID) and a secret key
    const token = jwt.sign({ identifier: user._id }, "herecomesthesecretkey");

    // Return the generated token
    return token;
};

// Reassign the module.exports to the created exports object
module.exports = exports;
