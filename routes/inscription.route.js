const express = require('express');
const router = express.Router();

const {
    createInscription,
    getInscription,
    getAllInscriptions,
    deleteInscription,
    inscribeTo,
    updateInscription,
    myInscriptions,
} = require(`${__dirname}/../controllers/inscription.controller.js`);
const {
    protect,
    restrictTo,
} = require(`${__dirname}/../controllers/authentication.controller.js`);


router.route('/').get(getAllInscriptions).post(createInscription);
router.route('/update').put(protect, restrictTo('Aceptar o rechazar comprobantes de pago'), updateInscription);

module.exports = router;
