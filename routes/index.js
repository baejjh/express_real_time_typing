module.exports = function Route(app){
    var user_history = [];
    app.get('/', function(req, res){
        res.render('index', {title: 'Conversation Board'});
    });
    //when document loads, you load existing user
    app.io.route('ready', function(req){
        req.io.emit('existing_users', {
            users: user_history
        });
    });
    app.io.route('got_a_new_user', function(req){
        console.log(req.data.room);
        req.io.join(req.data.room);
        req.io.room(req.data.room).broadcast('announce', {
            message: 'New user has entered the conversation: ' + req.data
        });
        console.log(req.data.name);
        //new user in user_history
        user_history.push({
            name: req.data.name,
            sessionID: req.sessionID
        });
        console.log(user_history);
        req.io.emit('new_user', {
            new_user_name: req.data.name,
            sessionID: req.sessionID
        });
        req.io.broadcast('new_user', {
            new_user_name: req.data.name,
            sessionID: req.sessionID
        });
    });

    app.io.route('updated_text', function(req){
        req.io.broadcast('new_user_message', {
            text: req.data.text,
            sessionID: req.sessionID
        });
    });

    app.io.route("disconnect", function(req){
    for(var index in user_history)
    {
      if(user_history[index].sessionID == req.sessionID)
        delete user_history[index];
    };
​
    req.io.broadcast("disconnected_user", {
            sessionID: req.sessionID
        });
    });
};// end method Route