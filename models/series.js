var moment=require('moment');
var mongoose=require('mongoose');


var SeierSchema=new mongoose.Schema({
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
/**
 * ToDo:
 * Each Episode needs to get a hold of a base path which is a request to getConfig({filter:{type:'path'}})
 */
module.exports = mongoose.model('series',SeierSchema)