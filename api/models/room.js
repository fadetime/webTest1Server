const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
  roomType_ch: { type: String },
  roomType_en: { type: String },
  images: [{ type: String }],
  basePrice: { type: Number },
  capacity: { type: Number },
  tenants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' }],
  house: { type: mongoose.Schema.Types.ObjectId, ref: 'House' },
  roomState: { type: Number }
});

module.exports = mongoose.model('Room', roomSchema);
