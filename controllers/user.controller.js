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
    const req_rol = req.body.rol || "";
    const userRols= await UserRol.find().populate('rol'); // Obtener las tablas de usuarios asociados a roles

    for(let i = users.length - 1; i >= 0; i--){
      
      const rol = userRols.find (userInfo => userInfo.user.toString() == users[i]._id.toString())
      
      if (rol === undefined) { // Si el usuario no tiene rol
        users[i] = {...users[i]._doc, "rol": "Sin rol asignado"};
      } else { // Agregando el campo de rol
        users[i] = {...users[i]._doc, "rol": rol.rol.name};
      }

      if (req_rol !== "" && users[i].rol != req_rol) {  // Si no coinicde el filtro de rol con el del usuario
        users.splice(i, 1); // Eliminamos el registro
        continue;
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