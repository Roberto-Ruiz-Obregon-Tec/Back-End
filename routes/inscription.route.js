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



router.route('/').post(createInscription);
router.route('/update').put(protect, restrictTo('Aceptar o rechazar comprobantes de pago'), updateInscription);


router.route('/').get(protect, restrictTo('Consultar comprobantes de pago'),getAllInscriptions)
router.route('/:id').get(getInscription).delete(deleteInscription);


module.exports = router;
