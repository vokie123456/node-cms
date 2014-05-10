var config = require('../config'),
    express = require('express'),
	router = express.Router(),
	siteURL = config.siteURL,

	auth = require('../model/admin/auth'),
	nav = require('../model/admin/nav'),
    article = require('../model/admin/article'),
    media  = require('../model/admin/media'),
    page    = require('../model/admin/page');

function isLogin(req,res,next){
	if(req.session && !req.session.username){
		res.redirect(siteURL + '/admin/login');
	}else{
		next();
	}
}
router.all('/',isLogin,auth.index);
router.all('/index',isLogin,nav.find,auth.index);

router.route('/login')
	.get(auth.auth)
	.post(auth.doLogin);

// ****************** 导航管理 开始  *********************//
router.all('/navlist',isLogin,nav.find,nav.list);

router.route('/navadd')
	.all(isLogin)
	.get(nav.addListShow)
	.post(nav.addListAction)


router.route('/navedit')
    .all(isLogin)
    .all(nav.find)
    .get(nav.edit)
    .post(nav.editSave)

router.all('/navdel',isLogin,nav.del);
router.all('/subnavdel',isLogin,nav.subDel);

// ****************** 导航管理 结束  *********************//

// ****************** 文章管理 开始  *********************//

router.route('/article_add')
    .all(isLogin)
    .get(article.add)
    .post(article.addAction)

router.all('/article_list',isLogin,article.list);

router.route('/article_do')
    .all(isLogin)
    .post(article.artcleDel)

router.route('/article_edit')
    .all(isLogin)
    .post(article.artcleEdit)
router.all('/article_comment',isLogin,article.comment);
router.all('/article_category',isLogin,article.category);


// ****************** 文章管理 结束  *********************//
router.route('/user')
	.all(isLogin)
	.get(auth.userList)
	.post(auth.userAdd)
	.put(auth.userUpdate)
	.delete(auth.userDelete)

// router.get('/showReg',isLogin, auth.showReg);
// router.get('/userList',isLogin,auth.userList);
// router.post('/addUser',isLogin,auth.addUser);

// *******  图片上传 ***********//

router.post('/imageUpload',isLogin,media.imageUpload);

router.all('/logout',auth.logout);


// router.get('/index',isLogin,auth.index);
// router.get('/article',isLogin,article.find);
// router.post('/article',isLogin,article.add);

module.exports = router;
