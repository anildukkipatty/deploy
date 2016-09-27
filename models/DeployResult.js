var mongoose = require('mongoose')

var deployResultSchema = mongoose.Schema({
  slot: mongoose.Schema.Types.ObjectId,
  stage: Number,
  err: String,
  stdout: String,
  stderr: String,
  created_at: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('deployResult', deployResultSchema)
