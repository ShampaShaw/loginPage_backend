//We have created a protected route to test the authentication middleware. This route will only be accessible if the user is logged in. If the user is not logged in, the middleware will return an error message. The route is created in the src/route/protected.js file.
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.get('/protected', authMiddleware, (req, res) => {
    res.send('You are authorized to access this route');
});

module.exports = router;