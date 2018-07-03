const mongoose = require('mongoose');
const Landlord = require('../models/landlord');

exports.landlords_create_landlord = (req, res, next) => {
  Landlord.create(req.body)
    .then(doc => {
      res.json({
        status: 0,
        msg: '成功创建房东',
        payload: doc
      });
    })
    .catch(err => {
      console.log(err);
    });
};
exports.landlords_update_landlord = (req, res, next) => {
  const _id = req.params.landlordId;
  Landlord.updateMany({ _id: _id }, req.body)
    .then(doc => {
      console.log(doc);
      res.send(doc);
    })
    .catch(err => {
      console.log(err);
    });
};

exports.landlords_delete_landlord = (req, res, next) => {
  const _id = req.params.landlordId;
  Landlord.findByIdAndRemove(_id)
    .then(doc => {
      console.log(doc);
      res.send(doc);
    })
    .catch(err => {
      console.log(err);
    });
};

exports.landlords_get_all = (req, res, next) => {
  Landlord.find()
    .then(doc => {
      res.send(doc);
    })
    .catch(err => {
      console.log(err);
    });
};

exports.landlords_get_landlord = (req, res, next) => {
  const _id = req.params.landlordId;
  Landlord.findById(_id)
    .then(doc => {
      res.send(doc);
    })
    .catch(err => {
      console.log(err);
    });
};

exports.landlords_search_landlord = (req, res, next) => {
  const keyword = req.body.keyword;
  Landlord.find({
    $or: [{ name_ch: { $regex: keyword } }, { name_en: { $regex: keyword } }]
  })
    .select('_id name_ch name_en')
    .then(doc => {
      console.log(doc);
      res.send(doc);
    })
    .catch(err => {
      console.log(err);
    });
};
