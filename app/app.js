const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use('/', (req, res) => {
    res.status(200).send("Hello World!");
});

/*If no routs applyies, 404 error*/
app.use((req, res) =>{
    req.statusCode(404);
    res.json({error: 'Not found'});
});

module.exports = app;