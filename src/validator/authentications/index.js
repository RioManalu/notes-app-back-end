const {
  postAuthenticationPayloadSchema, 
  putAuthenticationPayloadSchema, 
  deleteAuthenticationPayloadShema
} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const AuthenticationsValidator = {
  validatePostAuthenticationPayload : (payload) => {
    const validationResult = postAuthenticationPayloadSchema.validate(payload);
    if(validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validatePutAuthenticationPayload : (payload) => {
    const validationResult = putAuthenticationPayloadSchema.validate(payload);
    if(validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateDeleteAuthenticationPayload : (payload) => {
    const validationResult = deleteAuthenticationPayloadShema.validate(payload);
    if(validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
}

module.exports = AuthenticationsValidator;