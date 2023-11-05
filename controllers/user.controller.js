const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require(`../utils/apiFeatures`);
const factory = require('./handlerFactory.controller');
const User = require('../models/users.model');
const UserRol = require('../models/userRol.model');
const UserFocus = require('../models/userFocus.model');
const Focus = require('../models/focus.model'); // Para referencia al modelo focus
const Rol = require('../models/rols.model'); // Para referencia la modelo rol


exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User, ['topics']);
exports.createUser = factory.createOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

exports.getAllUsers = catchAsync(async (req, res, next) => {

    const userFeatures = new APIFeatures(User.find({}, {password: 0}), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const users = await userFeatures.query;

    // Manejo de filtros 
    const req_rol = req.body.rol || ""; // Por rol
    const req_focus = req.body.focus || []; // Por enfoque

    const userRols = await UserRol.find().populate('rol'); // Obtener las tablas de usuarios asociados a roles
    const userFocus = await UserFocus.find().populate('focus'); // Obtener la lista de intereses (focus) asociados al programa

console.time("a")
    for(let i = users.length - 1; i >= 0; i--){
      const focusList = []
      let focusFilter = (req_focus.length == 0)?true:false;

      const rol = userRols.find (userInfo => userInfo.user.toString() == users[i]._id.toString())

      if (rol === undefined || rol === null) { // Si el usuario no tiene rol
        users[i] = {...users[i]._doc, "rol": "Sin rol asignado"};
      } else { // Agregando el campo de rol
        users[i] = {...users[i]._doc, "rol": rol.rol.name};
      }

      const mapFocus = userFocus.map((f) => {
        if (f.user.toString() === users[i]._id.toString()) { // Buscamos si los intereses del filtro coinciden con los del programa
            focusList.push(f.focus.name)
            focusFilter = req_focus.includes(f.focus.name) ? true : focusFilter;
        } 
    
      }) // Almacenando los nombres de los intereses en la lista programaFocus

      users[i] = { ...users[i], "focus": focusList}; // Agregamos la lista de intereses     

      if ((req_rol !== "" && users[i].rol != req_rol) || !focusFilter) {  // Si no coincide el filtro de rol con el del usuario
        users.splice(i, 1); // Eliminamos el registro
      }
    }
console.timeEnd("a")

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  });