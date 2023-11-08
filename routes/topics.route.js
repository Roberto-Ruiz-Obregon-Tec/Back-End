const express = require('express');

const router = express.Router();

const {
    getAllTopics,
    getTopic,
    createTopic,
    updateTopic,
    deleteTopic,
} = require(`${__dirname}/../controllers/topics.controller.js`);

const {
    protect,
    restrictTo,
} = require(`${__dirname}/../controllers/authentication.controller.js`);

// Define routes for handling topics

// Route for getting all topics (GET /topics)
router
    .route('/')
    .get(getAllTopics);

// Route for creating a new topic (POST /topics) - Access restricted to 'Admin' users
router
    .route('/')
    .post(protect, restrictTo('Admin'), createTopic);

// Route for getting a specific topic by ID (GET /topics/:id)
router
    .route('/:id')
    .get(getTopic);

// Route for updating a specific topic by ID (PATCH /topics/:id) - Access restricted to 'Admin' users
router
    .route('/:id')
    .patch(protect, restrictTo('Admin'), updateTopic);

// Route for deleting a specific topic by ID (DELETE /topics/:id) - Access restricted to 'Admin' users
router
    .route('/:id')
    .delete(protect, restrictTo('Admin'), deleteTopic);

module.exports = router;
