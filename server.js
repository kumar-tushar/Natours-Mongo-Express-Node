require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const morgan = require("morgan")
const fs = require("fs")

const app = express()

app.use(morgan("dev"))
app.use(express.json())

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, "utf-8"))

// Route Handler - Get all Tours
const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: { tours },
  })
}

// Route Handler - Get one Tour
const getTour = (req, res) => {
  const id = Number(req.params.id)
  const tour = tours.find((tour) => tour.id === id)

  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    })
  }

  res.status(200).json({
    status: "success",
    data: { tour },
  })
}

// Route Handler - Create a new Tour
const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1
  const newTour = Object.assign({ id: newId }, req.body)
  tours.push(newTour)

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), () => {
    res.status(201).json({
      status: "success",
      data: { tour: newTour },
    })
  })
}

// Route Handler - Update a Tour
const updateTour = (req, res) => {
  if (Number(req.params.id >= tours.length)) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    })
  }

  res.status(200).json({
    status: "success",
    data: { tour: "Updated Tour" },
  })
}

// Route Handler - Delete a Tour
const deleteTour = (req, res) => {
  if (Number(req.params.id >= tours.length)) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    })
  }

  res.status(204).json({
    status: "success",
    data: null,
  })
}

app.route("/api/v1/tours").get(getAllTours).post(createTour)
app.route("/api/v1/tours/:id").get(getTour).patch(updateTour).delete(deleteTour)

mongoose
  .connect(process.env.DATABASE_URL, { useNewURLParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database Connected"))
  .catch(() => console.log("Database Connected"))

const port = process.env.PORT || 8000
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
