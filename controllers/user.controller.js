const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require(`../utils/apiFeatures`);
const factory = require('./handlerFactory.controller');
const User = require('../models/users.model');
const UserRol = require('../models/userRol.model');
const UserFocus = require('../models/userFocus.model');
const Focus = require('../models/focus.model');

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User, ['topics']);
exports.createUser = factory.createOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const userFeatures = new APIFeatures(User.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const users = await userFeatures.query;


    for(let i = 0; i < users.length; i++){
      const userFocus = []

      const rol = await UserRol.findOne({user: users[i]._id}, {rol: 1, _id: 0});
      const focus = await UserFocus.find({user: users[i]._id}, {focus: 1, _id: 0}).populate("focus");

      const mapFocus = focus.map((f) => {userFocus.push(f.focus.name)})

      users[i] = {...users[i]._doc, "rol": rol.rol}
      users[i] = {...users[i], "focus": userFocus}
    }

    console.log(users)

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  });
  

