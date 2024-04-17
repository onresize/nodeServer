const mongoose = require('./db')

const LocalRoutesSchema = new mongoose.Schema({
  icon: String,
  title: String,
  path: String,
  languageID: String,
})

const LocalRoutesModel = new mongoose.model(
  'localRoutes',
  LocalRoutesSchema,
  'localRoutes'
)

module.exports = LocalRoutesModel
