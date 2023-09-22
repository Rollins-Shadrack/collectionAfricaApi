const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const courseSchema = new Schema({
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    addedSlides: {
        type: [String],
        default: []
    },
    addedVideos: {
        type: [String],
        default: []
    },
    prerequisites: {
        type: String,
        required: true
    },
    objectives: {
        type: String,
        required: true
    },
    resources: {
        type: [String],
        default: []
    },
    price: {
        type: String,
        required: true
    },
    comment: [{
        message: {
          type: String,
          required: true,
        },
        issuedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Users',
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        replies: [
            {
              message: {
                type: String,
                required: true,
              },
              issuedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Users',
                required: true,
              },
              createdAt: {
                type: Date,
                default: Date.now,
              },
            },
          ],
      },],
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
