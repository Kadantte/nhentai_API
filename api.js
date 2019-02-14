const express = require('express');
const gethentai = require('./gethentai');

const app = express();


// /page/1
app.get('/page/:page', (req, res)=> {
    gethentai
        .gethentaip(req.params.page)
        .then(hentais => {
            res.json(hentais);
        });
});

// /g/262980/
app.get('/g/:ID', (req, res)=> {
    gethentai
        .gethentai(req.params.ID)
        .then(hentai => {
            res.json(hentai);
        });
});

app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
  });
  app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  });
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on ${port}`);
});