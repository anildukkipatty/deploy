var mongoose = require('mongoose')

var projectSchema = mongoose.Schema({
  name: String,
  description: String,
  server: String,
  serverUser: String,
  user: mongoose.Schema.Types.ObjectId,
  slots: [
    {
      name: String,
      location: String,
      branch: String,
      ref: String,
      commands: String,
      results: [
        {
          stage: Number,
          err: String,
          stdout: String,
          stderr: String,
          created_at: {
            type: Date,
            default: Date.now
          }
        }
      ]
      status: {
        type: Boolean,
        default: true
      },
    }
  ],
  created_at: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Project', projectSchema)
