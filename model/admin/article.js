var config = require('../../config'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    Schema   = mongoose.Schema,
    adminPath = config.admin;

var articleSchema = new mongoose.Schema({
    title     : String,
    subtitle  : String,
    author    : String,     
    seo : String,
    editorContent : String,
  	comments :[commentSchema],
    isShow   : Boolean,
    count : Number,
   	date     :  { type: Date, default: Date.now }
});

var commentSchema = new mongoose.Schema({
    name  :  { type: String, default: 'hahaha' }
  , age   :  { type: Number, min: 18, index: true }
  , bio   :  { type: String, match: /[a-z]/ }
  , date  :  { type: Date, default: Date.now }
  , buff  :  Buffer
});

var articleModel = mongoose.model('article',articleSchema);

//显示添加文章页面
exports.add = function(req,res,next){
	res.render(adminPath+'/article/add',{
        username : req.session.username,
        navs : req.session.nav
    });
}

//进行文章添加
exports.addAction = function(req,res,next){
   var article  = new articleModel(req.body);
    article.save(function(err,doc){
        if (err) res.send(err);
        res.redirect('article_list');
    });
}

// 文章列表
exports.list = function(req,res,next){
    var pageSize = 5;
    var page = req.param('page')-1 || 0 ;
    articleModel.find().count().exec(function(err ,sum){
        articleModel.find().limit(pageSize).skip(pageSize*page).sort({_id : 'asc'}).exec(function(err,articleList){
            if(err) res.send(err) ;


            res.render(adminPath+'/article/list',{
                username : req.session.username,
                pagination :{currentpage : page, sumpage : Math.ceil(sum/pageSize)},
                navs : req.session.nav,
                articleList : articleList,
                moment : moment
            });
        });

    });

}
// 批量删除 文章
exports.artcleDel = function(req,res,next){
    var idArr =req.param('id');
    articleModel.remove({_id:{ $in: idArr }}, function (err) {
        if (err) res.send(err);
        res.send("ok");
    });
};

exports.artcleEdit = function(req,res,next){
    var id = req.param('id');
    articleModel.findById(id,function (err, data) {
        if(err) res.send(err);
        res.render(adminPath+ '/artcle/edit',{
            username : req.session.username,
            navs : req.session.nav,
            data :data,
            message : ''
        });
    });
};

exports.comment = function(req,res,next){

}

exports.category = function(req,res,next){

}


