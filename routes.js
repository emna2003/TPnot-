require('dotenv').config();

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models');
const router = express.Router();


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

module.exports = router;
