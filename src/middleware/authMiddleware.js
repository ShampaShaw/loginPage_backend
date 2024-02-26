// This file contains the middleware function to authenticate the user
//Middleware functions are functions that have access to the request object (req), the response object (res), and the next function in the application’s request-response cycle. The next function is a function in the Express router which, when invoked, executes the middleware succeeding the current middleware.
const authMiddleware = async (req, res, next) => {       // Create a new middleware
    try {
        const token = req.cookies.token;                  // Get the token from the cookie
        if(!token) {
            return res.status(401).send('Unauthorized');   // If the token is not present, the user is not logged in
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify the token
        req.user = decoded;                                           // If the token is valid, set the user data in the request object
        next();                                                     // Call the next middleware
    } catch (error) {
        res.status(401).send('Unauthorized');                      // If the token is invalid, send an error
    }
}

module.exports = authMiddleware;