const mongoose = require('mongoose');

const houseExpiringSchema = mongoose.Schema({
  house: { type: mongoose.Schema.Types.ObjectId, ref: 'House' },
  daysLeft: { type: Number }
});

module.exports = mongoose.model('HouseExpiring', houseExpiringSchema);
