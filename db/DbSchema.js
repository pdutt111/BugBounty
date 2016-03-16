/**
 * Created by pariskshitdutt on 09/06/15.
 */
var mongoose = require('mongoose');
//var mockgoose=require('mockgoose');
var config = require('config');
var events = require('../events');
var log = require('tracer').colorConsole(config.get('log'));
var ObjectId = require('mongoose').Types.ObjectId;
var validate = require('mongoose-validator');
var nameValidator = [
    validate({
        validator: 'isLength',
        arguments: [3, 50],
        message: 'Name should be between 3 and 50 characters'
    })
];
var emailValidator=[
    validate({
        validator: 'isEmail',
        message: "not a valid email"
    })
];
var phoneValidator = [
    validate({
        validator: 'isLength',
        arguments: [10, 10],
        message: 'phonenumber should be 10 digits'
    })
];
var db=mongoose.createConnection(config.get('mongo.location'),config.get('mongo.database'));
var userdef;
var pindef;
var bugsdef;
var companiesdef;

var Schema = mongoose.Schema;
mongoose.set('debug', config.get('mongo.debug'));
/**
 * user schema stores the user data the password is hashed
 * @type {Schema}
 */
var userSchema=new Schema({
    _id:String,
    email:{type:String,validate:emailValidator},
    phonenumber:{type:String,validate:phoneValidator,unique:true,dropDups:true},
    password:{type:String},
    name:{type:String},
    Bounties_earned:{type:Number,default:0},
    level:{type:Number,default:1},
    device:{service:String,reg_id:String,active:{type:Boolean,default:true}},
    is_admin:{type:Boolean,default:false},
    is_verified:{type:Boolean,default:false},
    created_time:{type:Date,default:Date.now},
    modified_time:{type:Date,default:Date.now}
});

var pinschema=new Schema({
    phonenumber:{type:String},
    pin:Number,
    used:{type:Boolean,default:false}
});

var companiesSchema=new Schema({
    name:{type:String,validate:nameValidator,unique:true,dropDups:true},
    hr_email:{type:String,validate:emailValidator},
    tech_email:{type:String,validate:emailValidator},
    platforms:[String],
    bounties_paid:Number,
    bugs_resolved:Number,
    is_active:{type:Boolean,default:false},
    is_verified:{type:Boolean,default:false},
    created_time:{type:Date,default:Date.now},
    modified_time:{type:Date,default:Date.now}
});
var bugsSchema=new Schema({
    company_id:{type:ObjectId,ref:'companies'},
    user_id:{type:ObjectId,ref:'users'},
    brief_description:String,
    long_description:String,
    title:String,
    bid:[{from:String,amount:Number,is_accepted:{type:Boolean,default:false}}],
    user_severity:String,
    accertained_severity:String,
    is_resolved:{type:Boolean,default:false},
    is_active:{type:Boolean,default:false},
    is_verified:{type:Boolean,default:false},
    created_time:{type:Date,default:Date.now},
    modified_time:{type:Date,default:Date.now}
});
db.on('error', function(err){
    log.info(err);
});
/**
 * once the connection is opened then the definitions of tables are exported and an event is raised
 * which is recieved in other files which read the definitions only when the event is received
 */
    userdef=db.model('user',userSchema);
    pindef=db.model('pins',pinschema);
    bugsdef=db.model('bugs',bugsSchema);
    companiesdef=db.model('pins',companiesSchema);

    exports.getpindef=pindef;
    exports.getuserdef= userdef;
    exports.getcompaniesdef= companiesdef;
    exports.getbugsdef= bugsdef;
    events.emitter.emit("db_data");

