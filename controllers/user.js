
const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

exports.signup = (req, res, next) => {
    const { email, password } = req.body;


    User.findOne({ email })
        .then(user => {
            if (user !== null) {
                console.log('User Utilisateur trouvé');
                res.status(401).json({ message: 'Utilisateur déja enregistré ! Veuillez vous connecter !' });
            } else {
                console.log('Utilisateur non trouvé');

                bcrypt.hash(req.body.password, 10)
                    .then(hash => {

                        const user = new User({
                            email: email,
                            password: hash,
                        });

                        user.save()
                            .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                            .catch(error => res.status(400).json({ error }))
                    })
            }
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {

    User.findOne({ email: req.body.email })
        .then(user => {
            if (user === null) {
                res.status(401).json({ message: 'identifiant et/ou mot de passe incorrect' });
            } else {

                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            res.status(401).json({ message: 'identifiant et/ou mot de passe incorrect' });
                        } else {
                            res.status(200).json({

                                userId: user._id,
                                token: jsonWebToken.sign(
                                    { userId: user._id },

                                    process.env.CLE_SECRETE,
                                    { expiresIn: '24h' }
                                ),
                            });
                        }
                    })
                    .catch(error => res.status(500).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }))
};