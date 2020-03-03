const _= require('lodash');

var requiresLogin = function(req,res,next){
    if (!req.session.loggedIn){
        res.redirect('/login');
    }else{
        next();
    }
};
var isLoggedInUserEnabled = function(req,res,next){
    if (!req.session.loggedInUser['uEnabled']){
        res.redirect('/login');
    }else{
        next();
    }
};
var setLoggedInUserSession = function(req,res,next){
    if (!req.session.loggedIn){
        res.redirect('/login');
    }else{
        var userModel=require('../models/users')
        userModel.findById(req.session.loggedInUser['_id']).populate('uCreatedBy').exec(function(err,user){
            if(err){
                next(err);
            }else{
                console.log(user);
                req.session.loggedInUser=user;
                next();
            }
        })
    }
};
var userActionLog = function(req,res,next){
    if (req.session.actionLog){
        const { detailedDiff } = require('deep-object-diff');
        const uselogs = require('../models/userlogs')
        console.log(req.session.actionLog);
        var ddif=JSON.stringify(detailedDiff(JSON.parse(JSON.stringify(req.session.actionLog.oldLog)),JSON.parse(JSON.stringify(req.session.actionLog.newLog))))
        var query=new uselogs({
            who:req.session.actionLog.ref,
            action:ddif,
            title:req.session.actionLog.title
        })
        query.save(function(err,succ){
            if(err){
                console.log(err)
                next(err)
            }else{
                console.log(succ)
                uselogs.findById(succ._id).populate('who').exec(function(err,doc){
                    console.log(doc)
                })
                next()
            }
        })
    }
};
// req.session.actionLog={
//     oldLog:loggedInUser,
//     newLog:req.body,
//     ref:id2Check,
//     title:'Profile'
//   }
var getUserActionLog = function(req,res,next){
    const userLogs=require('../models/userlogs');
    if(['admin','siteAdmin','sysAdmin'].indexOf(req.session.loggedInUser.uType) !== -1 ){
        /*
            return all logs populating who
        */
    //    console.log(req.session.loggedInUser)
       userLogs.find().populate('who').sort({'createdAt':'desc'}).exec(function(err,succ){
           if(err){
               next(err);
           }else{
            //    console.log(succ,null,'\t');
               req.session.actionLogs=succ;
               next();
           }
       })
    }else{
        userLogs.find({'who':req.session.loggedInUser._id}).populate('who').sort({'createdAt':'desc'}).exec(function(err,succ){
            if(err){
                next(err);
            }else{
                req.session.actionLogs=succ;
                next();
            }
        })
    }
};
// var getAllUsers = function(req,res,next){
//     const userModel= require('../models/users');
//     if(['admin','siteAdmin','sysAdmin'].indexOf(req.session.loggedInUser.uType !== -1){
//         userModel.find().sort({'createdAt':'desc'}).populate('uCreatedBy').exec(function(err,succ){

//         })
//     }

// }
var isLoggedInUser = function(req,res,next){
    if (req.session.loggedIn && req.session.loggedInUser){
        res.locals={
            'loggedInUser':req.session.loggedInUser,
            'loggedIn':req.session.loggedIn || null,
        };
    }
    next();
};
var getMovieList = async function(req,res,next){
    /*
    to get the movie list we populate based upon req query string or form to check for page, count,year,genre, title regex  
    */
   var query={}
   if (typeof(req.session.movies)=='undefined') {
    req.session.movies={};
   }
   if('select_year' in req.query){
       /*
        if select_year is in the query submitted then we should show a modal of years to select one from.
        this modal should be placed on top of movies page.
       */
      
        try {
            const Movies=require('../models/movies');
            res.locals['movies']={};
            res.locals.movies['years']= await Movies.find().select({'year':1,'_id':0}).distinct('year');
            // console.log('Requesting List Of Years ')
            // console.log(res.locals);
        } catch (error) {
            next(error);
        }
   }
//    console.log(res.locals)
   if ('select_genre' in req.query){
       try {
            const Movies=require('../models/movies');
            if (typeof(res.locals['movies']) == 'undefined'){
                res.locals['movies']={};
            }
            var theGenres= await Movies.find().select({'genres':1,'_id':0}).distinct('genres');
            var theGenresConcatenated=_.uniq(_.replace(_.join(theGenres,','),/ /g,'').split(',') )
            // console.log(theGenresConcatenated);
            next();
       } catch(error){
            next(error);
       }
   }
   if ('list_year' in req.query && req.query['list_year'] !== 'any' ){
        query['year']=parseInt(req.query['list_year']);
        req.session.movies['list_year']=query['year'];
   }else if('list_year' in req.session.movies){
        query['year']=req.session.movies['list_year'];
   }
   if ('list_year' in req.query && req.query['list_year'] == 'any') {
        delete req.session.movies['list_year'];
   }
   console.log("The Requested Query ",query); 
   try {
        const Movies=require('../models/movies');
        if (typeof(res.locals['movies']) == "undefined"){
            res.locals['movies']={};
        }
        
        res.locals.movies['list']=[];
        res.locals['movies']['count']=await Movies.countDocuments(query);
        res.locals.movies.list=await Movies.find(query).limit(24);
    } catch (error) {
        res.locals['movies']={'err':JSON.stringify(error)};
    }
    next();
};
exports.getMovieList=getMovieList;
exports.isLoggedInUser=isLoggedInUser;
exports.requiresLogin=requiresLogin;
exports.isLoggedInUserEnabled=isLoggedInUserEnabled;
exports.setLoggedInUserSession=setLoggedInUserSession;
exports.userActionLog=userActionLog;
exports.getUserActionLog=getUserActionLog;