var config = require('../config'),
    express = require('express'),
	router = express.Router(),
	auth = require('../model/admin/auth');

function isLogin(req,res,next){
	if(req.session && !req.session.username){	
		res.redirect('login');
	}else{
		next();
	}
}
router.all('/',isLogin,auth.index);
router.all('/index',isLogin,auth.index);
router.route('/login')
	.get(auth.auth)
	.post(auth.doLogin);

router.route('/user')
	.all(isLogin)
	.get(auth.userList)
	.post(auth.userAdd)
	.put(auth.userUpdate)
	.delete(auth.userDelete)


// router.get('/showReg',isLogin, auth.showReg);
// router.get('/userList',isLogin,auth.userList);
// router.post('/addUser',isLogin,auth.addUser);

router.all('/logout',auth.logout);

// router.get('/index',isLogin,auth.index);
// router.get('/article',isLogin,article.find);
// router.post('/article',isLogin,article.add);

module.exports = router;
