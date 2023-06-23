const express = require('express');
const router = express.Router();
const { getAllUsers, createUser, getUser, updateUser, deleteUser } = require('../controllers/userController');
const { signup } = require('../controllers/authController');

router.route('/signup').post(signup);
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
