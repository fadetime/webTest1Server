const mongoose = require('mongoose');
const Room = require('../models/room');
const House = require('../models/house');

exports.rooms_get_room = (req, res, next) => {
  const _id = req.params.roomId;
  Room.findById(_id)
    .populate({
      path: 'house',
      populate: {
        path: 'tenant'
      }
    })
    .populate({
      path: 'tenants',
      populate: {
        path: 'clerk',
        select: 'name_ch name_en'
      }
    })
    .then(doc => {
      console.log(doc);
      res.send(doc);
    })
    .catch(err => {
      console.log(err);
    });
};

exports.rooms_create_room = (req, res, next) => {
  req.body.images = [];
  for (var i = 0; i < req.files.length; i++) {
    req.body.images[i] = req.files[i].path;
  }
  Room.create(req.body)
    .then(doc => {
      console.log(doc);
      res.json({
        status: 0,
        msg: '创建房间成功',
        payload: doc
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.rooms_update_room = (req, res, next) => {
  const _id = req.params.roomId;
  // req.body.images = [];
  // for (var i = 0; i < req.files.length; i++) {
  //   req.body.images[i] = req.files[i].path;
  // }
  Room.updateMany({ _id: _id }, req.body)
    .then(doc => {
      console.log(doc);
      res.json({
        status: 0,
        msg: '房间数据更新成功'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.rooms_add_images = (req, res, next) => {
  const _id = req.params.roomId;
  req.body.images = [];
  for (var i = 0; i < req.files.length; i++) {
    req.body.images[i] = req.files[i].path;
  }
  Room.update(
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

exports.rooms_delete_image = (req, res, next) => {
  const _id = req.params.roomId;
  const image = req.body.image;
  Room.update({ _id: _id }, { $pull: { images: image } })
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

exports.rooms_delete_tenant = (req, res, next) => {
  const _id = req.params.roomId;
  const tenant = req.body.tenant;
  Room.update(
    { _id: _id },
    { $pull: { tenants: tenant }, $set: { roomState: 0 } },
    { multi: true }
  )
    .then(doc => {
      res.json({
        status: 0,
        msg: '退房成功'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.rooms_delete_room = (req, res, next) => {
  const _id = req.params.roomId;
  Room.remove({ _id: _id })
    .then(doc => {
      House.update({ _id: req.body.houseId }, { $pull: { rooms: _id } })
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
            msg: '房间删除成功,相关图片从服务器移除成功,同时也在房屋处注销'
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
