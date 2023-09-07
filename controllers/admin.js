const asyncHandler = require('express-async-handler')
const path = require('path');
const fs = require('fs')
const imageDownloader = require('image-downloader')
const Course = require('../models/Course')

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
    console.log(req.body)
    console.log(req.body.modules[0].sessions)
    // try{
    //     await Course.create(req.body)
    //     res.status(201).json({message:'Course Created Successfully'})
    // }catch(err){
    //     res.status(500)
    // throw new Error ('Server Error')
    // }
})

const getCourses = asyncHandler(async(req,res) =>{
    try{
        const courses = await Course.find().sort({createdAt: -1})
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
            res.status(200).json({ message: 'Course Successfully Updated' });
        }
    }catch(err){
        console.error('Error updating service:', error);
        res.status(500).json({ message: 'An error occurred while updating the course' });
    }
})
module.exports ={
    Upload,
    uploadByLink,
    NewCourse,
    getCourses,
    singleCourse,
    UpdateCourse
}
