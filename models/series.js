var moment=require('moment');
var mongoose=require('mongoose');
var SeierSchema=new mongoose.Schema({
	'title'				:	{	type 	:	String	},
	'year'				:	{	type 	: Number	},
	'genres'			:	{	type 	:	String	},
	'description'	:	{	type 	:	String 	},
	'seasons'			: {	type	: [
		{
			'number': Number,
			'title': String,
		  'description': String,
		  'Episode': [{
				'number': Number,
				'title': String,
				'description': String,
				'file': String	
			}]
		}
	]}	
})
module.exports = mongoose.model('series',SeierSchema)