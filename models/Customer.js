const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  cloudinaryId: {
    type: String,
    required: false,
  },
  vip: {
    type: Boolean,
    required : true,
  },
  waiting: {
    type: Boolean,
    required : true,
  },
  track: {
    type: Number,
    required: true,
  },
  note: {
    type: String,
    required: false,
  },
  editedAt: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Customer", CustomerSchema);
