const express = require('express');
const axios = require('axios');
const { supabase } = require('../supabaseClient.mjs');
const router = express.Router();

// Helper: Kivonja a query paramétereket a log URL-ből
function parseLogUrl(logUrl) {
    const url = new URL(logUrl);
    return Object.fromEntries(url.searchParams.entries());
}

router.post('/import', async (req, res) => {
    const { logUrl, uid } = req.body;

    if (!logUrl || !uid) {
        return res.status(400).json({ error: 'logUrl és uid szükséges.' });
    }

    const params = parseLogUrl(logUrl);
    const base = `https://hk4e-api-os-static.hoyoverse.com/gacha_info/api/getGachaLog`;
    const types = ["301", "302", "200", "100"]; // karakter event, fegyver event, standard, beginner

    const allWishes = [];

    for (const type of types) {
        let page = 1;
        let end = false;
        let lastId = '0';

        while (!end) {
            try {
                const url = `${base}?${new URLSearchParams({
                    ...params,
                    gacha_type: type,
                    size: '20',
                    end_id: lastId,
                    page: page.toString()
                })}`;

                const response = await axios.get(url);
                const list = response.data.data.list;

                if (!list || list.length === 0) break;

                for (const item of list) {
                    allWishes.push({
                        pull_id: item.id,
                        user_uid: uid,
                        name: item.name,
                        rarity: parseInt(item.rank_type),
                        type: item.item_type,
                        wish_type: type,
                        time: item.time
                    });
                }

                lastId = list[list.length - 1].id;
                page++;
                if (list.length < 20) end = true;
            } catch (err) {
                console.error(err);
                return res.status(500).json({ error: 'Hiba történt az adatlekérés közben.' });
            }
        }
    }

    // Töröld a már meglévő pull_id-ket hogy ne legyen duplikáció
    const { data: existing } = await supabase
        .from('wishes')
        .select('pull_id')
        .in('pull_id', allWishes.map(w => w.pull_id));

    const existingIds = new Set(existing?.map(e => e.pull_id));

    const newWishes = allWishes.filter(w => !existingIds.has(w.pull_id));

    // Töltsd be őket
    const { error } = await supabase.from('wishes').insert(newWishes);

    if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Nem sikerült menteni az adatokat.' });
    }

    res.json({ success: true, inserted: newWishes.length });
});

module.exports = router;
