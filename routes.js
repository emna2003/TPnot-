require('dotenv').config();

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models').User;
const router = express.Router();
const axios = require('axios');
const UserSearch = require('./models').UserSearch;
const DpeData = require('./dpeModel');
const mongoose = require('mongoose');



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

    res.status(201).json({ token});

  } catch (error) {
    res.status(500).json({ message: "Une erreur s'est produite lors de la création d'un compte:", error });
  }
});


const { generateAccessToken, generateRefreshToken } = require('./tokenUtilis');

router.post('/login', async (req, res) => {

  const { email, password } = req.body;
  
  const foundUser = await User.findOne({ email });
  if (!foundUser) {
    return res.status(401).json({ error: 'Adresse email invalide'});
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

function authenticateToken(req, res, next) {
  
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  console.log(token);
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log(err);
      return res.sendStatus(401)
    }
    req.user = user;
    next();
  });
}

router.post('/search',authenticateToken,  async (req, res) => {
  try {
    const userId = req.user.userId;
    
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


    const newUserSearch = new UserSearch({

      id: userId,
      postalCode,
      dpeValue,
      gesValue,
      date: new Date()
    });

    const result=[];

     for (const property of properties) {
        const address = `${property["Code_postal_(BAN)"]} ${property["Adresse_(BAN)"]}`;
        console.log("coucou", address);

        const { latitude, longitude } = await getCoordinatesByAddress(address);

        result.push({ address, latitude, longitude });

        console.log("salut", result);
        }
    newUserSearch.result=result;

    console.log(newUserSearch);

    await newUserSearch.save();

    res.json({result});
      
  } catch (error) {
    console.error('Erreur lors de la recherche des biens en vente :', error.message);
    console.error(error);
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



router.delete('/userSearch/:id', async (req, res) => {
  try {

    const { id } = req.params;
    console.log(id);
    const search = await UserSearch.findById(id);

    if (!search) {
      return res.status(404).json({ error: 'Recherche non trouvée' });
    }
    await UserSearch.findByIdAndDelete(id);

    res.json({ message: 'Recherche supprimée avec succès' });

  } catch (error) {
    console.error('Erreur :', error.message);
    console.log(error);
    res.status(500).json({ error: 'Erreur ' });
  }
});

/*router.put('/search/:id/relaunch',authenticateToken, async (req, res) => {
  try {

    const userId = req.user.userId;

    console.log("hello", userId);

    const searchId = req.params.id;
    console.log(searchId);

    const search = await UserSearch.findById(new mongoose.Types.ObjectId(searchId));
    console.log(search);

    if (!search || search.id.toString() != userId) {
      return res.status(404).json({ error: "Recherche non trouvée ou non autorisée" });
    }
    const result = {postalCode:search.postalCode,dpeValue:search.dpeValue,gesValue:search.gesValue};
    
    const properties = await search (result);

    res.status(200).json({ properties });

  } catch (error) {
    console.error('Erreur de relance :', error.message);
    console.log(error);
    res.status(500).json({ error: 'Erreur  de relance' });
  }
});*/

module.exports = router;

