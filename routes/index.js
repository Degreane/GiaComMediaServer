var express = require('express');
var moment=require('moment')
var router = express.Router();
var { requiresLogin,isLoggedInUserEnabled,setLoggedInUserSession,userActionLog,getUserActionLog,isLoggedInUser,getMovieList,getMovieAttribute,getChannels } =require('./middlewares') 
var {text_truncate,pad,b64decode,b64encode}= require('./helpers');
// var {diff} = require('deep-object-diff') 

/* GET home page. */
router.get('/',function(req, res, next) {
  var locals={
    'title':'GiaCom Media Server (2019)&copy;&reg;',
    'page':'home',
    'loggedIn':req.session.loggedIn || null,
  }
  res.redirect('/movies');
});

/*
 Get Login Page
*/
router.get('/login',function(req,res,next){
  var locals={
    'title':'GiaCom Media Server (2019)&copy;&reg;',
    'page':'login'
  }
  res.render('login',{locals:locals});
})
router.post('/login',function(req,res,next){
  var locals={
    'title':'Login - GiaCom Media Server (2019)&copy;&reg;',
    'page':'login'
  }
  var userModel=require('../models/users')
  var query=req.body || {};
  query['uEnabled']=true
  userModel.findOne(query).populate('uCreatedBy').exec(function(err,result){
    if(err){
      console.log(err);
      res.redirect('/');
    }else{
      if(result !== null){
        req.session.loggedIn=true;
        req.session.loggedInUser=result;
        res.redirect('/');
      }else{
        res.render('login',{locals:locals});
      }
    }
  });
  
});
router.get('/logout',requiresLogin,function(req,res,next){
  delete req.session.loggedIn;
  delete req.session.loggedInUser;
  
  res.redirect('/')
});
router.get('/options',requiresLogin,isLoggedInUserEnabled,function(req,res,next){
  var locals={
    'title':'GiaCom Media Server (2019)&copy;&reg;',
    'page':'options',
    'loggedIn':req.session.loggedIn || null,
  }
  res.render('options',{locals:locals})
});
router.get('/profile',requiresLogin,isLoggedInUserEnabled,function(req,res,next){
  var locals={
    'title':'Profile GiaCom Media Server (2019)&copy;&reg;',
    'page':'profile',
    'loggedIn':req.session.loggedIn || null,
    'loggedInUser':req.session.loggedInUser
  }
  res.render('profile',{locals:locals});
});
router.post('/profile',requiresLogin,isLoggedInUserEnabled,function(req,res,next){
  var userModel=require('../models/users');
  
  var query=req.body;
  var id2Check=query['_id'];
  delete query['_id'];
  query['updatedAt']=new moment();
  console.log(query);
  userModel.findOneAndUpdate(id2Check,query,{save:true},function(err,loggedInUser){
    if(err){
      console.log('we have an Error');
      console.log(err);
      next(err);
    }else{
      req.session.actionLog={
        oldLog:loggedInUser,
        newLog:req.body,
        ref:id2Check,
        title:'Profile'
      }
      next();
    }
    
  });
  
},userActionLog,setLoggedInUserSession,isLoggedInUserEnabled,function(req,res,next){
  var locals={
    'title':'Update Profile - GiaCom Media Server (2019)&copy;&reg;',
    'page':'profile',
    'loggedIn':req.session.loggedIn || null,
    'loggedInUser':req.session.loggedInUser
  }
  // console.log(locals)
  res.render('profile',{locals:locals});
});
router.get('/logs',requiresLogin,isLoggedInUserEnabled,getUserActionLog,function(req,res,next){
  /*
    Here We collect the logs from the userlogs and is loggedInUser.uType is one of ['admin','sysAdmin','siteAdmin'] then we view all 
    else we only view logs for the currently logged in user
  */
  var locals={
    'title':'Update Profile - GiaCom Media Server (2019)&copy;&reg;',
    'page':'logs',
    'loggedIn':req.session.loggedIn || null,
    'loggedInUser':req.session.loggedInUser,
    'logs':req.session.actionLogs
  };
  res.render('accountlogs',{'locals':locals});
 
});
// router.get('/list_users',requiresLogin,isLoggedInUserEnabled,getAllUsers,function(req,res,next){
//   /*
//     Here We collect all Users and we list them based upon the logged in user session type 
//     if the user is any of sysadmin admin or siteadmin then he/she can view all users.
//   */
 
// });
router.get('/movies',isLoggedInUser,getMovieList, function(req,res,next){
  // const inspect=require('util').inspect;
  // inspect(res.locals,color=true,depth=4);
  console.log(res.locals);
  console.log(req.query);
  res.locals['title']='GiaCom Movies';
  res.locals['page']='Movies';
  res.locals['truncate']=text_truncate;
  res.locals['pad']=pad;
  res.render('movies',{locals:res.locals});
});
router.get('/watch',isLoggedInUser,function(req,res,next){
  res.locals['b64encode']=b64encode;
  res.locals['b64decode']=b64decode;
  next();
},getMovieAttribute,function(req,res,next){
  res.locals['title']='GiaCom Movies ('+res.locals.movie['title']+')';
  res.locals['page']='Watch';
  res.render('movie',{locals:res.locals});
})
router.get('/livetv',isLoggedInUser,getChannels,function(req,res,next){
  res.locals['title']='GiaCom Movies (LiveTV)';
  res.locals['page']='LiveTV';
  res.render('livetv',{locals:res.locals});
})
router.get('/AddChannel',requiresLogin,isLoggedInUserEnabled,setLoggedInUserSession,function(req,res,next){
  if (typeof(res.locals.loggedInUser == 'undefined')){
    res.locals.loggedInUser=req.session.loggedInUser;
  }
});
module.exports = router;
