const express = require('express');
const router = express.Router();
const RoomController = require('../controllers/rooms');
const uploadImages = require('../middleware/multerUse');

router.get('/:roomId', RoomController.rooms_get_room);
router.post(
  '/create',
  uploadImages.storeImages,
  RoomController.rooms_create_room
);
router.post(
  '/addImages/:roomId',
  uploadImages.storeImages,
  RoomController.rooms_add_images
);
router.post('/deleteImage/:roomId', RoomController.rooms_delete_image);
router.post('/checkOut/:roomId', RoomController.rooms_delete_tenant);
router.patch('/:roomId', RoomController.rooms_update_room);
router.delete('/:roomId', RoomController.rooms_delete_room);
module.exports = router;
