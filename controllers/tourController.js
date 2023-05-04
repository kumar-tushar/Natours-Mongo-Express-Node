const Tour = require("../models/tourModel")

// Route Handler - Get top Tours
exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = "5"
  req.query.sort = "-ratingsAverage,price"
  req.query.fields = "name,price,ratingsAverage,price,summary,difficulty"
  next()
}

// Route Handler - Get all Tours
exports.getAllTours = async (req, res) => {
  try {
    // Filtering Query
    const queryObj = { ...req.query }
    const excludedFields = ["page", "sort", "limit", "fields"]
    excludedFields.forEach((e) => delete queryObj[e])

    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (e) => `$${e}`)

    let query = Tour.find(JSON.parse(queryStr))

    // Sorting Query
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ")
      query = query.sort(sortBy)
    } else {
      query = query.sort("-createdAt")
    }

    // Field Limiting Query
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ")
      query = query.select(fields)
    } else {
      query = query.select("-__v")
    }

    // Pagination Query
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 100
    const skip = (page - 1) * limit

    query = query.skip(skip).limit(limit)

    if (req.query.page) {
      const numTours = await Tour.countDocuments()
      if (skip >= numTours) throw new Error("This page doesn't exist")
    }

    // Query Execution
    const tours = await query

    // Sending Response
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: { tours },
    })
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    })
  }
}

// Route Handler - Get one Tour
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)
    res.status(200).json({
      status: "success",
      data: { tour },
    })
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    })
  }
}

// Route Handler - Create a new Tour
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body)

    res.status(201).json({
      status: "success",
      data: { newTour },
    })
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    })
  }
}

// Route Handler - Update a Tour
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    res.status(200).json({
      status: "success",
      data: { tour },
    })
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    })
  }
}

// Route Handler - Delete a Tour
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id)

    res.status(204).json({
      status: "success",
      data: null,
    })
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    })
  }
}
