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
router.use(protect);
router.route('/').get(getAllfoundationInformation);
router.use(protect, restrictTo("Editar InfoRRO"))
router.route('/update').put(updatefoundationInformation);



module.exports = router;
