const asyncHandler = require('express-async-handler')
const path = require('path');
const fs = require('fs')
const imageDownloader = require('image-downloader')
const Course = require('../models/Course')
const Quizzes = require('../models/Quizes')

let Upload = asyncHandler(async(req,res) =>{
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++){
        const {path, originalname} = req.files[i];
        const parts = originalname.split('.')
        const ext = parts[parts.length -1]
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath)
        uploadedFiles.push(newPath.replace(/uploads\\/g, ''))
    }
    res.json(uploadedFiles)
})


const uploadByLink = asyncHandler(async(req,res) =>{
    const {link} = req.body;
    const newName = 'Photo' + Date.now() + '.jpg'
    await imageDownloader.image({
        url:link,
        dest: path.join(__dirname, '../uploads/' + newName)
    })
    res.json(newName)

})

const NewCourse = asyncHandler(async(req,res) =>{
    try{
        await Course.create(req.body)
        res.status(201).json({message:'Course Created Successfully'})
    }catch(err){
        res.status(500)
    throw new Error ('Server Error')
    }
})

const getCourses = asyncHandler(async(req,res) =>{
    try{
        const courses = await Course.find().sort({createdAt: -1}).populate('createdBy', '-password').populate('comment.issuedBy', '-password').populate('comment.replies.issuedBy', '-password');
        res.status(200).json(courses)

        !courses ? res.status(404).json({message:"No Course Found"}) : null

    }catch(err){
        res.status(500)
    throw new Error ('Server Error')
    }
})
const singleCourse = asyncHandler(async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);
      if (!course) {
        res.status(404);
        throw new Error('Course not Found');
      }
      res.status(200).json(course)
      
    } catch (error) {
      res.status(500);
      throw new Error('Server error');
    }
  });

const UpdateCourse = asyncHandler(async(req,res) =>{
    try{
        const course = await Course.findById(req.body.courseId)

        if(!course){
            return res.status(404).json({message:"Course not found"})
        }

        if(course){
            course.set(req.body)
            await course.save();
            res.status(200).json({ message: 'Success' });
        }
    }catch(err){
        console.error('Error updating service:', err);
        res.status(500).json({ message: 'An error occurred while updating the course' });
    }
})

const deleteCourse = asyncHandler(async(req,res) =>{
    let course =  await Course.deleteOne({_id: req.body.id})
   if(course){
    res.status(200).json({message:'Course Removed'})
   }
   throw new Error('Unable to Remove Course')
})

const setQuiz = asyncHandler(async (req, res) => {
    try {
      await Quizzes.create(req.body)
      res.status(201).json({ message: 'Quiz Successfully Saved'});
    } catch (err) {
      res.status(500);
      console.error(err);
      throw new Error('Server error');
    }
  });
  

const getQuiz = asyncHandler(async(req,res) =>{
    try{
        const quizes = await Quizzes.find().sort({createdAt: -1}).populate('createdBy', '-password');
        res.status(200).json(quizes)

        !quizes ? res.status(404).json({message:"No Course Found"}) : null

    }catch(err){
        res.status(500)
    throw new Error ('Server Error')
    }
})

const saveCommentReply = asyncHandler(async(req,res) =>{
    try{
        const course = await Course.findById(req.body.courseId)

        if (!course) {
            throw new Error('Course not found');
          }

          const comment = course.comment.id(req.body.commentId)

          if (!comment) {
            throw new Error('Comment not found');
          }

          comment.replies.push(req.body);

          await course.save();

          res.status(201).json({message:'Comment Sent!'})

    }catch(err){
        res.status(500)
        console.log(err)
        throw new Error ('Server Error')
    }
})
module.exports ={
    Upload,
    uploadByLink,
    NewCourse,
    getCourses,
    singleCourse,
    UpdateCourse,
    deleteCourse,
    setQuiz,
    getQuiz,
    saveCommentReply
}
