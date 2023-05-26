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
				'file'			: 	{ 	type	:	String	},
				'createdAt'		:	{	type:Date,default:	new moment()	},
				'updatedAt'		: 	{	type:Date,default:	new moment()	},
			}]
		}
	]}	
})
module.exports = mongoose.model('series',SeierSchema)