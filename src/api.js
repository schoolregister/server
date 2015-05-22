var _ = require('lodash');
var util = require('util');

var formatRow = function(row) {
  var e = {};

  // pull out the stats for each year
  ['lt_4',5,6,7,8,9,10,11].forEach(
    function(age){
      ['0_00', '0_30', '1_20'].forEach(
        function(s){
          // deep create empty dicts
          if(!e[age]) e[age] = {};
          if(!e[age][s]) e[age][s] = {};

          // look-up and deep assign field value
          var fieldName = util.format('students_%syr_%s', age, s)
          e[age][s] = parseFloat(row[fieldName] || 0);
        }
      )
    }
  );

  return e;
}

exports.formatStats = function(stat_rows){
  return _(stat_rows)
    .transform(function(acc,row) {

      // stats for this year
      acc.stats[row.year] = formatRow(row);

      // general info
      acc.school = {
        country: row.country,
        title: row.title,
        phase: row.phase,
      };

    },{stats: {}});
}
