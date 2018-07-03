const mongoose = require('mongoose');
const Room = require('../models/room');
const Tenant = require('../models/tenant');

exports.tenants_get_presentAll = (req, res, next) => {
  Tenant.find({ history: false }).then(doc => {
    res.send(doc);
  });
};

exports.tenants_create_tenant = (req, res, next) => {
  req.body.images = [];
  for (var i = 0; i < req.files.length; i++) {
    req.body.images[i] = req.files[i].path;
  }
  Tenant.create(req.body)
    .then(doc => {
      console.log(doc);
      res.json({
        status: 0,
        msg: '租客成功入住',
        payload: doc
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.tenants_get_tenant = (req, res, next) => {
  const _id = req.params.tenantId;
  Tenant.findById(_id)
    .populate('room clerk house')
    .then(doc => {
      console.log(doc);
      res.send(doc);
    })
    .catch(err => {
      console.log(err);
    });
};

exports.tenants_update_tenant = (req, res, next) => {
  const _id = req.params.tenantId;
  Tenant.updateMany({ _id: _id }, req.body)
    .then(doc => {
      console.log(doc);
      res.json({
        status: 0,
        msg: '租客数据更新成功'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.tenants_update_img = (req, res, next) => {
  const _id = req.params.tenantId;
  req.body.images = [];
  for (var i = 0; i < req.files.length; i++) {
    req.body.images[i] = req.files[i].path;
  }
  Tenant.updateMany({ _id: _id }, req.body)
    .then(doc => {
      var fs = require('fs');
      for (var i = 0; i < req.body.deleteImage.length; i++) {
        fs.unlink(req.body.deleteImage[i], err => {
          if (err) {
            console.log(err);
          }
          console.log('图片从服务器移除成功');
        });
      }
      console.log(doc);
      res.json({
        status: 0,
        msg: '照片更新成功'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.tenants_search_tenant = (req, res, next) => {
  if (req.body.condition === 'name') {
    const keyword = req.params.keyword;
    Tenant.find({
      $or: [{ name_ch: { $regex: keyword } }, { name_en: { $regex: keyword } }]
    })
      .then(doc => {
        console.log(doc);
        res.send(doc);
      })
      .catch(err => {
        console.log(err);
      });
  }
  if (req.body.condition === 'tel') {
    Tenant.find({
      tel: { $regex: req.params.keyword }
    })
      .then(doc => {
        res.send(doc);
      })
      .catch(err => {
        console.log(err);
      });
  }
};

exports.oneBtn = (req,res,next)=>{
    Tenant.update({_id:req.params.id},{paymentTime:req.body.paymentTime})
        .then(doc=>{
            res.json({
                status:0,
                msg:'成功交租'
            })
        })
}

exports.setCycle = (req,res,next)=>{
  Tenant.updateMany({},{cycle:1},{upsert:true}).then(doc=>{res.json({msg:'设置成功'})})
}