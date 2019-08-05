var express = require('express');
var router = express.Router();
var list = require('../public/data/list.json')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/list', function(req, res, next) {
  res.send({
    code:1,
    list
  });
});

module.exports = router;


//http://169.254.213.224:3000/list