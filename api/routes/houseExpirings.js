const express = require('express');
const router = express.Router();
const HouseExpiringController = require('../controllers/houseExpirings');

router.get('/', HouseExpiringController.houseExpirings_get_list);
router.delete(
  '/:houseId',
  HouseExpiringController.houseExpirings_delete_expiring
);
module.exports = router;
