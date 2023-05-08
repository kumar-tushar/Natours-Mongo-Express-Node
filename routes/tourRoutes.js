const express = require('express')
const router = express.Router()
const {
  aliasTopTours,
  getAllTours,
  getTourStats,
  getMonthlyPlan,
  createTour,
  getTour,
  updateTour,
  deleteTour,
} = require('../controllers/tourController')

router.route('/top-tours').get(aliasTopTours, getAllTours)
router.route('/tour-stats').get(getTourStats)
router.route('/monthly-plan/:year').get(getMonthlyPlan)
router.route('/').get(getAllTours).post(createTour)
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour)

module.exports = router
