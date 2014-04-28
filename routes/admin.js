var config = require('../config'),
    express = require('express'),
	mongoose = require('mongoose'),
	crypto = require('crypto'),
	router = express.Router(),
	adminPath = config.admin;

	mongoose.connect(config.uri);
var adminSchema = new mongoose.Schema({
    username     : String, 
  	password : String,
  	savePassword :Boolean,
   	date     : Date
});

var adminModel = mongoose.model('admin',adminSchema);

router.get('/', isLogin,function(req, res,next) {
  res.send('hello admin');
});
router.get('/login', function(req, res){
	console.log(req.sessionID);
	if(req.session.username){
		res.redirect('index');
	}else{
		res.render(adminPath+'/login');
	}
  
});
router.post('/login', function(req, res) {
	var data = req.body;
		data.password = crypto.createHash('md5').update(data.password, 'utf8').digest("hex");
	
	adminModel.find(data,function(err,result){
		if (err) return handleError(err);
		if(result){		
			req.session.username = 1;
			req.session.save(function(err){
				if(err) throw new Error('no save');
				console.log(req.sessionID);
			});			
			res.redirect('index');
		}
	});


});

router.get('/reg', function(req, res) { 
  res.render(adminPath+'/reg');
});

router.post('/reg', function(req, res) {
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
	 
});

router.all('/logout',function(req,res){
	//req.session.destroy();
	res.redirect('login');
});

router.get('/index',isLogin,function(req,res,next){
	console.log(req.session);
	var index = {
		username : req.session.username
	};
	res.render(adminPath+'/index',index,function(err,html){
		if(err) console.log(err);
		res.send(html);
	});
});


function isLogin(req,res,next){
	if(req.session && !req.session.username){	
		res.redirect('/admin/login');
	}else{
		next();
	}	
}

module.exports = router;
