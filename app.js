const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/moneytracker', { useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
});

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');



// Define Mongoose schema and model
const transactionSchema = new mongoose.Schema({
    description: String,
    amount: Number,
    date: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Routes
app.get('/', async (req, res) => {
    try {
        const transactions = await Transaction.find({});
        res.render('index', { transactions });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/addTransaction', (req, res) => {
    res.render('addTransaction');
});

//edit transaction
app.get('/edit/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        res.render('editTransaction', { transaction });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Update transaction
app.post('/edit/:id', async (req, res) => {
    try {
        await Transaction.findByIdAndUpdate(req.params.id, { $set: req.body });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Delete transaction
app.get('/delete/:id', async (req, res) => {
    try {
        await Transaction.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/addTransaction', async(req, res) => {
    const { description, amount } = req.body;

    const newTransaction = new Transaction({
        description,
        amount
    });

    try {
        await newTransaction.save();
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
    
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
