var text_truncate = function(str, length, ending) {
    if (length == null) {
      length = 100;
    }
    if (ending == null) {
      ending = '...';
    }
    if (str.length > length) {
      return str.substring(0, length - ending.length) + ending;
    } else {
      return str;
    }
  };
  var pad = function(str, width) { 
    var padding=' ';
    return str.padEnd(width,padding||' ').replace(/  /g,'&nbsp; ')
  };

exports.text_truncate=text_truncate;
exports.pad=pad;