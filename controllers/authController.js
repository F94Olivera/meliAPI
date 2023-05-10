const authService = require('../services/authService');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { accessToken } = await authService.authenticate(email, password);

    res.cookie('access_token', accessToken, {
      httpOnly: true
    });

    return res.json({ message: 'Inicio de sesión exitoso' });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: err.message });
  }
};
