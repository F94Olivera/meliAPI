// TODO takeout clave_secreta to be read as process.env
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para verificar el JWT
exports.verifyJWT = (req, res, next) => {
  const token = req.header('Authorization').split(' ')[1];

  if (!token) {
    return res.status(401).send('Acceso denegado');
  }

  try {
    const verified = jwt.verify(token, 'clave_secreta');
    req.user = User.findById(verified._id);
    next();
  } catch (err) {
    res.status(400).send('Token inválido');
  }
};

exports.generateJWT = (username) => {
  return jwt.sign({ _id: username }, 'clave_secreta', { expiresIn: '1h' });
};
