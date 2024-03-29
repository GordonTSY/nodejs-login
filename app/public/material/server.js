                                                                       
var express = require('express');
var app = express();

var fs = require('fs'),
    path = require('path'),
    material_hdlr = require('./handlers/materials.js'),
	subject_hdlr =require('./handlers/subjects.js'),
	syllabus_hdlr=require('./handlers/syllabus.js'),
	announcement_hdlr=require('./handlers/announcement.js'),
    page_hdlr = require('./handlers/pages.js'),
    helpers = require('./handlers/helpers.js');

app.get('/v1/materials.json', material_hdlr.list_all);
app.get('/v1/materials/:material_name.json', material_hdlr.material_by_name);
//app.get('/subjects.json', subject_hdlr.list_subject_list);
//app.get('/announcement.json', announcement_hdlr.getAnnouncement);
app.get('/pages/:page_name',function (req, res) {
	page_hdlr.generate(req, res);
	});
app.get('/pages/:page_name/:sub_page',function (req, res) {
	page_hdlr.generate(req, res);
	});
app.get('/content/:filename', function (req, res) {
    serve_static_file('content/' + req.params.filename, res);
});
app.get('/materials/:permanent_ID/:current_ID/:filename', function (req, res) {
	var url="materials/"+req.params.permanent_ID+"/"+req.params.current_ID+"/"+req.params.filename;
    serve_static_file(url,res);
});
/*
//It shouldn't be implemented in this way since the user may had taken the subject for several time,
//so there would be multi current ID. 
app.get('/syllabus/:permanent_ID/:current_ID',function (req, res) {
	var url="syllabus/"+req.params.permanent_ID+"/"+req.params.current_ID;
	serve_static_file(url,res);
}); 
*/
app.get('/syllabus/:permanent_ID',function (req, res) {
	syllabus_hdlr.load_syllabus(req,res,serve_static_file);
});
//Called by announcement_hdlr.getAnnouncement,return a object with single property 
//which contains all announce in the curentID folder. 
app.get('/announcement/:permanent_ID',function (req, res) {
	announcement_hdlr.listAnnouncement(req, res);
});
app.get('/templates/:template_name', function (req, res) {
    serve_static_file("templates/" + req.params.template_name, res);
});
app.get('/announce/:permanent_ID/:current_ID/:filename',function(req,res){
	announcement_hdlr.showAnnouncement(req,res);
});
app.get('*', four_oh_four);


function four_oh_four(req, res) {
    res.writeHead(404, { "Content-Type" : "application/json" });
    res.end(JSON.stringify(helpers.invalid_resource()) + "\n");
}

function serve_static_file(file, res) {
    fs.exists(file, function (exists) {
        if (!exists) {
            res.writeHead(404, { "Content-Type" : "application/json" });
            var out = { error: "not_found",
                        message: "'" + file + "' not found" };
            res.end(JSON.stringify(out) + "\n");
            return;
        }

        var rs = fs.createReadStream(file);
        rs.on(
            'error',
            function (e) {
                res.end();
            }
        );
        var ct = content_type_for_file(file);
        res.writeHead(200, { "Content-Type" : ct });
        rs.pipe(res);
    });
}
function content_type_for_file (file) {
    var ext = path.extname(file);
    switch (ext.toLowerCase()) {
        case '.html': return 'text/html';
        case '.js': return 'text/javascript';
        case '.css': return 'text/css';
        case '.jpg': case '.jpeg': return 'image/jpeg';
		case '.pdf': return 'application/pdf';
        default: return 'text/plain';
    }
}

app.listen(8080);
