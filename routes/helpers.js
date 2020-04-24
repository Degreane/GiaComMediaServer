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
var b64encode= function(str){
  var buff = new Buffer(str);
  var str64=buff.toString('base64');
  return str64;
}
var b64decode=function(b64str){
  var buff = new Buffer(b64str,'base64');
  var str = buff.toString('ascii');
  return str;
}
exports.b64encode=b64encode;
exports.b64decode=b64decode;
exports.text_truncate=text_truncate;
exports.pad=pad;