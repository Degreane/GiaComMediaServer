var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/GiaCom',{useNewUrlParser:true,useUnifiedTopology: true,useCreateIndex:true});
var db=mongoose.connection;
db.on('error',function(err){
    console.log(err)
})
db.once('open',function(){
    console.log('Mongoose Connection successful')
    var usersModel=require('./users')
    usersModel.findOne({'uType':'sysAdmin'},function(err,result){
        if(err){
            console.log(err)
        }else if (result == null){
            console.log('We Need To Create A New User')
            var newUser= new usersModel({
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
})
