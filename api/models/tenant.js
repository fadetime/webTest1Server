const mongoose = require('mongoose');

const tenantSchema = mongoose.Schema({
  name_ch: { type: String },
  name_en: { type: String },
  gender_ch: { type: String },
  gender_en: { type: String },
  tel: { type: String },
  images: [{ type: String }],
  citizenship_ch: { type: String },
  citizenship_en: { type: String },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  house: { type: mongoose.Schema.Types.ObjectId, ref: 'House' },
  paymentTime: { type: Date },
  cycle:{type:Number},
  rentalFee: { type: Number },
  deposit: { type: Number },
  contractPeriod: { type: Number },
  contractStart: { type: Date },
  contractEnd: { type: Date },
  history: { type: Boolean, default: false },
  clerk: { type: mongoose.Schema.Types.ObjectId, ref: 'Clerk' }
});

module.exports = mongoose.model('Tenant', tenantSchema);
