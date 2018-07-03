const mongoose = require('mongoose');
const Room = require('../models/room');
const House = require('../models/house');
const Tenant = require('../models/tenant');
const Expiring = require('../models/expiring');
const HouseExpiring = require('../models/houseExpiring');
var schedule = require('node-schedule');

var createHouseExpiring = () => {
  var timeSpan = [];
  var doc = [];
  House.find({})
    .select('contractEnd')
    .then(document => {
      doc = document;
      for (var i = 0; i < doc.length; i++) {
        timeSpan[i] = Math.floor(
          (Date.parse(doc[i].contractEnd) - Date.now()) / (1000 * 60 * 60 * 24)
        );
        if (timeSpan[i] < 30) {
          const data = {
            house: doc[i]._id,
            daysLeft: timeSpan[i]
          };
          if (timeSpan[i] < 0) {
            House.update({ _id: doc[i]._id }, { state_landlord: 2 }).then(
              doc => {
                console.log(doc);
              }
            );
          } else {
            House.update({ _id: doc[i]._id }, { state_landlord: 1 }).then(
              doc => {
                console.log(doc);
              }
            );
          }

          HouseExpiring.update({ house: doc[i]._id }, data, {
            upsert: true
          }).then(updoc => {
            console.log(updoc);
          });
        } else {
          HouseExpiring.remove({ house: doc[i]._id }).then(rmdoc => {
            console.log(rmdoc);
          });

          House.update({ _id: doc[i]._id }, { state_landlord: 0 }).then(doc => {
            console.log(doc);
          });
        }
      }
      console.log(timeSpan);
    });
};

var createExpiring = () => {
  var timeSpan = [];
  var doc = [];
  Tenant.find({ history: false })
    .select('contractEnd')
    .then(document => {
      doc = document;
      for (var i = 0; i < doc.length; i++) {
        timeSpan[i] = Math.floor(
          (Date.parse(doc[i].contractEnd) - Date.now()) / (1000 * 60 * 60 * 24)
        );
        if (timeSpan[i] < 30) {
          const data = {
            tenant: doc[i]._id,
            daysLeft: timeSpan[i]
          };
          Expiring.update({ tenant: doc[i]._id }, data, { upsert: true }).then(
            updoc => {
              console.log(updoc);
            }
          );
        } else {
          Expiring.remove({ tenant: doc[i]._id }).then(rmdoc => {
            console.log(rmdoc);
          });
        }
      }
      console.log(timeSpan);
    });
};

var rooms = new Array();
var houses = new Array();
var unique = array => {
  var a = new Array();
  for (m in array) {
    a[array[m]] = 1;
  }
  var b = new Array();
  for (n in a) {
    b.push(n);
  }
  return b;
};

var getRoomsHouses = () => {
  rooms = [];
  houses = [];
  Expiring.find()
    .select('tenant')
    .populate({
      path: 'tenant',
      select: 'room house'
    })
    .then(doc => {
      for (var i = 0; i < doc.length; i++) {
        if (doc[i].tenant.room) {
          rooms.push(doc[i].tenant.room);
        }
        if (doc[i].tenant.house) {
          houses.push(doc[i].tenant.house);
        }
      }
      rooms = unique(rooms);
      houses = unique(houses);
    });
};

var updateState = () => {
  console.log(rooms);
  console.log(houses);
  if (houses.length !== 0) {
    for (var i = 0; i < houses.length; i++) {
      House.findByIdAndUpdate(houses[i], { state_tenant: 2 })
        .select('state_tenant')
        .then(doc => {});
    }
  }
  if (rooms.length !== 0) {
    for (var i = 0; i < rooms.length; i++) {
      Room.findOneAndUpdate({ _id: rooms[i], roomState: 2 }, { roomState: 1 })
        .select('roomState')
        .then(doc => {});
    }
  }
};

var async = require('async');
var total = new Array();
var capacity = new Array();
var roomState = false;
var changeHouseStateFromRoomState = () => {
  total = [];
  capacity = [];
  roomState = false;
  async.waterfall([getHouseList, getTotalTenants], function(
    err,
    total,
    capacity
  ) {
    // console.log(total);
    // console.log(capacity);
  });
};
function getHouseList(callback) {
  House.find()
    .select('rooms tenant')
    .then(doc => {
      callback(null, doc);
    });
}
function getTotalTenants(houseList, callback) {
  var i = 0;
  var j = 0;
  async.whilst(
    () => {
      return i < houseList.length;
    },
    cb1 => {
      i++;
      total[i - 1] = 0;
      capacity[i - 1] = 0;
      roomState = false;
      j = 0;
      async.whilst(
        () => {
          return j < houseList[i - 1].rooms.length;
        },
        cb2 => {
          j++;
          Room.findById(houseList[i - 1].rooms[j - 1])
            .select('tenants capacity roomState')
            .then(rodoc => {
              total[i - 1] = total[i - 1] + rodoc.tenants.length;
              capacity[i - 1] = capacity[i - 1] + rodoc.capacity;
              if (rodoc.roomState === 1) {
                roomState = true;
              }
              cb2(null, total[i - 1], capacity[i - 1], roomState);
            });
        },
        (err, totalSingle, capacitySingle, roomState) => {
          if (!houseList[i - 1].tenant) {
            var data = {};
            if (totalSingle < capacitySingle) {
              if (totalSingle === 0) {
                data = {
                  state_tenant: 0
                };
              } else {
                data = {
                  state_tenant: 1
                };
              }
            } else {
              if (roomState) {
                data = {
                  state_tenant: 3
                };
              } else {
                data = {
                  state_tenant: 4
                };
              }
            }

            House.findByIdAndUpdate(houseList[i - 1]._id, data)
              .select('_id')
              .then(doc => {
                cb1(null, total, capacity);
              });
          }
        }
      );
    },
    (err, total, capacity) => {
      callback(null, total, capacity);
    }
  );
}
var checkState = () => {
  schedule.scheduleJob('0 0 0 * * *', function() {
    createHouseExpiring();
    createExpiring();
    setTimeout(() => {
      getRoomsHouses();

      setTimeout(() => {
        updateState();

        setTimeout(() => {
          changeHouseStateFromRoomState();
        }, 5000);
      }, 5000);
    }, 5000);
  });
};

checkState();
module.exports = checkState;
