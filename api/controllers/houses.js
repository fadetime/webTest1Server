const mongoose = require('mongoose');
const House = require('../models/house');
const Landlord = require('../models/landlord');

exports.houses_search_houses = (req, res, next) => {
  let currentPage =
    parseInt(req.params.page) > 0 ? parseInt(req.params.page) : 1;
  let pageSize =
    parseInt(req.params.pageSize) > 0 ? parseInt(req.params.pageSize) : 10;
  // 要跳过多少条
  let skip = (currentPage - 1) * pageSize;
  if (req.body.condition === 'area') {
    const keyword = req.params.keyword;
    House.find({
      $or: [{ area_ch: { $regex: keyword } }, { area_en: { $regex: keyword } }]
    })
      .limit(pageSize)
      .skip(skip)
      .select(
        '_id name_ch address_ch houseType_ch name_en address_en houseType_en basePrice state_landlord state_tenant paymentTime images price area_ch area_en'
      )
      .then(doc => {
        console.log(doc);
        res.send(doc);
      })
      .catch(err => {
        console.log(err);
      });
  }
  if (req.body.condition === 'postCode') {
    House.find({
      postCode: { $regex: req.params.keyword }
    })
      .limit(pageSize)
      .skip(skip)
      .select(
        '_id name_ch address_ch houseType_ch name_en address_en houseType_en basePrice state_landlord state_tenant paymentTime images price area_ch area_en'
      )
      .then(doc => {
        res.send(doc);
      })
      .catch(err => {
        console.log(err);
      });
  }
};

exports.houses_load_list = (req, res, next) => {
  let currentPage =
    parseInt(req.params.page) > 0 ? parseInt(req.params.page) : 1;
  let pageSize =
    parseInt(req.params.pageSize) > 0 ? parseInt(req.params.pageSize) : 10;
  // 要跳过多少条
  let skip = (currentPage - 1) * pageSize;
  House.find()
    .limit(pageSize)
      .sort({_id:-1})
    .skip(skip)
    .select(
      '_id name_ch address_ch houseType_ch name_en address_en houseType_en basePrice state_landlord state_tenant paymentTime images price area_ch area_en'
    )
    .then(doc => {
      House.find()
          .then(docc=>{
              res.json({
                  payload:doc,
                  total:docc.length
              })
          })
    })
    .catch(err => {
      console.log(err);
    });
};

exports.houses_checkDate_room = (req, res, next) => {
  House.findById(req.params.houseId)
    .select('rooms')
    .populate({
      path: 'rooms',
      select: 'tenants',
      populate: { path: 'tenants', select: 'contractEnd' }
    })
    .then(doc => {
      console.log(doc);
      res.send(doc);
    })
    .catch(err => {
      console.log(err);
    });
};

exports.houses_get_house = (req, res, next) => {
  const _id = req.params.houseId;
  House.findById(_id)
    .populate('landlord')
    .populate({
      path: 'rooms',
      populate: { path: 'tenant', populate: { path: 'clerk' } }
    })
    .populate({ path: 'tenant', populate: { path: 'clerk' } })
    .then(doc => {
      res.send(doc);
    })
    .catch(err => {
      console.log(err);
    });
};

exports.houses_create_house = (req, res, next) => {
  req.body.images = [];
  for (var i = 0; i < req.files.length; i++) {
    req.body.images[i] = req.files[i].path;
  }
  House.create(req.body)
    .then(doc => {
      console.log(doc);
      res.json({
        status: 0,
        msg: '创建房屋成功',
        payload: doc
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.houses_update_house = (req, res, next) => {
  const _id = req.params.houseId;
  // req.body.images = [];
  // for (var i = 0; i < req.files.length; i++) {
  //   req.body.images[i] = req.files[i].path;
  // }
  House.updateMany({ _id: _id }, req.body)
    .then(doc => {
      console.log(doc);
      res.json({
        status: 0,
        msg: '房屋数据更新成功'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.houses_add_images = (req, res, next) => {
  const _id = req.params.houseId;
  req.body.images = [];
  for (var i = 0; i < req.files.length; i++) {
    req.body.images[i] = req.files[i].path;
  }
  House.update(
    { _id: _id },
    { $addToSet: { images: { $each: req.body.images } } }
  )
    .then(doc => {
      res.json({
        msg: '添加图片成功'
      });
      console.log(doc);
    })
    .catch(err => {
      console.log(err);
    });
};

exports.houses_delete_image = (req, res, next) => {
  const _id = req.params.houseId;
  const image = req.body.image;
  House.update({ _id: _id }, { $pull: { images: image } })
    .then(doc => {
      let fs = require('fs');
      fs.unlink(image, err => {
        if (err) {
          console.log(err);
        }
        console.log('图片从服务器移除成功');
      });
      console.log('删除图片成功');
      res.json({
        status: 0,
        msg: '删除图片成功'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.houses_delete_house = (req, res, next) => {
  const _id = req.params.houseId;
  House.remove({ _id: _id })
    .then(doc => {
      Landlord.update({ _id: req.body.landlordId }, { $pull: { houses: _id } })
        .then(doc => {
          let fs = require('fs');
          for (var i = 0; i < req.body.images.length; i++) {
            fs.unlink(req.body.images[i], err => {
              if (err) {
                console.log(err);
              }
            });
          }
          res.json({
            status: 0,
            msg: '房屋删除成功,相关图片从服务器移除成功,同时也在房东处注销'
          });
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.houses_load_ALL = (req, res, next) => {
    House.find()
        .then(doc => {
            res.json({
                status:0,
                payload:doc
            })
        })
        .catch(err => {
            console.log(err);
        });
};

exports.oneBtn = (req,res,next)=>{
    House.update({_id:req.params.id},{paymentTime:req.body.paymentTime})
        .then(doc=>{
            res.json({
                status:0,
                msg:'成功交租'
            })
        })
}