const mongoose = require('mongoose');
if (process.env.AUTH_ENABLED) {
    mongoose.connect('mongodb://127.0.0.1:27017/GiaCom',{
    // useNewUrlParser:true,
    // useUnifiedTopology: true,
    // useCreateIndex:true,
    // useFindAndModify:false,
    "auth": {
        "authSource": "admin"
      },
      "user": "psycho",
      "pass": "shta2telik"
    
});

}else{
    mongoose.connect('mongodb://127.0.0.1:27017/GiaCom',{
    // useNewUrlParser:true,
    // useUnifiedTopology: true,
    // useCreateIndex:true,
    // useFindAndModify:false,
    // "auth": {
    //     "authSource": "admin"
    //   },
    //   "user": "psycho",
    //   "pass": "shta2telik"
    
});
}
var db=mongoose.connection;
db.on('error',function(err){
    console.log(err)
})
db.once('open',function(){
    console.log('Mongoose Connection successful')
    var usersModel=require('./users');
    
    usersModel.users.findOne({'uType':'sysAdmin'},function(err,result){
        if(err){
            console.log(err)
        }else if (result == null){
            console.log('We Need To Create A New User')
            var newUser= new usersModel.users({
                uType: 'sysAdmin',
                uEnabled: true,
                uOnline: false,
                uName: 'Admin',
                uPass: 'NimdaPass',
                uFirstName: 'System',
                uLastName: 'Administrator',
                uInfo: 'Admin User Created By The System',
                uComment: 'Admin User Created By The system Upon Initialization',
                // uCreatedBy: 'system bootstrap'
            });
            newUser.uCreatedBy=newUser._id;
            newUser.save(function(err,succ){
                if(err){
                    console.log(err)
                    
                }else{
                    console.log(succ)
                    // newUser.update()
                    
                }
            })
        }
    })
});
exports.configs=require('./config');
exports.users= require('./users');
exports.channels=require('./channels');
exports.movies=require('./movies');
exports.series=require('./series');
exports.userlogs=require('./userlogs');



/**
 * ToDo: Should find a way to export all as a single Model.
 * half done above by exporting the required models.
 */