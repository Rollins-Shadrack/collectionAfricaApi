const express = require('express')
const multer = require('multer')
const {protect} = require('../middleware/authMiddleware')

const router = express.Router()

const {authUser, registerUser, verifyStudent, logoutUser, Upload, UpdateUserprofile, getUserprofile} = require('../controllers/users')

router.post('/auth',authUser)

router.post('/register', registerUser)

router.get('/verify/:id', verifyStudent)

router.post('/logout',logoutUser)

const photosMiddleware = multer({ dest: './uploads' });
router.post('/image', protect, photosMiddleware.array('photo', 5), Upload);

router.route('/profile').get(protect,getUserprofile).put(protect,UpdateUserprofile)



module.exports = router