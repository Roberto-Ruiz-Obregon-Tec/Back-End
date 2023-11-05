const factory = require('./handlerFactory.controller');
const Program = require('../models/programs.model');
const ProgramFocus = require('../models/programFocus.model');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
exports.getAllPrograms = factory.getAll(Program);
exports.getProgram = factory.getOne(Program);
exports.createProgram = factory.createOne(Program);
exports.updateProgram = factory.updateOne(Program);
exports.deleteProgram = factory.deleteOne(Program);

exports.getAllPrograms = catchAsync(async (req, res, next) => {
    const programFeatures = new APIFeatures(Program.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const programs = await programFeatures.query;

    // Manejo de filtros por interes (focus)
    const req_focus = req.body.focus || [];
    const programFocus = await ProgramFocus.find().populate('focus'); // Obtener la lista de intereses (focus) asociados al programa

    for (let i = programs.length - 1; i >= 0; i--) {
        const focusList = []

        let focusFilter = false;

        const mapFocus = programFocus.map((f) => {
            if (f.program.toString() === programs[i]._id.toString()) { // Buscamos si los intereses del filtro coinciden con los del programa
                focusList.push(f.focus.name)
                focusFilter = req_focus.includes(f.focus.name.toString()) ? true : focusFilter;
            } 
        
        }) // Almacenando los nombres de los intereses en la lista programaFocus

        programs[i] = { ...programs[i]._doc, "focus": focusList}; // Agregamos la lista de intereses

        if (req_focus.length === 0) continue; // Si no hay filtro por intereses no hacemos nada       

        if (!focusFilter) { // Si no coinicden los filtro de interes con los del programa
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