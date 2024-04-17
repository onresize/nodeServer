const { updateIfCurrentPlugin } = require('mongoose-update-if-current')
const mongoose = require('./db')

const UserSchema = new mongoose.Schema({
  name: String,
  age: Number,
})

UserSchema.plugin(updateIfCurrentPlugin) // 根据__v字段比对、提醒开发者、这次保存某些数据是脏数据

const UserModel = new mongoose.model('user', UserSchema, 'user')

module.exports = UserModel
