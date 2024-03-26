// intégré dans mon fichier models

const mongoose = require('mongoose');

const dpeSchema = new mongoose.Schema({
    "N_département_(BAN)": Number,
  "Date_réception_DPE": Date,
  "Date_établissement_DPE": Date,
  "Date_visite_diagnostiqueur": Date,
  "Etiquette_GES": String,
  "Etiquette_DPE": String,
  "Année_construction": Number,
  "Surface_habitable_logement": Number,
  "Adresse_(BAN)": String,
  "Code_postal_(BAN)": Number
});

const DpeData = mongoose.model('DpeData', dpeSchema, 'dpemini72');

module.exports = DpeData;