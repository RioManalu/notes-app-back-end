const Joi = require('joi');

// Unknown merupakan fungsi untuk membuat objek bersifat tidak diketahui.
const ImageHeadersSchema = Joi.object({
  'content-type': Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp').required(),
}).unknown();

module.exports = { ImageHeadersSchema };