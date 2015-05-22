var elasticsearch = require('elasticsearch');
var options = require('../config').elasticsearch;
var host = options.host || 'localhost';
var port = options.port || 9200;
var index = options.index || 'schoolregister';
var logLevel = options.logLevel || 'error';

var client = new elasticsearch.Client({
  host: host + ':' + port,
  log: logLevel
});

exports.schoolQuery = function(q){
	return client
		.search({
			index: index,
			type: 'school',
			body: {
				query: q
			}
		})
		.then(function(results){
			// return list of source documents
			return results.hits.hits.map(function(x){return x._source;});
		})
;
}