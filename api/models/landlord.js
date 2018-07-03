const mongoose = require('mongoose');

const landlordSchema = mongoose.Schema({
  name_ch: { type: String },
  name_en: { type: String },
  tel: { type: Number },
  id: { type: String },
  accountType: { type: String },
  accountNumber: { type: String },
  houses: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'House', default: null }
  ],
  citizenship_ch: { type: String },
  citizenship_en: { type: String }
});

module.exports = mongoose.model('Landlord', landlordSchema);
