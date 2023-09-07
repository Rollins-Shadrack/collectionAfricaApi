const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const courseSchema = new Schema({
    createdBy:{
        type: Object
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
    modules: [{
        moduleTitle: {
            type: String,
            required: true
        },
        sessions: [{
            sessionTitle: {
                type: String,
                required: true
            },
            notes: {
                type: String,
                required: true
            },
        }],
    }]
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
