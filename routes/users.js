const express = require('express')
const multer = require('multer')
const {protect} = require('../middleware/authMiddleware')

const router = express.Router()

const {authUser, registerUser, verifyStudent, logoutUser, Upload, UpdateUserprofile, getUserprofile, makePayment, getUsers, deleteUser, StudentPerformance} = require('../controllers/users')

router.post('/auth',authUser)

router.post('/register', registerUser)

router.get('/verify/:id', verifyStudent)

router.post('/logout',logoutUser)

const photosMiddleware = multer({ dest: './uploads' });
router.post('/image', protect, photosMiddleware.array('photo', 5), Upload);

router.route('/profile').get(protect,getUserprofile).put(protect,UpdateUserprofile)

router.post('/payment',makePayment)

router.get('/users', protect, getUsers)

router.post('/delete_user', protect, deleteUser)

router.route('/quiz').post(protect,StudentPerformance)



module.exports = router
