const User = require('../models/user');

module.exports.createUser = (req, res, next) => {
  const args = [req.user.uid, req.user.email];
  User.create(args)
  .then(() => res.status(200).json({ valid: true, message: 'User created!' }))
  .catch((e) => res.status(400).json({ valid: false, message: e }));
}