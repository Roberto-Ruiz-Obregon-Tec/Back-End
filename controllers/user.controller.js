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

    // Manejo de filtros por interes (focus) y rol
    const req_focus = req.body.focus || [];
    const req_rol = req.body.rol || "";

    for(let i = users.length - 1; i >= 0; i--){
      const userFocus = []
    

      const rol = await UserRol.findOne({user: users[i]._id}, {rol: 1, _id: 0}).populate('rol'); // Obtener el nombre del rol asociado al usuario
      const focus = await UserFocus.find({user: users[i]._id}, {focus: 1, _id: 0}).populate('focus'); // Obtener la lista de intereses (focus) asociados al usuario

      const mapFocus = focus.map((f) => {userFocus.push(f.focus.name)}) // Almacenando los nombres de los intereses en la lista userFocus

      if (rol === null) { // Si el usuario no tiene rol
        users[i] = {...users[i]._doc, "rol": "Sin rol asignado"};
      } else { // Agregando el campo de rol
        users[i] = {...users[i]._doc, "rol": rol.rol.name};
      }

      users[i] = {...users[i], "focus": userFocus}; // Agregamos la lista de intereses

      if (req_rol !== "" && users[i].rol != req_rol) {  // Si no coinicde el filtro de rol con el del usuario
        users.splice(i, 1); // Eliminamos el registro
      }

      if (req_focus.length === 0) continue; // Si no hay filtro por intereses no hacemos nada
      
      let focusFilter = false; 

      req_focus.filter( (f) => { // Buscamos si los intereses del filtro coinciden con los del usuario
        focusFilter = (userFocus.includes(f))? true : focusFilter;
      })

      if (!focusFilter || userFocus.length === 0) { // Si no coinicden los filtro de interes con los del usuario
        users.splice(i, 1);  // Eliminamos el registro
      }
      
      
    }


    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  });
  

