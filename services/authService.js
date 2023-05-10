const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authenticate = async (email, password) => {
  try {
    // Busca el usuario en la base de datos
    const user = await User.findOne({ email });

    // Verifica si la contraseña es correcta
    if (!user || !(await user.checkPassword(password))) {
      throw new Error('Credenciales incorrectas');
    }

    // Genera un token de acceso
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    return { accessToken };
  } catch (err) {
    console.error(err);
    throw new Error('Error en la autenticación');
  }
};
