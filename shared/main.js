Meteor.methods({
	//add new Chats or find current one
	addChat:function(otherUser){
		var chat, filter;
		// the user they want to chat to has id equal to 
		// the id sent in after /chat/... 
		// pass in the parameter to get the other user's id
		// find a chat that has two users that match current user id
		// and the requested user id
		filter = {$or:[
			{user1Id:Meteor.userId(), user2Id:otherUser}, 
			{user2Id:Meteor.userId(), user1Id:otherUser}
		]};
		chat = Chats.findOne(filter); 
		if (!chat){ //no matching chat the filer - need to insert
			chatId = Chats.insert({user1Id:Meteor.userId(), user2Id:otherUser});
		}
		else {
			chatId = chat._id;
			console.log("addChat method: got an id " + chatId);
			return chatId;
		}
	},

 	addNewMessage: function(chat){
 		console.log("updating DB! ");
 		console.log(chat);
 		Chats.update(chat._id, chat);
 	},

})