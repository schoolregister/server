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

var _ = require('lodash');

var aggs = {
    "denomination": {
      "terms": {
        "field": "denomination",
        "size": 50
      }
    },
    "building_type": {
      "terms": {
        "field": "building_type",
        "size": 10
      }
    },
    "method": {
      "terms": {
        "field": "method",
        "size": 10
      }
    },
    "category": {
      "terms": {
        "field": "category",
        "size": 10
      }
    },
    "population": {
      "terms": {
        "field": "population",
        "size": 10
      }
    },
    "kind_of_education": {
      "terms": {
        "field": "kind_of_education",
        "size": 10
      }
    },
    "strict_or_free": {
      "terms": {
        "field": "strict_or_free",
        "size": 10
      }
    }
  };

exports.schoolQuery = function(q){
	return client
		.search({
			index: index,
			type: 'school',
			body: {
				query: q,
				aggs: aggs
			}
		})
		.then(function(results){
			// return list of source documents
			return {
				total: results.hits.total,
				matches: results.hits.hits.map(function(x){return x._source;}),
				facets: _(results.aggregations).mapValues(function(val) {
					return val.buckets.map(function(v){
						return {
							value: v.key,
							count: v.doc_count
						}
					});
				})
			};
		});
}