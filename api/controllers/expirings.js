const mongoose = require('mongoose');
const Expiring = require('../models/expiring');

exports.expirings_get_list = (req, res, next) => {
  Expiring.find()
    .populate('tenant')
    .then(doc => {
      res.send(doc);
    });
};

exports.expirings_delete_expiring = (req, res, next) => {
  Expiring.findOneAndRemove({ tenant: req.params.tenantId }).then(doc => {
    res.send(doc);
  });
};
