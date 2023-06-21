var express = require('express');
var lo = require('lodash')
var moment=require('moment')
var router = express.Router();
var { 
      getChannelAttribute,
      requiresLogin,
      isLoggedInUserEnabled,
      setLoggedInUserSession,
      userActionLog,
      getUserActionLog,
      isLoggedInUser,
      getMovieList,
      getMovieAttribute,
      getChannels,
      addHelpers,
      getSeriesList,
      addSeries,
      getSeries,
      getUsers,
      getUser,
      getParams,
      getConfig,
      saveConfig,
      updateConfig,
      deleteConfig,
      logInUser,
      
   } =require('./middlewares') ;
var {text_truncate,pad,b64decode,b64encode,isIn,filesInFolder,padStart}= require('./helpers');
// var {diff} = require('deep-object-diff') 

/*  GET home page. */
router.get('/',isLoggedInUser,getMovieList, function(req,res,next){
  // const inspect=require('util').inspect;
  // inspect(res.locals,color=true,depth=4);
  //console.log(res.locals);
  // console.log(req.query);
  res.locals['title']='GiaCom Movies';
  res.locals['page']='Movies';
  res.locals['truncate']=text_truncate;
  res.locals['pad']=pad;
  console.log(res.locals)
  res.render('movies',{locals:res.locals});
});

/*
 Get Login Page
*/
router.get('/login',logInUser,function(req,res,next){
  var locals={
    'title':'GiaCom Media Server (2019)&copy;&reg;',
    'page':'login'
  }
  res.render('login',{locals:locals});
})
router.post('/login',function(req,res,next){
  
  if (req.session.hasOwnProperty('loggedInUser') && req.session.loggedInUser == true){
    res.redirect('/');
  }else if(res.locals.page == 'login') {
    res.render('login',{locals:res.locals});
  }else{
    res.redirect('/');
  }
});
router.get('/logout',requiresLogin,function(req,res,next){
  delete req.session.loggedIn;
  delete req.session.loggedInUser;
  
  res.redirect('/')
});
router.get('/options',addHelpers,requiresLogin,isLoggedInUserEnabled,isLoggedInUser,function(req,res,next){
  res.locals['title']='GiaCom Media Server (2019)&copy;&reg;'
  res.locals['page']='options';
  res.locals['loggedIn']=req.session.loggedIn || null;
  

  // console.log(res.locals)
  res.render('options',{locals:res.locals})
});
router.get('/profile',addHelpers,requiresLogin,isLoggedInUserEnabled,function(req,res,next){
  res.locals['title']='Profile GiaCom Media Server (2019)&copy;&reg;';
  res.locals['page']='profile';
  res.locals['loggedIn']=req.session.loggedIn || null;
  res.locals['loggedInUser']=req.session.loggedInUser;
  
  // console.log("The Res Locals \n",locals,"\n<------")
  res.render('profile',{locals:res.locals});
});
router.post('/profile',addHelpers,requiresLogin,isLoggedInUserEnabled,function(req,res,next){
  var userModel=require('../models/users');
  
  var query=req.body;
 
  var id2Check=query['_id'];
  delete query['_id'];
  query['updatedAt']=new moment();
  console.log("The Query :\n",query,"\nWith ID ",id2Check,"\n<----");
  userModel.findOneAndUpdate({'_id':id2Check},query,{save:true,upsert:true},function(err,loggedInUser){
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

router.get('/newUser',addHelpers,requiresLogin,isLoggedInUser,isLoggedInUserEnabled,function(req,res,next){
  /**
   * Add New User:
   * This Opens The page to add New user To the System. Nothing More.
   * Actually we shall copy the profile page and change to newUser Convinience.
   * One thing to note that only Users of type [Admin,SysAdmin,SiteAdmin] may be able to create a new User
   */
  
  /**
   * Since we are creating a new User then: 
   * Admin User (ParentUser)= loggedInUser
   */
  res.locals.creatingNewUser=true;
  console.log(res.locals);
  res.render('newUser',{locals:res.locals});
});
router.post('/newUser',requiresLogin,isLoggedInUser,isLoggedInUserEnabled,function(req,res,next){
/**
 * Adding New User Params,
 * All Info should be in the req.body 
 */
  let query = req.body;
  query.uCreatedBy=res.locals.loggedInUser._id
  let user = require('../models/users');
  user.findOne({'uName':query['uName']},function(err,result){
    if (err !== null ){
      res.render("err",err);
    }else if (result == null ){
      /**
       * if result is null then there is no user found with that ID.
       * thus we shall insert the user in the database 
       */
      user.create(query,function(err,result){
        if (err !== null){
          res.render("err",err);
        }else{
          res.redirect('/listUsers');
        }
      })
    }
  });
});

router.post('/addChannel',addHelpers,requiresLogin,isLoggedInUser,isLoggedInUserEnabled,function(req,res,next){
  var channelModel=require('../models/channels');
  var query=req.body;
  if (lo.has(query,'enabled')){
    query['enabled']=true;
  }else{
    query['enabled']=false;
  }
  query.uCreatedBy=req.session.loggedInUser._id;
  req.session.actionLog={
      ref:req.session.loggedInUser._id,
      title:'Channel'
  }
  try {
    var newChannel =new channelModel(
      query
    )
    newChannel.save(function(err,succ){
      if(err){
        next(err);
      }else{
        req.session.actionLog['oldLog']={},
        req.session.actionLog['newLog']=succ;
	next();
      }
    });
  } catch (error) {
    next(error);
  }
  
},userActionLog,function(req,res,next){
  res.redirect('/livetv');
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
  //console.log(res.locals);
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
  var userAgent=req.headers['user-agent'];
  var patt=/GStreamer|QtEmbedded|tv|smart|falkon|lav|playstation/gi;
  if (userAgent.match(patt) !== null){
    res.locals['twirk']=true;
  }else{
    res.locals['twirk']=false;
  }
  next();
},getMovieAttribute,function(req,res,next){
  res.locals['title']='GiaCom Movies ('+res.locals.movie['title']+')';
  res.locals['page']='Watch';
  res.render('movie',{locals:res.locals});
});
router.get('/watchTv',addHelpers,isLoggedInUser,function(req,res,next){
  // res.locals['b64encode']=b64encode;
  // res.locals['b64decode']=b64decode;
  var userAgent=req.headers['user-agent'];
  var patt=/GStreamer|QtEmbedded|tv|smart|falkon|lav/gi;
  if (userAgent.match(patt) !== null){
    res.locals['twirk']=true;
  }else{
    res.locals['twirk']=false;
  }
  next();
},getChannelAttribute,function(req,res,next){
  // console.log(res.locals);
  res.render('channel',{locals:res.locals});
});
/**
render Live TV CHannels Page 
*/
router.get('/livetv',addHelpers,isLoggedInUser,getChannels,function(req,res,next){
  res.locals['title']='GiaCom Movies (LiveTV)';
  res.locals['page']='LiveTV';
  res.locals['list_channels']=true;
  // console.log(res.locals)
  res.render('livetv',{locals:res.locals});
});

/**
Get Edit TV Channels
*/
router.get('/EditChannel',addHelpers,requiresLogin,isLoggedInUser,isLoggedInUserEnabled,getChannelAttribute,function(req,res,next){
  /**
   * EditChannel Enables Editing Channel corresponds to logged in user with admin rights.
   */
  console.log(res.locals);
  res.locals.edit_channel=true;
  res.render('editChannel',{locals:res.locals});
  // res.redirect('/livetv');
});
/**
Post Edit Channel Data
*/
router.post('/EditChannel',addHelpers,requiresLogin,isLoggedInUser,isLoggedInUserEnabled,function(req,res,next){
  var channelModel=require('../models/channels');
  var query=req.body;
  //console.log(query);
  if(lo.has(query,'enabled')) {
    query['enabled']=true;
  }else{
    query['enabled']=false;
  }
  query.updatedAt = new moment();
  var id2check=query['_id'];
  delete query['_id'];
  req.session.actionLog={
        ref:req.session.loggedInUser._id,
        title:'Channel '+id2check
  }
  /*
    oldLog
    newLog
  */
 try {
  channelModel.findById(id2check,function(err,doc1){
    if(err){
      next(err)
    }else{
      req.session.actionLog['oldLog']=doc1;
      channelModel.findByIdAndUpdate(id2check,query,function(err,doc){
        if(err){
          console.log(err)
          next(err);
        }else{
          req.session.actionLog['newLog']=query;
          next();
        }
      })
    }
  }); 
 } catch (error) {
   console.log(error)
   next(error);
 }
  
  },userActionLog,function(req,res,next){
    res.redirect('/livetv');
  });
  /*
  if (lo.has(query,'enabled')){
    query['enabled']=true;
  }else{
    query['enabled']=false;
  }
  query.uCreatedBy=req.session.loggedInUser._id;
  try {
    var newChannel =new channelModel(
      query
    )
    newChannel.save(function(err,succ){
      if(err){
        console.log(err)
      }else{
        console.log(succ)
      }
    });
  } catch (error) {
    console.log(error);
  }
  console.log(query);
  */

  

router.get('/AddChannel',addHelpers, requiresLogin,isLoggedInUser,isLoggedInUserEnabled,setLoggedInUserSession,function(req,res,next){
  if (typeof(res.locals.loggedInUser == 'undefined')){
    res.locals.loggedInUser=req.session.loggedInUser;
  }
  res.locals.new_channel=true;
  res.render('addChannel',{locals:res.locals});
});
router.get('/listUsers',addHelpers,requiresLogin,isLoggedInUser,isLoggedInUserEnabled,getUsers,function(req,res,next){
  /**
   * While Listing Users only uType =['siteAdmin'||'sysAdmin'] may manipulate the users, 
   * Users of type admin may only manipulate channels, movies,  or series 
   */
  if (['siteAdmin','sysAdmin'].indexOf(req.session.loggedInUser.uType) != -1 ){
    res.locals.page='listUsers';
    res.locals.title='Listing Users';
    // console.log("Listing Users \n",res.locals,"\n<--------------");
    res.render('listUsers',{locals:res.locals});
  }else{
    res.render('unAuthorizedPermission',{locals:res.locals});
  }
})
router.get("/editUser",addHelpers,requiresLogin,isLoggedInUser,isLoggedInUserEnabled,getUser,function(req,res,next){
  res.locals.editingUser=true;
  console.log("Editing User \n-----------------\n",res.locals,"\n-----------------\n")
  res.render("profile",{locals:res.locals})
})

/**
 * Series Definition Routes 
 * 
Defining Series:
A Series:
  - Title
  - Description
  - Genre
  - Seasons []Season
  - Poster

A Season:
  - Number
  - Episodes []Episode
  - Description
  - Title 

An Episode:
  - Number
  - Title
  - Description
  - File


*/
router.get('/series',addHelpers,isLoggedInUser,getParams, getSeriesList ,function(req,res,next){
  /**
    Get The Series
    1- Check if logged in user sets
    2- Check if we have a get Query id   
    2-1 return the Serie of certain id 
    2-2 Get the Series List from the mongodb Database
    3-3 Check if header accepts is application/json
  */
//  console.log(req.headers)
 if (req.headers['accept'] == 'application/json'){
  console.log('Sending JSON ')
  res.json({series:res.locals.serie})
 }else{
  res.locals.page="Series";
  res.locals.title="GiaCom Series";
  res.render('series',{locals:res.locals})
 }
  
});
/**
define path to get page new series

*/
router.get('/newSeries',addHelpers, requiresLogin,isLoggedInUser,isLoggedInUserEnabled,setLoggedInUserSession,function(req,res,next){
  res.locals.query={
    type:'path'
  }
  next()
},getConfig,function(req,res,next){
  res.locals.page="Series";
  res.locals.title="GiaCom Series (New Series)";
  res.locals.newSeries=true
  res.render('newSeries',{locals:res.locals});
});

router.post('/newSerie',addHelpers,requiresLogin,isLoggedInUser,isLoggedInUserEnabled,setLoggedInUserSession, addSeries,function(req,res,next){
  console.log(req.body);
  res.locals.page="Series";
  res.locals.title="GiaCom Series (New Series Added)";
  res.locals.newSeries=false;
  res.json({locals:res.locals});
})
router.get('/editSerie',addHelpers,requiresLogin,isLoggedInUser,isLoggedInUserEnabled,getParams,getSeries,function(req,res,next){
  res.locals.query={
    type:'path'
  }
  next()
},getConfig,function(req,res,next){

  console.log('ROUTES->editSerie : ',JSON.stringify(res.locals,undefined,2))
  res.render('editSeries',{locals:res.locals});
})

router.get('/files',addHelpers,requiresLogin,isLoggedInUser,isLoggedInUserEnabled,function(req,res,next){
  var folderName;
  var include;
  var exclude;
  var filter;
  
  if ('folder' in req.query){
    folderName=req.query.folder;
  }
  if ('include' in req.query) {
    include =req.query.include;
  }
  if ('exclude' in req.query){
    exclude = req.query.exclude;
  }
  if('filter' in req.query){
    filter=req.body.filter
  }
  
  // console.log(filesInFolder)
  res.json( filesInFolder(folderName,include,exclude,filter))
})
router.get('/pathConfigs/filter/:type',addHelpers,requiresLogin,isLoggedInUser,isLoggedInUserEnabled,getParams,getConfig,function(req,res,next){
  res.locals.page="pathConfigs";
  res.locals.title="GiaCom System Paths Configuration";
  res.render('pathConfigs',{locals:res.locals});
})
router.get('/pathConfigs',addHelpers,requiresLogin,isLoggedInUser,isLoggedInUserEnabled,getParams,getConfig,function(req,res,next){
  /**
   * Getting Page of Configs 
   * /-----------------------\
   * | Cfg Name || Value     |
   * |----------||-----------|
   * |SeriePath || /movies/..|
   * \----------||-----------/
   * 
   */
  res.locals.page="pathConfigs"
  res.locals.title="GiaCom System Paths Configuration"
 
  res.render('pathConfigs',{locals:res.locals});
})
router.post('/getConfig',getParams,getConfig,function(req,res,next){
  // console.log("POST->getData: ",JSON.stringify(res.locals,undefined,2))
  res.json({config:res.locals.config});
})
router.post('/newConfig',addHelpers,requiresLogin,isLoggedInUser,isLoggedInUserEnabled,getParams,saveConfig,function(req,res,next){
  res.redirect('/pathConfigs')
});
router.post('/updateConfig',addHelpers,requiresLogin,isLoggedInUser,isLoggedInUserEnabled,getParams,updateConfig,function(req,res,next){
  res.json(res.locals.updateConfig)
})
router.post('/deleteConfig',addHelpers,requiresLogin,isLoggedInUser,isLoggedInUserEnabled,getParams,deleteConfig,function(req,res,next){
  res.json(res.locals.deleteConfig)
})
module.exports = router;
