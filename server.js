var mach = require('mach');
var app = mach.stack();

var _ = require("lodash");
// var resources = require("./src/dynamodb");

// JSON 200 OK
function OK(conn){
	return function(data) {
		conn.json(200, data);
	}
};

var allowed = [
	'http://localhost:5005',
	'http://localhost:5000'
];

function cors(app) {
	return function (conn) {
		return conn.call(app).then(function () {
			var o = conn.request.headers.Origin
			if(allowed.indexOf(o) == 0)
			{
				console.log('allowing CORS for', o);
				conn.response.setHeader('Access-Control-Allow-Origin', o);
			    conn.response.setHeader('Access-Control-Allow-Credentials', true);
			}
		});
	};
}

app.use(cors);

app.use(mach.logger);
app.use(mach.params);

app.get('/ping', function(conn){
	return conn.json(200, {ok: true})
		// .anchors()
		// .then(OK(conn));
});

var geo = require('./src/geo')
app.get('/schools/geo', function(conn){
	var bb = conn.params.geobb || '90,4,-90,7';
	var bb = conn.params.geobb || '90,0,-90,180';
	var coordinates = bb.split(',').map(parseFloat);
	return geo(coordinates, conn.params.qs || undefined)
		// .anchors()
		.then(OK(conn));
});

// var api = require("./api");
// app.get('/school/:id/stats', function(conn){
// 	var id = conn.params.id;
// 	return dynamodb
// 		.getSchoolStats(id)
// 		.then(api.formatStats)
// 		.then(OK(conn));
// });
//
// app.get('/school/:id', function(conn){
// 	var id = conn.params.id;
// 	return dynamodb
// 		.getSchool(id)
// 		.then(OK(conn));
// });
//
// app.get('/schools', function(conn){
// 	return dynamodb
// 		.getSchools()
// 		.then(OK(conn));
// });

var config = require('./config');

if(config.serveStatic)
{
	var absoluteDir = /^\//.test(config.serveStatic);
	app.use(mach.file, {
		root: (absoluteDir ? '' : process.cwd() + '/') + config.serveStatic,
		index: 'index.html',
		useLastModified: true
	});	
}

mach.serve(app);
