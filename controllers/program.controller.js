const factory = require('./handlerFactory.controller');
const Program = require('../models/programs.model');
const ProgramFocus = require('../models/programFocus.model');
const Focus = require('../models/focus.model');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const mongoose = require('mongoose')

exports.getAllPrograms = factory.getAll(Program);
exports.getProgram = factory.getOne(Program);

exports.getAllPrograms = catchAsync(async (req, res, next) => {
    const programFeatures = new APIFeatures(Program.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const programs = await programFeatures.query;

    // Manejo de filtros por interes (focus)
    const req_focus = req.body.focus || [];

    for (let i = programs.length - 1; i >= 0; i--) {
        const programFocus = []

        const focus = await ProgramFocus.find({ program: programs[i]._id }, { focus: 1, _id: 0 }).populate('focus'); // Obtener la lista de intereses (focus) asociados al programa

        const mapFocus = focus.map((f) => { programFocus.push(f.focus.name) }) // Almacenando los nombres de los intereses en la lista programaFocus

        programs[i] = { ...programs[i]._doc, "focus": programFocus}; // Agregamos la lista de intereses

        if (req_focus.length === 0) continue; // Si no hay filtro por intereses no hacemos nada

        let focusFilter = false;

        req_focus.filter((f) => { // Buscamos si los intereses del filtro coinciden con los del programa
            focusFilter = (programFocus.includes(f)) ? true : focusFilter;
        })

        if (!focusFilter || programFocus.length === 0) { // Si no coinicden los filtro de interes con los del programa
            programs.splice(i, 1);  // Eliminamos el registro
        }
    }
    
    // Ios only
    if(req.headers["user-platform"] == 'ios')
    return res.status(200).json({
        status: 'success',
        results: programs.length,
        data: programs,
    });

    res.status(200).json({
        status: 'success',
        results: programs.length,
        data: {
            programs,
        },
    });
});


exports.createProgram = catchAsync(async (req, res, next) => {
    const error = new AppError('No existe informacion del programa', 404); // Defino un error en caso de que no se mande la informacion
    const {focus, ...programInfo} = req.body 


    if (programInfo === undefined) return next(error); // Si no hay informacion de programa, mandamos error

    const newProgram = await Program.create(programInfo); // Creo el nuevo programa

    if (focus !== undefined){ // Si hay focus en el request
        const id = newProgram._id 
        const allFocus = await Focus.find() // Obtengo todos los enfoques de la tabla

        focus.forEach(async (f) => {
            let currentFocus = allFocus.find(jsonFocus => jsonFocus.name == f); // Busco si algun focus ya esta en al base de datos

            if (currentFocus === undefined || currentFocus === null){ // Si no esta
                currentFocus = await Focus.create({name: f}); // Creamos el focus
            }

            const programFocus = await ProgramFocus.create({focus: currentFocus._id, program: newProgram._id, }) // Relacionamos el enfoque con el programa

        });
    }
    

    res.status(200).json({
        status: 'success',
    });

})


exports.deleteProgram = catchAsync (async (req, res, next) => {
    const missingError = new AppError('No se recibio nignuna id', 404); // Defino un error en caso de que no se mande el id del programa a eliminar
    const validationError = new AppError('id no valida', 404); // Defino un error en caso de que no se mande el id del programa a eliminar


    if (req.params.id === undefined || req.params.id === null) return next(missingError); // Si no existe id en el body mandamos error

    const id = req.params.id

    if (!(mongoose.isValidObjectId(id))) return next(validationError); // Si el id no es valido, mandamos error

    // Borramos los enfoques asociados al programa y el programa
    await ProgramFocus.deleteMany({program: id});
    await Program.deleteOne({_id : id});


    res.status(200).json({
        status: 'success'
    });
})

exports.updateProgram - catchAsync (async (req, res, next) => {
    const missingError = new AppError('No se recibio nignuna id', 404); // Defino un error en caso de que no se mande el id del programa a eliminar
    const validationError = new AppError('id no valida', 404); // Defino un error en caso de que no se mande el id del programa a eliminar

    if (req.body._id === undefined || req.body._id === null) return next(missingError); // Si no existe id en el body mandamos error

    const {_id, ...restBody} = req.body 

    if (!(mongoose.isValidObjectId(_id))) return next(validationError); // Si el id no es valido, mandamos error


    const preProgram = Program.findOne({_id : _id})

    const keys = Object.keys(preProgram._doc)

    for (let i = 0; i < keys.length; i++){
        preProgram[keys[i]] = restBody[keys[i]]  || preProgram[keys[i]];
    }

    await preProgram.save({validateBeforeSave : false})

})