

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('ebs-user', userSchema);


const userSearchSchema = new mongoose.Schema({
  id:{type: mongoose.Types.ObjectId},
  
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
  result: [{
  latitude: {
    type: Number,
    
  },
  longitude: {
    type: Number
    
  },
  adresse:{
    type: String
  },
}
],
  date: {
    type: Date,
    default: Date.now
  }
});

const UserSearch = mongoose.model('ebs-Search', userSearchSchema);

module.exports={User,UserSearch};


