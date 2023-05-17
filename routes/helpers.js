/**
Helpers:
Exposes set of functionalities and helper methods as middlewares

text_truncate: truncates a string to a certain length (Defaults 100 character, unless specified)

*/
var _ = require('lodash');
var uuid = require('uuid');
/**
Turncate Text to a certain length (defaults 100 characters, unless specified)

*/
var text_truncate = function (str, length, ending) {
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

/**
Adds padding to a certain width 
*/
var pad = function (str, width) {
  var padding = ' ';
  return str.padEnd(width, padding || ' ').replace(/  /g, '&nbsp; ');
};
var b64encode = function (str) {
  var buff = new Buffer(str);
  var str64 = buff.toString('base64');
  return str64;
};
var b64decode = function (b64str) {
  var buff = new Buffer(b64str, 'base64');
  var str = buff.toString('ascii');
  return str;
};

/**
 * 
 * @param String str2Searchfor 
 * @param Array array2searchin 
 * @returns Boolean (True if String is in Array)/(False if String is not in Array)
 */
var isIn = function (str2Searchfor, array2searchin) {
  if (Array.isArray(array2searchin) && typeof (str2Searchfor) == 'string') {
    if (array2searchin.indexOf(str2Searchfor) !== -1) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};
/**
 * 
 * @param Any element
 * 
 * @todo  Need to complete building structure of elements 
 */
var buildElement = function (element) {
  /*
      Element should be a json object describing the type of html tag.
  */
  if (typeof (element) == 'object') {
    /*
        get the keys of the element object 
    */
    var keys = _.keys(element);
    console.log(keys);

    /*
     check to see if the object has a type construct
    */
    if (_.indexOf(keys, 'type') !== -1) {
      console.log(element)
    } else {
      console.warn('No Type Construct for Element : ', element);
    }
  }
};

/**
 * 
 * @returns String representation of a unique id version 4
 */
var rId = function () {
  return uuid.v4().toString();
}

/**
 * @description Map folder and return object of files and folders
 * @argument folder 
 */

var filesInFolder =  function(folder,include,exclude,filter){
  var folderMap=require('map-folder');

  var result =  folderMap(folder,{
    include:include,
    exclude:exclude,
    filter:filter,
  });
  console.log("The result of folder-map is \nInclude:",include,"\n",result,"\n<-----------------\n");
  return result;
}
exports.filesInFolder=filesInFolder;
exports.isIn = isIn;
exports.random = rId;
exports.b64encode = b64encode;
exports.b64decode = b64decode;
exports.text_truncate = text_truncate;
exports.pad = pad;
exports.buildElement = buildElement;