const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const bodyParser = require("body-parser");

const app = express();
app.use(cors({
    // origin: '*'
}))

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

const port = 3000;

mongoose.connect('mongodb+srv://skabi36:skabi12345@cluster0.l2orsh4.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const tickerSchema = new mongoose.Schema({
    name: String,
    last: Number,
    buy: Number,
    sell: Number,
    volume: Number,
    base_unit: String,
});

const Ticker = mongoose.model('Ticker', tickerSchema);

const axios = require('axios');

app.get('/api/data', async (req, res) => {
    try {
        const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
        const tickersData = response.data;
        // console.log(tickersData)
        // Convert the tickers data into an array of objects
        const tickersArray = Object.entries(tickersData).map(([name, ticker]) => ({
            name,
            last: ticker.last,
            buy: ticker.buy,
            sell: ticker.sell,
            volume: ticker.volume,
            base_unit: ticker.base_unit,
        }));

        // Sort tickers based on the sell value in descending order
        tickersArray.sort((a, b) => b.sell - a.sell);

        // Get the top 10 tickers
        const top10Tickers = tickersArray.slice(0, 10);
 
        // Store the top 10 tickers in the database
        await Ticker.insertMany(top10Tickers);

        const tickers = await Ticker.find().sort({ sell: -1 }).limit(10);

        res.json(tickers);
    } catch (error) {
        console.error('Error fetching and storing data:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
