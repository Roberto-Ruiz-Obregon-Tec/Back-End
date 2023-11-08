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

router.use(protect);
router.route('/').get(getAllfoundationInformation);
router.use(protect, restrictTo("Editar InfoRRO"))
router.route('/update').get(updatefoundationInformation);





module.exports = router;
