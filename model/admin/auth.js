var config = require('../../config'),
	mongoose = require('mongoose'),
	crypto = require('crypto'),
	adminPath = config.admin;
	mongoose.connect(config.uri);
var adminSchema = new mongoose.Schema({
    username : String, 
  	password : String,
  	savePassword :Boolean,
  	name : String,
  	age : String,
  	email : String,
  	tel : String,
  	desc : String,
   	date     : Date
});

var adminModel = mongoose.model('admin',adminSchema);

exports.auth = function(req, res,next){
	if(req.session.username){
		res.redirect('index');
	}else{
		res.render(adminPath+'/login',{
			msg : ''
		});
	}
  
}

exports.index =function(req,res,next){
	var index = {
		username : req.session.username,
		navs : req.session.nav
	};
	res.render(adminPath+'/index',index,function(err,html){
		if(err) throw new Error(err);
		res.send(html);
	});
}



exports.doLogin = function(req, res,next) {
	var data = req.body;
		data.password = crypto.createHash('md5').update(data.password, 'utf8').digest("hex");
	adminModel.find(data,function(err,result){
		if (err) return handleError(err);		
		if(result.length){		
			req.session.username = data.username;
			res.redirect('index');
		}else{
			res.render(adminPath+'/login',{
				msg :'账号或密码错误!'		
			});
		}
	});
}

exports.showReg = function(req, res,next) { 
  res.render(adminPath+'/reg');
}

exports.doReg = function(req, res,next) {
	var data = req.body;
	if(data.password == data.repassword){
		adminModel.find({username : data.username},function(err,doc){
			if (err) return handleError(err);
			if(doc.length){
				res.send("用户名已注册!");
			}else{
				data.password = crypto.createHash('md5').update(data.password, 'utf8').digest("hex");
				var user= new adminModel(data);	
				user.save(function (err) {
				  if (err) return handleError(err);
				  	res.send('注册成功,请登录！<a href="login">点击登陆</a>');		 	
				});
			}
		});	
	}else{
		res.send("密码不一致！");
	}	 
}

exports.userList = function(req, res,next) { 
  var userList = {
		username : req.session.username,
		notice : '',

	};
	res.render(adminPath+'/user',userList,function(err,html){
		if(err) throw new Error(err);
		res.send(html);
	});
}
exports.userAdd = function(req, res,next) { 
  res.render(adminPath+'/reg');
}
exports.userUpdate = function(req, res,next) { 
  res.render(adminPath+'/reg');
}
exports.userDelete = function(req, res,next) { 
  next();

}


exports.logout = function(req,res,next){
	req.session.destroy();
	res.redirect('login');
}