var mongoose=require('mongoose');
var ChannelSchema = new mongoose.Schema({
    'title':{type:String,unique:true,required:true},
    'description':{type:String},
    'address':{type:String},
    'enabled':{type:Boolean,default:true},
    'group':{type:Array,default:[]},
    'country':{type:String,default:'Lebanon'},
    'genre':{type:String,default: 'N/A'},
    'poster':{type:String, default:'N/A'}
});
module.exports = mongoose.model('channels',ChannelSchema);
