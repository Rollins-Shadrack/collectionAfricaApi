const express = require('express')
const multer = require('multer')
const {Upload, uploadByLink, NewCourse, getCourses, singleCourse, UpdateCourse, deleteCourse, setQuiz, getQuiz, saveCommentReply} = require('../controllers/admin')
const {protect} = require('../middleware/authMiddleware')

const router = express.Router()

const photosMiddleware = multer({dest:'./uploads'});

router.post('/upload-slide',protect,photosMiddleware.array('photos', 100),Upload)

router.post('/upload-by-link',protect,uploadByLink)

router.post('/upload-video',protect,photosMiddleware.array('videos', 100),Upload)

router.route('/course').post(protect, NewCourse).get(getCourses).put(protect, UpdateCourse)

router.get('/course/:id',protect ,singleCourse)

router.post('/delete_course',protect ,deleteCourse)

router.route('/quiz').post(protect,setQuiz).get(protect,getQuiz)

router.route('/comment').post(protect, saveCommentReply)



module.exports = router
