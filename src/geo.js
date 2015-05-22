var backend = require('./elasticsearch');

/* Perform Geo Boundingbox filter on top of (optional) querystring */

module.exports = function geoQuerystring(coords, qs){

	var q = {
		filtered: {
			filter: {
				geo_bounding_box: {
					geoLocation: {
						top_left: {
							lat: coords[0],
							lon: coords[1]
						},
						bottom_right: {
							lat: coords[2],
							lon: coords[3]
						}
					}
				}
			}			
		}
	}

	// if a query string is passed, mix it in
	if(qs)
		q.filtered.query = { query_string: { query: qs } };
	else
		q.filtered.query = { match_all: {} };

	return backend
		.schoolQuery(q);
}