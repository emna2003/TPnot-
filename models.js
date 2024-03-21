

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('ebs-user', userSchema);

module.exports = User;


const userSearchSchema = new mongoose.Schema({

  /*userEmail:{
    type: String,
    required:true
  },*/

  postalCode: {
    type: Number,
    required: true
  },
  dpeValue: {
    type: String,
    required: true
  },
  gesValue: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    
  },
  longitude: {
    type: Number,
    
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const UserSearch = mongoose.model('ebs-Search', userSearchSchema);

module.exports=UserSearch;