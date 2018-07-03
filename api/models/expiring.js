const mongoose = require('mongoose');

const expiringSchema = mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
  daysLeft: { type: Number }
});

module.exports = mongoose.model('Expiring', expiringSchema);
