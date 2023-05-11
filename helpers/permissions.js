const permissions = {
  admin: {
    allowedRoutes: ['/', '/api/shows', '/api/reservations']
  },
  user: {
    allowedRoutes: ['/', '/api/reservations']
  }
};

module.exports = permissions;
