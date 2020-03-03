var moment=require('moment');
var mongoose=require('mongoose');
var logSchema=mongoose.Schema({
    who:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    action:{ type: String,required:true},
    createdAt:{
        type:Date,
        default:new moment()
    },
    title: {type:String, required:true}
})
module.exports=mongoose.model('userlogs',logSchema);