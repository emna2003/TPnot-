require('dotenv').config();

const express = require('express');
const router = express.Router();
const axios = require('axios');
const mongoose = require('mongoose');

/*mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connexion à MongoDB établie avec succès');
}).catch((err) => {
  console.error('Erreur lors de la connexion à MongoDB :', err);
});*/

const DpeData = require('./dpeModel');

router.post('/search', async (req, res) => {
  try {
    console.log("coucou");
  const { postalCode, dpeValue, gesValue } = req.query;
    const address = `${postalCode}`; 
    const { latitude, longitude } = await getCoordinatesByAddress(address);
    const query = {
      Code_postal_BAN: postalCode,
      Etiquette_DPE: dpeValue,
      Etiquette_GES: gesValue,
    };

    const properties = await DpeData.find(query);
    res.json(properties);
  } catch (error) {
    console.error('Erreur lors de la recherche des biens en vente :', error.message);
    res.status(500).json({ error: 'Erreur lors de la recherche des biens en vente' });
  }
});

async function getCoordinatesByAddress(address) {
  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
    if (response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { latitude: lat, longitude: lon };
    } else {
      throw new Error('Aucune coordonnée trouvée pour cette adresse');
    }
  } catch (error) {
    throw new Error('Erreur lors de la recherche des coordonnées géographiques');
  }
}
module.exports = router;
















