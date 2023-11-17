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


router.route('/create').post(protect, restrictTo('Crear proyectos'), createProgram);
router.route('/delete/:id').delete(protect, restrictTo('Eliminar proyectos'), deleteProgram);

router.route('/update').put(protect, restrictTo('Editar proyectos'), updateProgram);

router.route('/').get(protect, restrictTo('Consultar proyectos'), getAllPrograms)
router.route('/:id').get(protect, restrictTo('Consultar proyectos'), getProgram)


module.exports = router;