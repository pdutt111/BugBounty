/**
 * Created by pariskshitdutt on 08/03/16.
 */
var q= require('q');
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
var crypto=require('../authentication/crypto');
var bcrypt = require('bcrypt');

var companiesTable=db.getcompaniesdef;
var bugsTable=db.getbugsdef;

var listings={
    getList:function(req,res){
        var def= q.defer();
        companiesTable.find({is_active:true},"name platform bounties_paid",function(err,rows){
            if(!err){
                def.resolve(rows);
            }else{
                def.reject({status:500,message:config.get('error.dberror')});
            }
        });
        return def.promise;
    },
    getBounties:function(req,res){
        var def= q.defer();
        bugsTable.find({created_date:req.query.before,is_resolved:true},
            "title brief_description accertained_severity")
            .sort({created_time:-1})
            .limit(20)
            .populate('companies_id',"name ")
            .exec(function(err,rows){
            if(!err){
                def.resolve(rows);
            }else{
                def.reject({status:500,message:config.get('error.dberror')});
            }
        })
    }
};
module.exports=listings;