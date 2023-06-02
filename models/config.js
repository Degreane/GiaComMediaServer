var moment=require('moment')
var mongoose=require('mongoose')
var configSchema = new mongoose.Schema({
    'key': { type: String ,required:true,unique:true},
    'value': { type:String,required:true},
    'comment':{type:String},
    'createdAt':{type:Date,default:new moment()},
    'updatedAt': {type:Date,default: new moment()},
    'createdBy': {
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'},
    'enabled':{type:Boolean,default:true},
});
module.exports = mongoose.model('config',configSchema);


/** 
 * Config.js Module 
 * define configuration as key, value fields  
 * ToDo : Implement at first the configuration that specifies where to get/put paths.
 *          Path for Series
 *          Path for movies
 *          Path for TV Channels
 *      Doing so enables us to avoid having to push/pull upon changes and makes changes more dynamic.
 *      But doing so deems us to create a new configuration pannel that populates this collection approperiately
 */