require('dotenv').config();

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models');
const router = express.Router();
const axios = require('axios');



router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "L'email est déjà utilisé." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);

    res.status(201).json({ token });

  } catch (error) {
    console.error('Erreur lors de la création d\'un utilisateur :', error);
    res.status(500).json({ message: "Une erreur s'est produite lors de la création d'un compte." });
  }
});


const { generateAccessToken, generateRefreshToken } = require('./tokenUtilis');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const foundUser = await User.findOne({ email });
  if (!foundUser) {
    return res.status(401).json({ error: 'Adresse email invalide' });
  }
  const passwordMatch = await bcrypt.compare(password, foundUser.password);
  if (!passwordMatch) {
    return res.status(401).json({ error: 'Mot de passe invalide' });
  }
  const accessToken = generateAccessToken(foundUser._id);
  const refreshToken = generateRefreshToken(foundUser._id);
  foundUser.refreshToken = refreshToken;
  await foundUser.save();
  res.json({ accessToken, refreshToken });
});




const DpeData = require('./dpeModel');

router.post('/search', async (req, res) => {
  try {
    
  const { postalCode, dpeValue, gesValue } = req.body;
    const address = `${postalCode}`; 
    
    const query = {
      "Code_postal_(BAN)": postalCode,
      Etiquette_DPE: dpeValue,
      Etiquette_GES: gesValue,
    };
    console.log(query);
    const properties = await DpeData.find(query).limit(10);
    console.log(address);
   
    //const { latitude, longitude } = await getCoordinatesByAddress(address);
    
    //console.log(latitude);
    //console.log(longitude);

    const coordinates=[];
     for (const property of properties) {
        const address = `${property["Code_postal_(BAN)"]} ${property["Adresse_(BAN)"]}`;

        console.log("address" , address);
        const { latitude, longitude } = await getCoordinatesByAddress(address);
        coordinates.push({ address, latitude, longitude });}

    res.json({coordinates});
      
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
      return ("aucun trouvé ");
    }
  } catch (error) {
    console.log(error);
    throw new Error('Erreur lors de la recherche des coordonnées géographiques');
  }
}
module.exports = router;