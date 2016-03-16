var express = require('express');
var router = express.Router();
var params = require('parameters-middleware');
var config= require('config');
var jwt = require('jwt-simple');
var ObjectId = require('mongoose').Types.ObjectId;
var moment= require('moment');
var async= require('async');
var db=require('../db/DbSchema');
var events = require('../events');
var log = require('tracer').colorConsole(config.get('log'));
var apn=require('../notificationSenders/apnsender');
var gcm=require('../notificationSenders/gcmsender');
var listingsLogic=require('../logic/listings');



router.get('/companies',
    function(req,res,next){
        listingsLogic.getList(req,res)
            .then(function(rows){
                res.json(rows);
            })
            .catch(function(err){
                res.status(err.status).json(err.message);
            })
    });
router.get('/bugs',
    function(){
        listingsLogic.getBounties(req,res)
            .then(function(rows){
                res.json(rows);
            })
            .catch(function(err){
                res.status(err.status).json(err.message);
            })
    });


module.exports = router;
