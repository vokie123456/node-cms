var config = require('../../config'),
	mongoose = require('mongoose'),
	Schema   = mongoose.Schema,
	adminPath = config.admin;

	//mongoose.connect(config.uri);

var listSchema = new Schema({	
    name     : String,
    active    : Boolean,
    url      : String   
});

var navSchema = new Schema({	
    sort     : String,
    active    : {type : Boolean, default : false},
    url :  String,
   	list :  [listSchema]
});


var navModel = mongoose.model('nav',navSchema);
var nav = {
	find : function(req,res,next){
		navModel.find().sort({_id : 'asc'}).exec(function (err, navData) {
			if(err) throw new Error(err);
			req.session.nav =navData ;
			next();
		});
	},
	list : function(req,res,next){
		var pageSize = 5;		
		var page = req.param('page')-1 || 0 ;
		
		navModel.find().count().exec(function(err ,sum){
			navModel.find().limit(pageSize).skip(pageSize*page).sort({_id : 'asc'}).exec(function(err,list){
				if(err) res.send(err) ;
				res.render(adminPath+ '/nav/navList',{
					username : req.session.username,
					pagination :{currentpage : page, sumpage : Math.ceil(sum/pageSize)},
					navs : req.session.nav,
					navlist :list
				});	
			});

		});
		
	},

	addListShow : function(req,res,next){
		res.render(adminPath+ '/nav/navAdd',{
				username : req.session.username,
				navs : req.session.nav
		});
	},

	addListAction : function(req,res,next){
		var nav = new navModel(req.body);
		nav.save(function (err) {
		  if (err) return res.send(err);

		  res.redirect('navlist');

		});

	},

	edit : function(req,res,next){
		var id = req.param('id');
		navModel.findById(id,function (err, data) {
			if(err) res.send(err);
            res.render(adminPath+ '/nav/navEdit',{
                username : req.session.username,
                navs : req.session.nav,
                data :data,
                message : ''
            });
		});
	},
    editSave : function(req,res,next){
        var id = req.param('id');
        var update = req.body;
        navModel.findOneAndUpdate({_id : id},update,function (err, data) {
          if(err) res.send(err);
            res.render(adminPath+ '/nav/navEdit',{
                username : req.session.username,
                navs : req.session.nav,
                data :data,
                message : 'success'
            });
        });
    },

	del : function(req,res,next){
        var idArr =req.param('id');
        console.log(idArr);
        navModel.remove({_id:{ $in: idArr }}, function (err) {
            if (err) res.send(err);
            res.send("ok");
        });
	},
	subDel : function(req,res,next){
		var id = req.param('id');
		var subid = req.param('subid');
		navModel.findById(id,function (err, doc) {
			if(err) res.send(err);
			doc.list.id(subid).remove();
			doc.save(function (err) {
				if(err) res.send(err);
				res.redirect('navlist');
			})
		});	

	}
}
module.exports = nav;
