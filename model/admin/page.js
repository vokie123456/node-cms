var config = require('../../config'),
    mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    adminPath = config.admin;

var pageSchema = new mongoose.Schema({
	id        :Number,
    title     : String,
    subtitle  : String,
    author    : String,     
    seo : Object,
  	content : String,
  	comments :String,
   	date     : Date
});

var commentSchema = new mongoose.Schema({
    name  :  { type: String, default: 'hahaha' }
  , age   :  { type: Number, min: 18, index: true }
  , bio   :  { type: String, match: /[a-z]/ }
  , date  :  { type: Date, default: Date.now }
  , buff  :  Buffer
});

var pageModel = mongoose.model('page',pageSchema);



exports.index = function(req,res,next){
	
	res.render(adminPath+'/index',index,function(err,html){
		if(err) console.log(err);
		res.send(html);
	});
}

exports.find = function(req,res,next){
	var index = {
		username : req.session.username
	};
	res.render(adminPath+'/index',index,function(err,html){
		if(err) console.log(err);
		res.send(html);
	});
}


