const express = require('express');
const router = express.Router();
const ClerkController = require('../controllers/clerks');

router.get('/', ClerkController.clerks_get_all);
router.get('/:clerkId', ClerkController.clerks_get_clerk);
router.post('/create', ClerkController.clerks_create_clerk);
router.post('/login', ClerkController.clerks_login_clerk);
router.patch('/:clerkId', ClerkController.clerks_update_clerk);
router.delete('/:clerkId', ClerkController.clerks_delete_clerk);
router.patch('/performance/:clerkId', ClerkController.clerks_add_performance);
module.exports = router;
