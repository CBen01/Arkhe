const express = require('express');
const router = express.Router();
const {
    getCharacterIdsByUID,
    getPlayerStatsByUID
} = require('../services/arkhe');

router.get('/:uid', async (req, res) => {
    const { uid } = req.params;

    // Prevent caching
    res.set('Cache-Control', 'no-store');

    try {
        const [characters, playerStats] = await Promise.all([
            getCharacterIdsByUID(uid),
            getPlayerStatsByUID(uid)
        ]);

        res.json({ characters, playerStats });
    } catch (err) {
        res.status(500).json({
            error: 'Nem sikerült lekérni az adatokat.',
            details: err.message,
        });
    }
});

module.exports = router;