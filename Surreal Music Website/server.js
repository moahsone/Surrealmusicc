const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config(); // Carica le variabili d'ambiente da .env

const app = express();
const port = 3000;

// Middleware per servire file statici
app.use(express.static('public'));

// Middleware per leggere i dati del corpo della richiesta
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Rotta per la homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rotta per gestire l'iscrizione tramite modulo
app.post('/subscribe', async (req, res) => {
    const { email } = req.body;

    try {
        // Configurazione di Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // Creazione del messaggio email
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Grazie per esserti iscritto!',
            text: 'Benvenuto nella nostra newsletter di Surreal Music!',
        };

        // Invio dell'email
        await transporter.sendMail(mailOptions);
        res.status(200).send('Email inviata con successo!');
    } catch (error) {
        console.error('Errore durante l\'invio dell\'email:', error);
        res.status(500).send('Errore durante l\'invio dell\'email.');
    }
});

// Avvia il server
app.listen(port, () => {
    console.log(`Server in esecuzione su http://localhost:${port}`);
});
