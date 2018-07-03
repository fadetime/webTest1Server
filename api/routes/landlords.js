const express = require('express');
const router = express.Router();
const LandlordController = require('../controllers/landlords');

router.post('/create', LandlordController.landlords_create_landlord);
router.get('/', LandlordController.landlords_get_all);
router.get('/:landlordId', LandlordController.landlords_get_landlord);
router.patch('/:landlordId', LandlordController.landlords_update_landlord);
router.delete('/:landlordId', LandlordController.landlords_delete_landlord);
router.post('/search', LandlordController.landlords_search_landlord);
module.exports = router;
