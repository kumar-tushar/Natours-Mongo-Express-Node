const Tour = require('../models/tourModel');

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
