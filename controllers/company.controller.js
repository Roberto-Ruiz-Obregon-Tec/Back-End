const companyCertification = require('../models/companyCertifications.model');
const company = require('../models/companies.model');
const Certification = require('../models/certifications.model');
const CompanyFocus = require('../models/companyFocus.model');
const Focus = require('../models/focus.model');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const mongoose = require('mongoose')

exports.getAllCompanies = catchAsync(async (req, res, next) => {
    const req_certifications = req.body.certifications || []; // Filtros por certificación
    const req_focus = req.body.focus || []; // Filtros por enfoque

    const companiesFeatures = new APIFeatures(company.find({}), req.query);
    const companies = await companiesFeatures.query;

    const certifications = await companyCertification.find().populate('certification'); // Obtenemos las certificaciones registradas
    const focus = await CompanyFocus.find().populate('focus'); // Obtenemos los enfoques registrados

    for(let i = companies.length - 1; i >= 0; i--){
        const companyCertifications = [];
        const companyFocus = [];

        // Para verificar si cumple con los filtros
        let certif_filter = (req_certifications.length === 0)? true:false; 
        let focus_filter = (req_focus.length === 0)? true:false; 

        const mapCertifications = certifications.map((c) => { // Agregamos al documento de empresa las certificaciones que tiene
            if(c.company.toString() == companies[i]._id.toString()) {
                companyCertifications.push(c.certification.name)
                certif_filter = (req_certifications.includes(c.certification.name))? true : certif_filter;
            }
        })

        const mapFocus = focus.map((f) => { // Agregamos al documento de empresa los enfoques que tiene
            if(f.company.toString() == companies[i]._id.toString()) {
                companyFocus.push(f.focus.name)
                focus_filter = (req_focus.includes(f.focus.name))? true : focus_filter;
            }
        })

        if (certifications === null) { // Si la empresa no cuenta con certificaciones
            companies[i] = {...companies[i]._doc, "certifications": "Sin certificaciones"};
        } else { // Sino, agregamos las certificaciones correspondientes
            companies[i] = {...companies[i]._doc, "certifications": companyCertifications};
        }

        companies[i] = {...companies[i], "focus": companyFocus}; // Agregamos los enfoques correspondientes

        if (!certif_filter && focus_filter) companies.splice(i, 1); // Si no coincide con los filtros, la quitamos de la lista
    }


    res.status(200).json({
        status: 'success',
        results: companies.length,
        data: {
          companies,
        },
    });
});


exports.deleteCompany = catchAsync (async (req, res, next) => {
    const missingError = new AppError('No se recibio nignuna id', 404); // Defino un error en caso de que no se mande el id del evento a eliminar
    const validationError = new AppError('id no valida', 404); // Defino un error en caso de que no se mande el id del evento a eliminar

    if (req.params.id === undefined || req.params.id === null) return next(missingError); // Si no existe id en los params mandamos error

    const id = req.params.id

    if (!(mongoose.isValidObjectId(id))) return next(validationError);

    await CompanyFocus.deleteMany({company: id}); // Eliminamos los registros de los enfoques asociados al evento
    await companyCertification.deleteMany({company: id}); // Eliminamos los registros de las certificaciones asociadas al evento
    await company.deleteOne({_id : id}); // Eliminamos el evento

    res.status(200).json({
        status: 'success',
    });
});


exports.updateCompany = catchAsync(async (req, res, next) => {
    const missingError = new AppError('No se recibio nignuna id', 404); // Defino un error en caso de que no se mande el id del evento a eliminar
    const validationError = new AppError('id no valida', 404); // Defino un error en caso de que no se mande el id del evento a eliminar

    if (req.body._id === undefined || req.body._id === null) return next(missingError); // Si no existe id en el body mandamos error

    const {_id, focus, certifications, ...restBody} = req.body 

    if (!(mongoose.isValidObjectId(_id))) return next(validationError);

    const preCompany = await company.findOne({_id: _id}); // Obtenemos la empresa a actualizar

    const keys = Object.keys(preCompany._doc); // Obtenemos las llaves del objeto

    keys.forEach((key) => { // Actualizamos los valores de la empresa
        preCompany[key] = restBody[key] || preCompany[key];
    });

    await preCompany.save(); // Guardamos los cambios

    await CompanyFocus.deleteMany({company: _id}); // Eliminamos los registros de los enfoques asociados a la empresa
    await companyCertification.deleteMany({company: _id}); // Eliminamos los registros de las certificaciones asociadas a la empresa

    // Si hay focus en el request
    if (focus !== undefined || focus === null){ 
        const allFocus = await Focus.find()

        focus.forEach(async (f) => {
            let currentFocus = allFocus.find(jsonFocus => jsonFocus.name == f); // Busco si algun focus ya esta en al base de datos

            if (currentFocus === undefined || currentFocus === null){ // Si no esta
                currentFocus = await Focus.create({name: f}); // Creamos el focus
            }

            await CompanyFocus.create({company: preCompany._id, focus: currentFocus._id, }) // Relacionamos el evento con el focus
        });
    }

    // Si hay certification en el request
    if (certifications !== undefined || certifications === null){ 
        const allCertifications = await Certification.find()

        certifications.forEach(async (certificationData) => {
            const { name, description, adquisitionDate } = certificationData;
    
            let currentCertifications = allCertifications.find(jsonCertifications => jsonCertifications.name == name);
    
            if (currentCertifications === undefined || currentCertifications === null) {
                currentCertifications = await Certification.create({
                    name,
                    description,
                    adquisitionDate: new Date(adquisitionDate), // Convertir la fecha a objeto Date
                });
            }
    
            await companyCertification.create({company: preCompany._id, certification: currentCertifications._id });
        });
    }

    res.status(200).json({
        status: 'success',
    });
});