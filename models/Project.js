var mongoose = require('mongoose')

var projectSchema = mongoose.Schema({
  name: String,
  description: String,
  server: String,
  user: mongoose.Schema.Types.ObjectId,
  slots: [
    {
      name: String,
      location: String,
      branch: String,
      ref: String
    }
  ],
  created_at: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Project', projectSchema)
