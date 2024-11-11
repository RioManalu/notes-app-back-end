const Jwt = require('@hapi/jwt');
const InvariantError = require('../exceptions/InvariantError');

const TokenManager = {
  /* Parameter payload merupakan objek yang disimpan ke dalam salah satu artifacts JWT. 
  Biasanya objek payload berisi properti yang mengindikasikan identitas pengguna, 
  contohnya user id.
  */
  generateAccessToken : (payload) => Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),
  generateRefreshToken : (payload) => Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY),

  verifyRefreshToken : (refreshToken) => {
    /*
    decode refreshtoken dulu karena
    verifySignature hanya menerima token dalam bentuk artifacts 
    atau token yang sudah di-decoded.
    */
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);

      // Nilai payload tersebut nantinya akan digunakan dalam membuat akses token baru
      const { payload } = artifacts.decoded;
      return payload
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid');
    }
  } 
}

module.exports = TokenManager;