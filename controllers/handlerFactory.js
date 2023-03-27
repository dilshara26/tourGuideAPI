const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIfeatures = require('./../utils/APIFeatures');

exports.deleteone = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No tour found', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    let doc = null;

    doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newDoc,
      },
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let doc = null;
    let query = Model.findById(req.params.id);
    if (populateOptions) {
      query = query.populate(populateOptions);
    }
    doc = await query;
    if (!doc) {
      return next(new AppError('No Document found with the ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { doc },
    });
  });
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter;
    if (req.doc) filter = req.doc;

    const features = new APIfeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .fields()
      .pagination();

    const alldocs = await features.query;
    res
      .status(200)
      // pass all data as a JSON
      .json({
        status: 'success',
        results: alldocs.length,
        data: { alldocs },
      });
  });
