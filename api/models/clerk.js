const mongoose = require('mongoose');

const clerkSchema = mongoose.Schema({
  name_ch: { type: String },
  name_en: { type: String },
  tel: { type: Number },
  id: { type: String },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  password: { type: String, required: true },
  role: { type: String, default: 'clerk' },
  createdDate: { type: Date, default: Date.now },
  performance: { type: Number, default: 0 }
});

module.exports = mongoose.model('Clerk', clerkSchema);
