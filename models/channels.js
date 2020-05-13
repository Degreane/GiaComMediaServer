var moment=require('moment');
var mongoose=require('mongoose');
var _=require('lodash');
var ChannelSchema = new mongoose.Schema({
    'title':{type:String,unique:true,required:true},
    'description':{type:String},
    'address':{type:String},
    'enabled':{type:Boolean,default:true},
    'group':{type:Array,default:[]},
    'country':{type:String,default:'Lebanon'},
    'genre':{type:String,default: 'N/A'},
    'poster':{type:String, default:'N/A'},
    'uCreatedBy': {
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'},
    'createdAt':{type:Date,default:new moment()},
    'updatedAt': {type:Date,default: new moment()},
    'FileBaseDir':{type: String,default:'/vd1/vod'},
    'File':{type:String,default:'web.m3u8'},
    'MediaType':{type:String,enum:['file','http'],default:'file'}
});

module.exports = mongoose.model('channels',ChannelSchema);
