const Tour = require('../models/tourModel');

// Middleware - Get Top Tours (Alias Route Handler)
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage, price';
  req.query.fields = 'name, price, ratingsAverage,summary, difficulty';
  next();
};

// Route Handler - Get all Tours
exports.getAllTours = async (req, res) => {
  try {
    // Filtering
    const reqQueryObj = { ...req.query };
    const nonFilterQueryParams = ['page', 'sort', 'limit', 'fields'];
    nonFilterQueryParams.forEach((element) => delete reqQueryObj[element]);

    // Advanced Filtering
    let reqQueryStr = JSON.stringify(reqQueryObj);
    reqQueryStr = reqQueryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let toursQuery = Tour.find(JSON.parse(reqQueryStr));

    // Sorting
    if (req.query.sort) {
      const sort = req.query.sort.split(',').join(' ');
      toursQuery = toursQuery.sort(sort);
    } else {
      toursQuery = toursQuery.sort('-createdAt');
    }

    // Limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      toursQuery = toursQuery.select(fields);
    } else {
      toursQuery = toursQuery.select('-__v');
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;
    toursQuery = toursQuery.skip(skip).limit(limit);
    if (req.query.page) {
      const toursCount = await Tour.countDocuments();
      if (skip >= toursCount) throw new Error("This page doesn't exist");
    }

    const tours = await toursQuery;
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Route Handler - Get one Tour
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Route Handler - Create a new Tour
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { newTour },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Route Handler - Update a Tour
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Route Handler - Delete a Tour
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Aggregation Pipeline - Match, Group, Sort
exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: stats,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Aggregation Pipeline - Unwind, Project
exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    const plan = await Tour.aggregate([
      { $unwind: '$startDates' },
      { $match: { startDates: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) } } },
      { $group: { _id: { $month: '$startDates' }, numTours: { $sum: 1 }, tourNames: { $push: '$name' } } },
      { $addFields: { month: '$_id' } },
      { $project: { _id: 0 } },
      { $sort: { numTours: -1 } },
      { $limit: 12 },
    ]);
    res.status(200).json({
      status: 'success',
      data: plan,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};
