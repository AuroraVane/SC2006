const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Get token from the request header
  
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token with the secret
      req.user = decoded; // Attach decoded user info to the request object
      next(); // Move to the next middleware
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token.' });
    }
  };
  
module.exports = authenticateJWT;