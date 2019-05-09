import express = require("express");

const indexRouter: express.Router = express.Router();

/* GET home page. */
indexRouter.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

export default indexRouter;

module.exports.indexRouter
