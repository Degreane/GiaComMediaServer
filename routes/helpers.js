var _=require('lodash');
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
    return str.padEnd(width,padding||' ').replace(/  /g,'&nbsp; ');
  };
var b64encode= function(str){
  var buff = new Buffer(str);
  var str64=buff.toString('base64');
  return str64;
};
var b64decode=function(b64str){
  var buff = new Buffer(b64str,'base64');
  var str = buff.toString('ascii');
  return str;
};
var isIn=function(str2Searchfor,array2searchin){
  if (Array.isArray(array2searchin) && typeof(str2Searchfor) == 'string'){
    if (array2searchin.indexOf(str2Searchfor) !== -1 ){
      return true;
    }else{
      return false;
    }
  }else{
    return false;
  }
};
var buildElement=function(element){
  /*
      Element should be a json object describing the type of html tag.
  */
  if (typeof(element)=='object' ){
      /*
          get the keys of the element object 
      */
     var keys=_.keys(element);
     console.log(keys);
     
     /*
      check to see if the object has a type construct
     */
      if(_.indexOf(keys,'type')!== -1 ){
          console.log(element)
      }else{
          console.warn('No Type Construct for Element : ',element);
      }
  }     
};
exports.isIn = isIn;
exports.b64encode=b64encode;
exports.b64decode=b64decode;
exports.text_truncate=text_truncate;
exports.pad=pad;
exports.buildElement=buildElement;