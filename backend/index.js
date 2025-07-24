const express = require('express');
const cors = require('cors');
const uidRoutes = require('./routes/uid');
const wishesRoute = require('./routes/wishes');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Route-ok
app.use('/api/wishes', wishesRoute);
app.use('/api/uid', uidRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Backend fut a http://localhost:${PORT} címen`);
});

app.get('/', (req, res) => {
    res.send('Arkhe API működik! Használd a /api/uid/:uid végpontot.');
});

