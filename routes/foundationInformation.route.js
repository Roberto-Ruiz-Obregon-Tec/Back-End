const express = require('express');

const router = express.Router();

const {
    getAllfoundationInformation,
} = require(`${__dirname}/../controllers/foundationInformation.controller.js`);

const {
    protect,
} = require(`${__dirname}/../controllers/authentication.controller.js`);

router.use(protect);
router.route('/').get(getAllfoundationInformation);




module.exports = router;
