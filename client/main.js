// subscribe
Meteor.subscribe("chats");
Meteor.subscribe("users");

// set up the main template the the router will use to build pages
Router.configure({
	layoutTemplate: 'ApplicationLayout'
});

// specify the top level route, the page users see when they arrive at the site
Router.route('/', function () {
	console.log("rendering root /");
	this.render("navbar", {to:"header"});
	this.render("lobby_page", {to:"main"});  
});

// specify a route that allows the current user to chat to another users
Router.route('/chat/:_id', function () {
	// the user they want to chat to has id equal to 
	// the id sent in after /chat/... 
	var otherUserId = this.params._id;
	Meteor.call("addChat", otherUserId);

	Meteor.call('getChatId', Meteor.userId(), otherUserId, function(error, result) {
	 	if (error) {
	 		console.log(error);
	 	}
		else {
	  	console.log(result);
		}
	});
	
	this.render("navbar", {to:"header"});
	this.render("chat_page", {to:"main"});  
});

///
// helper functions 
/// 
Template.available_user_list.helpers({
	users:function(){
	  var user = Meteor.users.find();
	  return user;
	}
}),

Template.available_user.helpers({
	getUsername:function(userId){
	  user = Meteor.users.findOne({_id:userId});
	  return user.profile.username;
	}, 
	isMyUser:function(userId){
	  if (userId == Meteor.userId()){
	    return true;
	  }
	  else {
	    return false;
	  }
	}
}),


Template.chat_page.helpers({
	messages:function(){
		if (!chat) {return} //give up
		else {
	  	var chat = Chats.findOne({_id:Session.get("chatId")});
	  	return chat.messages;
		}
	}, 
	other_user:function(){
	  return ""
	},
}),

Template.chat_message.helpers({
	user1:function(){
	  chat = Chats.findOne({_id:Session.get("chatId")});
	  return chat.user1Id;
	},
	user2:function(){
	  chat = Chats.findOne({_id:Session.get("chatId")});
	  return chat.user2Id;
	},
	isMyUser:function(userId){
	  if (userId == Meteor.userId()){
	    return true;
	  }
	  else {
	    return false;
	  }
	}
})

/////////
// EVENTS
/////////

Template.chat_page.events({
	// this event fires when the user sends a message on the chat page
	'submit .js-send-chat':function(event){
		// stop the form from triggering a page reload
		event.preventDefault();
		// see if we can find a chat object in the database
		// to which we'll add the message
		var chat = Chats.findOne({_id:Session.get("chatId")});
		console.log(chat);
		if (chat){// ok - we have a chat to use
		  var msgs = chat.messages; // pull the messages property
		  var userId = Meteor.userId();
		  console.log(userId);
		  if (!msgs){// no messages yet, create a new array
		    msgs = [];
		  }
		  // is a good idea to insert data straight from the form
		  // (i.e. the user) into the database?? certainly not. 
		  // push adds the message to the end of the array
		  msgs.push({text: event.target.chat.value, owner: Meteor.users.findOne({_id: userId})});
		  console.log(msgs);
		  // reset the form
		  event.target.chat.value = "";
		  // put the messages array onto the chat object
		  chat.messages = msgs;
		  // update the chat object in the database.
		  Chats.update(chat._id, chat);
		}
	}
})

////////
// CLIENT METHODS
/////////



/////// END ///////////////