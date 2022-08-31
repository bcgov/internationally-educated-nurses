const jwt = require('jsonwebtoken');

const iat = Math.floor(Date.now() / 1000);
const expiresIn = 5 * 60;
const payload = {
  iat,
  exp: iat + expiresIn,
};
const options = {
  algorithm: 'HS256',
};

const secret = process.env.JWT_SECRET || 'jwtsecret';
const token = jwt.sign(payload, secret, options);
console.log(token);
