const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const QuizesSchema = new Schema({
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    quizTitle: {
        type: String,
        required: true
    },
    completeQuizData: [{
        question:{
            type:String
        },
        answers:[{
            type:String
        }],
        correctAnswer:{
            type: String
        }
    }],
    courseId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    
}, { timestamps: true });

const Quizzes = mongoose.model('Quizzes', QuizesSchema);

module.exports = Quizzes;
