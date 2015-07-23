var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Promise = require("es6-promise").Promise;
var _ = require("underscore");
var moment = require("moment/moment");
var co = require("co");

var userSchema = new Schema({
    name: String,
    score: Number,
    time: String
});

var User = mongoose.model('User', userSchema);

mongoose.connect('mongodb://localhost/games');

exports.rankHandle = function *(next){
    var req = this.request.body || {};
    var _user = new User({
        name: req.name || "",
        score: req.score || 0,
        time: moment().format('l')
    });
    var ctx = this,
        user, users;
    yield _user.save(function(err, u){
        if(err){
            console.log(err);
        }
        user = u;
        console.log('save user id: ' + u.id);
    });

    yield next;

    ctx.redirect('/list/' + user.id);

    // yield User.find({}, function(err, us){
    //     if(err){
    //         console.log(err);
    //     }
    //     users = us;
    //     console.log('find users, length: ' + us.length);
    // });

    // var val = 0;
    // users = _.sortBy(users, function(u){  // sort by desc
    //     return 0 - u.score;
    // });
    // _.find(users, function(u, i){  //calculate rank
    //     val = i + 1;
    //     return user.score >= u.score;
    // });
    // users = _.each(users, function(u, i){
    //     users[i].rank = i + 1;
    //     if(i > 0 && users[i].score === users[i-1].score){
    //         users[i].rank = users[i-1].rank;
    //     }
    // });
    // ctx.render("rank", {users: users.length > 10 ? users.splice(0, 10) : users, rank: val}, true);
    // ctx.set('Cache-Control', 'no-cache');


    /*yield new Promise(function(resolve){
        user.save(function(err, u){
            if(err){
                console.log(err);
            }
            User.find({}, function(err, us){
                resolve(us);
            });
        });
    }).then(function(users){
        var val = 0;
        users = _.sortBy(users, function(u){  // sort by desc
            return 0 - u.score;
        });
        _.find(users, function(u, i){  //calculate rank
            val = i + 1;
            return user.score >= u.score;
        });
        users = _.each(users, function(u, i){
            users[i].rank = i + 1;
            if(i > 0 && users[i].score === users[i-1].score){
                users[i].rank = users[i-1].rank;
            }
        });
        ctx.render("rank", {users: users.length > 10 ? users.splice(0, 10) : users, rank: val}, true);
        ctx.set('Cache-Control', 'no-cache');
    });*/
    
    // var saveFn = co.wrap(function *(userModel){
    //     return yield new Promise(function(resolve, reject){
    //         userModel.save(function(err, u){
    //             if(err){
    //                 console.log(err);
    //                 reject(err);
    //             }
    //             console.log('resolve');
    //             resolve(u);
    //         });
    //     });
    // });

    //ctx.redirect("/list/" + '123');
    // var a,
    //     users = [],
    //     val = 10;
    // yield user.save(function(err, u){
    //     a = u;
    //     console.log('yield');
    // });
    // console.log('a');
    // ctx.render("rank", {users: users.length > 10 ? users.splice(0, 10) : users, rank: val}, true);

    /*saveFn(user).then(function(u){
        console.log('u.id: ' + u.id)
        //ctx.response.redirect("/list/" + u.id);
        var users = [];
        var val = 10;
        ctx.body = 'abc';
        ctx.render("rank", {users: users.length > 10 ? users.splice(0, 10) : users, rank: val}, true);
    });*/

    // saveFn(user).then(function(u){
    //     ctx.redirect("http://baidu.com");
    // });

    // user.save(function(err, u){
    //     if(err){
    //         console.log(err);
    //     }
    //     //ctx.redirect('/list/' + u._id);
    //     ctx.redirect('http://baidu.com');
    // });
};

exports.listHandle = function *(next){
    console.log("list here" + this.params.id);
    var id = this.params.id,
        val = 0,
        ctx = this,
        users, user;
    
    user = yield User.findOne({_id: id}, function(err, u){
        if(err){
            console.log(err);
        }else{
            console.log(u);
            console.log('find user, id: ' + u.id);
            return u;
        }
        return null;
    });

    yield User.find({}, function(err, us){
        if(err){
            console.log(err);
        }
        users = us;
        console.log('find users, length: ' + us.length);
    });

    var val = 0;
    users = _.sortBy(users, function(u){  // sort by desc
        return 0 - u.score;
    });
    _.find(users, function(u, i){  //calculate rank
        val = i + 1;
        return user.score >= u.score;
    });
    users = _.each(users, function(u, i){
        users[i].rank = i + 1;
        if(i > 0 && users[i].score === users[i-1].score){
            users[i].rank = users[i-1].rank;
        }
    });
    ctx.render("rank", {users: users.length > 10 ? users.splice(0, 10) : users, rank: val}, true);
    ctx.set('Cache-Control', 'no-cache');


    // this.body = 'hello world';
    // yield new Promise(function(resolve, reject){
    //     User.find({}, function(err, users){
    //        if(err) {
    //         console.log(err);
    //         reject(err);
    //        }
    //         return resolve(users);
    //    });
    // }).then(function(users){
    //     User.findOne({_id: id}, function(err, user){
    //         if(err){
    //             console.log(err);
    //         }
    //         users = _.sortBy(users, function(u){  // sort by desc
    //             return 0 - u.score;
    //         });
    //         _.find(users, function(u, i){  //calculate rank
    //             val = i + 1;
    //             return user.score >= u.score;
    //         });
    //         users = _.each(users, function(u, i){
    //             users[i].rank = i + 1;
    //             if(i > 0 && users[i].score === users[i-1].score){
    //                 users[i].rank = users[i-1].rank;
    //             }
    //         });
    //         console.log(user);
    //         console.log(val);
    //         return ctx.render("rank", {users: users.length > 10 ? users.splice(0, 10) : users, rank: val}, true);
    //     });
    // });
};