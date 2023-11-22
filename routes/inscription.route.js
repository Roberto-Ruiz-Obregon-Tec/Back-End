const express = require('express');
const router = express.Router();

const {
    createInscription,
    getInscription,
    getAllInscriptions,
    updateInscription,
} = require(`${__dirname}/../controllers/inscription.controller.js`);
const {
    protect,
    restrictTo,
} = require(`${__dirname}/../controllers/authentication.controller.js`);



router.route('/create').post(protect, restrictTo('Inscribirme a un curso'), createInscription)

router.route('/update').put(protect, restrictTo('Aceptar o rechazar comprobantes de pago'), updateInscription);


router.route('/').get(protect, restrictTo('Consultar comprobantes de pago'),getAllInscriptions)
router.route('/:id').get(protect, restrictTo('Consultar comprobantes de pago'), getInscription)


module.exports = router;
