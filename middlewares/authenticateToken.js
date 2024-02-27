const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const reqtoken = req.headers['authorization'];
  const token=reqtoken.split(" ")[1]

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    req.user = decoded; 
    next();
  });
}

module.exports = authenticateToken;