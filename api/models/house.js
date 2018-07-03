const mongoose = require('mongoose');

const houseSchema = mongoose.Schema({
  name_ch: { type: String },
  name_en: { type: String },
  address_ch: { type: String },
  address_en: { type: String },
  totalPeople: { type: Number, default: 0 },
  state_landlord: { type: Number, default: 0 },
  state_tenant: { type: Number, default: 0 },
  houseType_ch: { type: String },
  houseType_en: { type: String },
  images: [{ type: String }],
  basePrice: { type: Number },
  price: { type: Number },
  landlord: { type: mongoose.Schema.Types.ObjectId, ref: 'Landlord' },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
  rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],
  facilities_ch: { type: String },
  facilities_en: { type: String },
  postCode: { type: String },
  area_ch: { type: String },
  area_en: { type: String },
  rentalFee: { type: Number },
  deposit: { type: Number },
  contractPeriod: { type: Number },
  contractStart: { type: Date },
  contractEnd: { type: Date },
  wifiName: { type: String },
  paymentTime: { type: Date }
});

module.exports = mongoose.model('House', houseSchema);
