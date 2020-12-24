const mongoose = require('mongoose');

const placeSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  imagePath: { type: String, required: true },
  createdBy: {type: mongoose.Schema.Types.ObjectId, ref:"User", required: true}
});

module.exports = mongoose.model('Place', placeSchema);
