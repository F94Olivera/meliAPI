const jwt = require('jsonwebtoken');
const User = require('../models/User');
const permissions = require('../helpers/permissions');

exports.authorize = async (req, res, next) => {
  try {
    console.log('req ', req);
    const token = req.cookies.access_token;

    if (!token) {
      return res.status(401).json({ message: 'No se proporcionó un token de acceso' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Token de acceso inválido' });
    }

    const allowedRoutes = permissions[user.role].allowedRoutes;

    if (!allowedRoutes.includes(req.path)) {
      return res.status(403).json({ message: 'No tienes permisos suficientes para realizar esta acción' });
    }

    req.userId = decoded.userId;
    req.role = user.role;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Token de acceso inválido' });
  }
};
