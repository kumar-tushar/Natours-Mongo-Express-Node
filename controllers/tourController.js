const Tour = require("../models/tourModel")

// Route Handler - Get all Tours
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    // results: tours.length,
    // data: { tours },
  })
}

// Route Handler - Get one Tour
exports.getTour = (req, res) => {
  const id = Number(req.params.id)
  // const tour = tours.find((tour) => tour.id === id)
  //
  // if (!tour) {
  //   return res.status(404).json({
  //     status: "fail",
  //     message: "Invalid ID",
  //   })
  // }

  res.status(200).json({
    status: "success",
    // data: { tour },
  })
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
exports.updateTour = (req, res) => {
  // if (Number(req.params.id )>= tours.length) {
  //   return res.status(404).json({
  //     status: "fail",
  //     message: "Invalid ID",
  //   })
  // }

  res.status(200).json({
    status: "success",
    // data: { tour: "Updated Tour" },
  })
}

// Route Handler - Delete a Tour
exports.deleteTour = (req, res) => {
  // if (Number(req.params.id >= tours.length)) {
  //   return res.status(404).json({
  //     status: "fail",
  //     message: "Invalid ID",
  //   })
  // }

  res.status(204).json({
    status: "success",
    data: null,
  })
}
