const express = require('express');
const router = express.Router();
const TenantController = require('../controllers/tenants');
const uploadImages = require('../middleware/multerUse');

router.post(
  '/create',
  uploadImages.storeImages,
  TenantController.tenants_create_tenant
);
router.get('/:tenantId', TenantController.tenants_get_tenant);
router.patch('/:tenantId', TenantController.tenants_update_tenant);
router.patch(
  '/updateImage/:tenantId',
  uploadImages.storeImages,
  TenantController.tenants_update_img
);
router.get('/', TenantController.tenants_get_presentAll);
router.post('/search/:keyword', TenantController.tenants_search_tenant);
router.post('/payment/:id',TenantController.oneBtn)
router.post('/setCycle',TenantController.setCycle)
module.exports = router;
