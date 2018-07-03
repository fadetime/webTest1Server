const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const checkState = require('./api/middleware/checkState');

// 连接MongoDB by using mongoose
mongoose.connect('mongodb://127.0.0.1/Housing');
mongoose.Promise = global.Promise;

// 创建Routes实例
const clerkRoutes = require('./api/routes/clerks');
const houseRoutes = require('./api/routes/houses');
const roomRoutes = require('./api/routes/rooms');
const landlordRoutes = require('./api/routes/landlords');
const tenantRoutes = require('./api/routes/tenants');
const expiringRoutes = require('./api/routes/expirings');
const houseExpiringRoutes = require('./api/routes/houseExpirings');

// **************************一系列的middleware************************
// 打印请求状态
app.use(morgan('dev'));

//使图片文件夹能被访问
app.use('/uploads', express.static('uploads'));

// Parsing the Body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Handling CORS 跨域请求
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

// *******************************************************************

// 使用Routes实例
app.use('/clerks', clerkRoutes);
app.use('/houses', houseRoutes);
app.use('/rooms', roomRoutes);
app.use('/landlords', landlordRoutes);
app.use('/tenants', tenantRoutes);
app.use('/expirings', expiringRoutes);
app.use('/houseExpirings', houseExpiringRoutes);
// handling error
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
