var config = require('../../config'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    adminPath = config.admin;

var mediaSchema = new mongoose.Schema({
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

var mediaModel = mongoose.model('media',mediaSchema);



exports.index = function(req,res,next){

    res.render(adminPath+'/index',index,function(err,html){
        if(err) console.log(err);
        res.send(html);
    });
}

exports.imageUpload = function(req,res,next){
    console.log(req.files.upfile.path.replace('public\\',''));
      var upload = {
           'url': req.files.upfile.path.replace('public\\',''),
           'title': req.files.upfile.name,
           'original': req.files.upfile.originalname,
           'size' : req.files.upfile.size,
           'type' : '.'+req.files.upfile.extension,
           'state': 'SUCCESS'

       }
      res.json(upload);
}


exports.imageManger = function(req,res,next){

    var str = '';
    var i = 0;
    fs.readdir(__dirname + '/uploads', function(err, files) {
        if (err) throw err;

        var total = files.length;

        files.forEach(function(file) {
            str += file + 'ue_separate_ue';
            i++;

            // send file name string when all files was processed
            if(i === total) {
                res.end(str);
            }
        });
    });
}



