module.exports = function Route(app){
  	app.get('/', function(req, res){
    	res.render('index', {title:'Conversation Board'});
  	});

  	app.post('got_a_new_user', function(req) {
        console.log(req.data);
  		req.io.broadcast("new_user", {
            new_user_name: req.data.submitted_name,
            new_user_session_id: req.sessionID
        });
        all_users.push({
            user_name: req.data.submitted_name,
            user_session_id: req.sessionID
        });
        req.io.emit("existing_users", {
            users: all_users
        });
  	});
};