var moment=require('moment');
var mongoose=require('mongoose');


var SerieSchema=new mongoose.Schema({
	'title'				:	{	type 	:	String	},
	'year'				:	{	type 	: 	Number	},
	'genres'			:	{	type 	:	String	},
	'description'		:	{	type 	:	String 	},
	'poster'			: 	{	type	: 	String},
	'createdAt'			:	{	type:Date,default:	new moment()	},
    'updatedAt'			:	{	type:Date,default:	new moment()	},
	'seasons'			: 	{	type	: [{
		'number'		: 	{ 	type 	: 	Number	},
		'title'			: 	{ 	type	:	String	},
		'description'	: 	{	type	:	String	},
		'createdAt'		:	{	type:Date,default:	new moment()	},
		'updatedAt'		: 	{	type:Date,default: 	new moment()	}, 
		  'episodes'	: 	[{
				'number'		: 	{ 	type 	: 	Number	},
				'title'			: 	{ 	type	:	String	},
				'description'	:	{ 	type	:	String	},
				'file'			: 	{ 	type	:	String,
										required:	true
									},
				'createdAt'		:	{	type	:	Date,
										default	:	new moment()
									},
				'updatedAt'		: 	{	type	:	Date,
										default	:	new moment()
									},
				'basePath'		: 	{	type	:	mongoose.Schema.Types.ObjectId,
					 					ref		:	'config',
										required:	true
									}
			}]
		}
	]}	
})
const model=mongoose.model('series',SerieSchema)
/**
 * ToDo:
 * Each Episode needs to get a hold of a base path which is a request to getConfig({filter:{type:'path'}})
 */
//module.exports = mongoose.model('series',SerieSchema)


const getSerie= async function(id){
	
	if (mongoose.isValidObjectId(id)){

		// console.log("MODELS->SERIE->getSerie : VALID ID ",id)
		let result=await model.findById(id).populate('seasons.episodes.basePath');
		// console.log("MODELS->SERIE->getSerie : Document  ",JSON.stringify(result,undefined,2))
		return result
	}else{
		// console.log("MODELS->SERIE->getSerie : INVALID ID ",id)
		return null
	}
}
exports.Series=mongoose.model('series',SerieSchema)
exports.getSerie=getSerie