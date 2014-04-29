var config = require('../config'),
	mongoose = require('mongoose'),
	crypto = require('crypto'),
	adminPath = config.admin;
	mongoose.connect(config.uri);

var articleSchema = new mongoose.Schema({
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

var articleModel = mongoose.model('article',articleSchema);



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


