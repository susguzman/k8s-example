const firebase = require('../services/firebase')

const firebaseGuard = async (req, res, next) => {
  if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    return res.status(403).json({ valid: false, message: 'Unauthorized' });
  }
  let idToken = req.headers.authorization.split('Bearer ')[1];
  try {
    const decodedIdToken = await firebase.auth().verifyIdToken(idToken);
    req.user = decodedIdToken;
    next();
  } catch (e) {
    console.log(e);
    return res.status(403).json({ valid: false, message: 'Unauthorized' });
  }
};

module.exports = firebaseGuard;