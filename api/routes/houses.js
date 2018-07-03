const express = require('express');
const router = express.Router();
const HouseController = require('../controllers/houses');
const uploadImages = require('../middleware/multerUse');

router.post('/list/:page/:pageSize', HouseController.houses_load_list);
router.get('/:houseId', HouseController.houses_get_house);
router.post(
  '/create',
  uploadImages.storeImages,
  HouseController.houses_create_house
);
router.patch('/:houseId', HouseController.houses_update_house);
router.post(
  '/addImages/:houseId',
  uploadImages.storeImages,
  HouseController.houses_add_images
);
router.post('/deleteImage/:houseId', HouseController.houses_delete_image);
router.delete('/:houseId', HouseController.houses_delete_house);
router.get('/checkDateRooms/:houseId', HouseController.houses_checkDate_room);
router.post(
  '/search/:keyword/:page/:pageSize',
  HouseController.houses_search_houses
);
router.get('/list/allHouses',HouseController.houses_load_ALL)
router.post('/payment/:id',HouseController.oneBtn)
module.exports = router;
