const express = require('express');
const path = require('path');
const app = express();
app.set('title', 'ethan-pollack.com')
app.set('view engine', 'html');
app.use(express.static('public'))

const port = 3000;

app.get('/', (req, res) => {
    res.sendFile('html/home.html', {root: path.join(__dirname, 'public')});
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

