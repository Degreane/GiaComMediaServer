var moment=require('moment')
var mongoose=require('mongoose')
var configSchema = new mongoose.Schema({
    'key': { type: String ,required:true,unique:true},
    'value': { type:String,required:true},
    'comment':{type:String},
    'type':{type:String,enum:['path']},
    'createdAt':{type:Date,default:new moment()},
    'updatedAt': {type:Date,default: new moment()},
    'createdBy': {
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'},
    'enabled':{type:Boolean,default:true},
});

const getConfig = async function(filter){
    /**
     * if filter is undefined or empty then filter = {}
     * filter should always be an object
     */
    let query;
    let config=mongoose.model('config',configSchema);
    if (typeof(filter) == 'undefined'){
        query = {}
        return  await config.find(query).populate('createdBy')
    }else if(typeof(filter) == 'object' && Array.isArray(filter) == false) {
        query=filter
        return  await config.find(query).populate('createdBy')
    }
}
const saveConfig= async function(fdata){
    console.log('MODEL->saveConfig: ',fdata)
    let config=mongoose.model('config',configSchema);
    if (typeof(fdata)=='undefined'){
        console.log('MODEL->saveConfig: ','Data Undefined');
        return {result:'No Data Provided'}
    }else if(typeof(fdata)=='object'){
        try {
            var conf=new config(fdata)
            await conf.save(function(err,succ){
                if (err){
                    console.log(err)
                    return {result:err}
                }else{
                    console.log('MODEL->saveConfig: ',succ);
                }
            })
        } catch (error) {
            console.log(error)
        }
    }else{
        console.log(typeof(fdata))
    }
    return {}
}
const updateConfig=async function(fdata){
    console.log('MODEL->updateConfig : ',fdata)
    /**
     * fdata should always be as such:
     * {
     *      filter: {
     *          field:xyz
     *      },
     *      update: {
     *          field: abc
     *      }
     * }
     */
    if(fdata.hasOwnProperty('filter') && fdata.hasOwnProperty('update')){
        const config=mongoose.model('config',configSchema);
        try{
            fdata.update['updatedAt']=new moment();
            let result=await config.updateMany(fdata.filter,{$set:fdata.update});
            console.log(result);
            return {result:result}
        }catch(err){
            console.log(err);
            return {result:false}
        }
        

    }

}
const deleteConfig=async function(fdata){
    console.log('MODEL->deleteCOnfig : ',fdata);
    if(fdata.hasOwnProperty('filter')){
        const config=mongoose.model('config',configSchema);
        try {
            let result=await config.deleteMany(fdata.filter);
            console.log('MODEL->deleteConfig (Deleted): ',result);
            return {result:result}
        }catch(e){
            console.log('MODEL->deleteConfig (Err): ',e);
            return {result:false}
        }
    }
}
const configModel = {
    'config':mongoose.model('config',configSchema),
    'getConfig':getConfig,
    'saveConfig':saveConfig,
    'updateConfig':updateConfig,
    'deleteConfig':deleteConfig,
}
module.exports = configModel;


/** 
 * Config.js Module 
 * define configuration as key, value fields  
 * ToDo : Implement at first the configuration that specifies where to get/put paths.
 *          Path for Series
 *          Path for Movies
 *          Path for TV Channels
 *      Doing so enables us to avoid having to push/pull upon changes and makes changes more dynamic.
 *      But doing so deems us to create a new configuration pannel that populates this collection approperiately
 */