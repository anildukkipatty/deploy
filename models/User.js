var mongoose = require('mongoose')

var userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: Number,
    default: 1
  },
  created_at: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('User', userSchema)
