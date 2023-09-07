const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const Schema = mongoose.Schema

const usersSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    },
    verify:{
        type:Boolean,
        default: false
    },
    location:{
        type:String,
    },
    mobile:{
        type:String,
    },
    image:{
        type:String,
    },
    password:{
        type:String,
        required:true
    },
}, {timestamps: true})

usersSchema.pre('save', async function (next){
    if(!this.isModified('password')){
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

usersSchema.methods.matchPasswords = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

const Users = mongoose.model('Users', usersSchema)

module.exports = Users