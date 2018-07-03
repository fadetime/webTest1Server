const mongoose = require('mongoose');
const HouseExpiring = require('../models/houseExpiring');

exports.houseExpirings_get_list = (req, res, next) => {
  HouseExpiring.find()
    .populate('house')
    .then(doc => {
      res.send(doc);
    });
};

exports.houseExpirings_delete_expiring = (req, res, next) => {
  HouseExpiring.findOneAndRemove({ house: req.params.houseId }).then(doc => {
    res.send(doc);
  });
};
