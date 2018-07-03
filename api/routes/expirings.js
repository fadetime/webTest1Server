const express = require('express');
const router = express.Router();
const ExpiringController = require('../controllers/expirings');

router.get('/', ExpiringController.expirings_get_list);
router.delete('/:tenantId', ExpiringController.expirings_delete_expiring);
module.exports = router;
