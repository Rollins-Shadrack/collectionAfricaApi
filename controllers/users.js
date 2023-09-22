const asyncHandler = require('express-async-handler')
const Users = require('../models/Users')
const {generateToken} = require('../utils/generateToken')
const nodemailer = require('nodemailer')
const fs = require('fs')

const authUser = asyncHandler(async(req,res) =>{
    const {email, password, isAdmin} = req.body


    const user = await Users.findOne({email})

    if(user &&(await user.matchPasswords(password))){
        if(user.role === 'student' && user.verify === false){
            res.status(401)
           throw new Error ('Account not verified')
        }
        let isAuthenticated = isAdmin === true && user.role === 'admin' || isAdmin === false && user.role === 'student'
        if (!isAuthenticated){
            res.status(401)
           throw new Error ('Invalid Credentials')
        }
        generateToken(res, user._id)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email:user.email,
            role:user.role
        })
    }else{
        res.status(401)
        throw new Error ('Invalid Email or password')
    }
})

const registerUser = asyncHandler(async(req,res) =>{
    const {name, role, email, password} = req.body

    const userExists = await Users.findOne({email})
    if(userExists){
        res.status(400)
        throw new Error("User already exists")
    }
    const user = await Users.create({
        name, role, email, password
    })

    if(user){
        generateToken(res, user._id)
        if(user.role === 'student'){
            sendEmail(user)
        }
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
            message:'Account Created Successfully'
        })
    }else{
        res.status(400)
        throw new Error ('Invalid user data')
    }
})

const logoutUser = asyncHandler(async(req,res) =>{
    res.cookie('jwt','',{
        httpOnly:true,
        expires: new Date(0)
    })
    res.status(200).json({message:"Logged Out"})
})


const sendEmail = async(user) =>{
    const mailTransporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'rshadrackochieng@gmail.com',
          pass: 'dufhbqmcdepbhvdk',
        },
      });
      const mailDetails = {
        from: 'rshadrackochieng@gmail.com',
        to: user.email,
        subject: `Welcome to Collection Africa's Online Course!`,
        text: `Dear ${user.name},
      
      Thank you for joining Collection Africa's Online Course! Your commitment to learning is commendable. To begin your journey, kindly verify your account by clicking the link below. This ensures full access to our enriching content and resources.
      
      [Verify Your Account](verification_link_here)
      
      Embrace a world of knowledge, connect with peers, and elevate your skills. For any queries, reach out to [support@email.com](mailto:support@email.com). We're excited to witness your progress and contributions.
      
      Warm regards,
      The Collection Africa Team`,
        html: `<p>Dear ${user.name},</p>
      
      <p>Thank you for joining Collection Africa's Online Course! Your commitment to learning is commendable. To begin your journey, kindly verify your account by clicking the link below. This ensures full access to our enriching content and resources.</p>
      
      <p><a href="https://collection-africa.netlify.app/verify/${user._id}">Verify Your Account</a></p>
      
      <p>Embrace a world of knowledge, connect with peers, and elevate your skills. For any queries, reach out to <a href="mailto:rshadrackochieng@gmail.com">support@email.com</a>. We're excited to witness your progress and contributions.</p>
      
      <p>Warm regards,<br>The Collection Africa Team</p>`,
      };

      try {
        await mailTransporter.sendMail(mailDetails);
        console.log('Email sent');
      } catch (err) {
        console.error('Email error:', err);
      }
      

}

const verifyStudent = asyncHandler(async(req,res) =>{
 let student = await Users.findOne({_id:req.params.id})

 if(student){
    student.verify = true;

    student = await student.save() 
    res.status(200).json({message:"Account verified successfully"})
 }else{
    res.status(404)
    throw new Error ('Student Not Found')
 }
})

const Upload = asyncHandler(async (req, res) => {
    const uploadedFiles = [];
    // Check if files are present in the request
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const { path, originalname } = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        uploadedFiles.push(newPath.replace(/uploads\\/g, ''));
      }
    } else {
      // Handle the case where no files are uploaded
      return res.status(400).json({ message: 'No files uploaded' });
    }
  
    res.status(200).json(uploadedFiles[0]);
  })

  const UpdateUserprofile = asyncHandler(async(req,res) =>{
    const user = await Users.findById(req.user._id)
  
    if(user){
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.location = req.body.location || user.location;
      user.mobile = req.body.mobile || user.mobile;
      user.image = req.body.image || user.image;
  
      if(req.body.password){
          user.password = req.body.password
      }
  
      const updatedUser = await user.save()
      res.status(200).json({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          location: updatedUser.location,
          mobile: updatedUser.mobile,
          image: updatedUser.image,
          message: 'Profile Updated Successfullly'
      })
  
    }else{
      res.status(404);
      throw new Error('User not Found')
    }
  
  });  

const getUserprofile = asyncHandler(async(req,res) =>{
    const user = await Users.findById(req.user._id).select('-password').populate('performance.courseId');
    if(user){
        res.status(200).json(user)
    }else{
        res.status(404);
      throw new Error('User not Found')
    }
    
})

const getUsers = asyncHandler(async(req,res) =>{
  const users = await Users.find().select('-password');
  if(users){
      res.status(200).json(users)
  }else{
      res.status(404);
    throw new Error('Users not Found')
  }
  
})

const makePayment = asyncHandler(async(req,res) =>{
  const {courseId, amount, studentId, mobile} = req.body

  const user = await Users.findById(studentId)
  if(!user){
    res.status(404);
    throw new Error('User not Found')
  }else{
    user.enrolledCourses.push(courseId)
    user.save()
    res.status(201).json({message:"Successfully Enrolled"})
  }
})

const deleteUser = asyncHandler(async(req,res) =>{
  let user =  await Users.deleteOne({_id: req.body.id})
   if(user){
    res.status(200).json({message:'User Removed'})
   }
   throw new Error('Unable to Remove User')
})

const StudentPerformance = asyncHandler(async(req,res) =>{
  const {studentId} = req.body
  const student = await Users.findById(studentId)
  if(student){
    student.performance.push(req.body)
    student.save()
    res.status(200)

  }else{
    res.status(404)
    throw new Error('Unable to find Student')
  }
})
module.exports ={
    authUser,
    registerUser,
    verifyStudent,
    logoutUser,
    Upload,
    UpdateUserprofile,
    getUserprofile,
    makePayment,
    getUsers,
    deleteUser,
    StudentPerformance
}
