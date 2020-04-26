const _= require('lodash');
const fs=require('fs');
const path = require('path');

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
        /*
        if no session movies set then set the movies session to hold a dictionary 
        */
        req.session.movies={};
    }
    if (typeof(res.locals['movies']) == "undefined"){
        /*
        if no res locals of movies set then set it to be a dictionary 
        */
        res.locals['movies']={};
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
            console.log(theGenres)
            res.locals.movies['genres']=await _.uniq(_.replace(_.join(theGenres,','),/ /g,'').split(',') );
            //next();
       } catch(error){
            next(error);
       }
   }
   if ('page' in req.query){
        var skip=(parseInt(req.query.page)-1)*24;
        res.locals.movies.page=req.query.page;
        console.log('Skip ',skip);
   }else{
       var skip=0;
       res.locals.movies.page=1;
       console.log('Skip ',skip);
   }
   if ('list_year' in req.query && req.query['list_year'] !== 'any' ){
        query['year']=parseInt(req.query['list_year']);
        res.locals.movies['list_year']=req.query['list_year'];
        req.session.movies['list_year']=query['year'];
   }else if('list_year' in req.session.movies){
        res.locals.movies['list_year']=req.session.movies['list_year'];
        query['year']=req.session.movies['list_year'];
   }
   if ('list_year' in req.query && req.query['list_year'] == 'any') {
        delete req.session.movies['list_year'];
        delete res.locals.movies['list_year'];
        delete query['year'];
   }
   if ('list_genre' in req.query && req.query['list_genre'] !== 'any'){
       query['genres']=new RegExp(req.query['list_genre'],"g");
       res.locals.movies['list_genre']=req.query['list_genre'];
       req.session.movies['list_genre']=req.query['list_genre'];
   }else if('list_genre' in req.session.movies){
       res.locals.movies['list_genre']=req.session.movies['list_genre'];
       query['genres']=new RegExp(req.session.movies['list_genre'],"g");
   }
   if ('list_genre' in req.query && req.query['list_genre'] == 'any') {
       delete req.session.movies['list_genre'];
       delete res.locals.movies['list_genre'];
       delete query['genres'];
   }
   if ('s' in req.query && req.query['s'].trim().length > 0){
       query['title']=new RegExp(req.query['s'],"gi");
       req.session.movies['s']=req.query['s'];
       res.locals.movies['s']=req.query['s'];
   }else if('s' in req.session.movies){
       query['title']=new RegExp(req.session.movies['s'],"gi");
       res.locals.movies['s']=req.session.movies['s'];
   }
   if ('clear' in req.query) {
        delete req.session.movies['s'];
        delete res.locals.movies['s'];
        delete query['title'];
   }
   
   console.log("The Requested Query ",query,req.session.movies); 
   try {
        const Movies=require('../models/movies');
        if (typeof(res.locals['movies']) == "undefined"){
            res.locals['movies']={};
        }
        
        res.locals.movies['list']=[];
        res.locals['movies']['count']=await Movies.countDocuments(query);
        res.locals.movies.list=await Movies.find(query).sort({title:'asc'}).skip(skip).limit(24);
        
    } catch (error) {
        res.locals['movies']={'err':JSON.stringify(error)};
    }
    next();
};

var getMovieAttribute = async function(req,res,next){
    /*
        actually this comes from watch?movie=_id
        so:
        1- search for the movie with the ID specified.
        2- const Movies=require('../models/movies');
    */
    var query= {}
    if ('movie' in req.query){
        query['_id']=req.query['movie'];
        if (typeof(res.locals.movie) == 'undefined'){
            res.locals['movie']={}
        }
        try {
            const Movies=require('../models/movies');
            res.locals.movie=await Movies.findOne(query);
            console.log(res.locals);
            next();
        } catch (error) {
            next(error)
        }
    }else if ('id' in req.query){
        /*
            if the id is given then we should get the file in hand 
            for simplicity i shall work on sample file only which is 3.1 GB
        */
        const videoBasePath=path.join('/','movies','transcoded');
        console.log(req.query['id']);
        const videoPath=path.join(videoBasePath,res.locals.b64decode(req.query['id']))+'.mp4'
        // console.log(videoPath);
        //const path = 'Videos/MachineLearningwithPython_MachineLearningTutorialforBeginners_MachineLearningTutorial-RnFGwxJwx-0.mp4'
        // const path = require('path')
        try {
            console.log(req.headers)
            const stat = fs.statSync(videoPath)
            // console.log(stat)
            const fileSize = stat.size
            const range = req.headers.range
            if (range) {
                // console.log('Range ----------')
                const parts = range.replace(/bytes=/, "").split("-")
                const start = parseInt(parts[0], 10)
                var theEnd=start+2048000 >= fileSize-1 ? fileSize -1: start+2048000
                const end=parts[1]? parseInt(parts[1],10):  theEnd
                // const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1
                const chunksize = (end-start)+1
                const file = fs.createReadStream(videoPath, {'start':start, 'end':end})
                const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
                }
                res.writeHead(206, head);
                file.pipe(res);
            } else {
                // console.log('Fullllllllllllllll')
                const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
                }
                res.writeHead(200, head)
                fs.createReadStream(videoPath).pipe(res)
            }    
        } catch (error) {
            console.log(error);

        }
        
    }
    
};
var getChannels=async function(req,res,next){
    const Channels=require('../models/channels');
    if(typeof(res.locals['channels']) == 'undefined'){
        res.locals['channels']={};
    }
    if(typeof(req.session['channels']) == 'undefined'){
        req.session['channels']={}
    }
    if ('page' in req.query){
        var skip=(parseInt(req.query.page)-1)*24;
        res.locals.movies.page=req.query.page;
    }
    try {
        // 1- Count Channels
        var channel_Count=await Channels.find().count();
        // 2- get the channels list 
        var list = await Channels.find().skip(skip);
        res.locals.channels['total_count']=channel_Count;
        res.locals.channels['list']=list;
    } catch (err) {
        next(err);
    }
    next();
}
exports.getChannels=getChannels;
exports.getMovieAttribute=getMovieAttribute;
exports.getMovieList=getMovieList;
exports.isLoggedInUser=isLoggedInUser;
exports.requiresLogin=requiresLogin;
exports.isLoggedInUserEnabled=isLoggedInUserEnabled;
exports.setLoggedInUserSession=setLoggedInUserSession;
exports.userActionLog=userActionLog;
exports.getUserActionLog=getUserActionLog;