const express = require('express');

const router = express.Router();

const {
    getAllfoundationInformation,
    updatefoundationInformation
} = require(`${__dirname}/../controllers/foundationInformation.controller.js`);

const {
    protect,
    restrictTo,
} = require(`${__dirname}/../controllers/authentication.controller.js`);

//Protect: only logged user can access information
router.route('/').get(protect, getAllfoundationInformation);
router.route('/update').put(protect, restrictTo("Editar InfoRRO"), updatefoundationInformation);



module.exports = router;
