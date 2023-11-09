const express = require('express');
const filesController = require('../controllers/files.controller');

const router = express.Router();

const {
    createProgram,
    getProgram,
    getAllPrograms,
    updateProgram,
    deleteProgram,
} = require(`${__dirname}/../controllers/program.controller.js`);
const {
    protect,
    restrictTo,
} = require(`${__dirname}/../controllers/authentication.controller.js`);


router.use(protect, restrictTo('Consultar proyectos'));
router.route('/').get(getAllPrograms)
router.route('/:id').get(getProgram)

router.use(protect, restrictTo('Crear proyectos'));
router.route('/crear').post(createProgram);



module.exports = router;