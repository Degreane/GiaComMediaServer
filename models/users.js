var moment=require('moment')
var mongoose=require('mongoose')
var userSchema = new mongoose.Schema({
    'uName': { type: String ,required:true,unique:true},
    'uPass': { type:String,required:true},
    'uType': { type:String,enum:['client','admin','siteAdmin','sysAdmin','guest'],default:'guest'},
    'uFirstName': {type:String},
    'uLastName': {type:String},
    'uInfo':{type:String},
    'uComment':{type:String},
    'createdAt':{type:Date,default:new moment()},
    'updatedAt': {type:Date,default: new moment()},
    'uCreatedBy': {
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'},
    'uEnabled':{type:Boolean,default:true},
    'uOnline': {type:Boolean,default:false}
});
module.exports = mongoose.model('users',userSchema);
/*
{
    _id: 5e1b69dbd39c1125786c5d5f,
    uName: 'Admin',
    uPass: 'NimdaPass',
    uType: 'sysAdmin',
    uFirstName: 'System',
    uLastName: 'Administrator',
    uInfo: 'Admin User Created By The System',
    uComment: 'Admin User Created By The system Upon Initialization',
    uCreatedBy: 'system bootstrap',
    createdAt: 1578854875812,
    updatedAt: 1578854875812,
    uEnabled: true,
    uOnline: false
*/