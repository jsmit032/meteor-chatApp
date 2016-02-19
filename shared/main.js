Meteor.methods({
	//add new Chats or find current one
	addChat:function(){
		var chat, otherUserId, filter;
		// the user they want to chat to has id equal to 
		// the id sent in after /chat/... 
		//otherUserId = Router.current().route.path(this);
		// find a chat that has two users that match current user id
		// and the requested user id
		filter = {$or:[
			{user1Id:Meteor.userId(), user2Id:otherUserId}, 
			{user2Id:Meteor.userId(), user1Id:otherUserId}
		]};
		chat = Chats.findOne(filter); 
		if (!chat){ //no matching chat the filer - need to insert
			chatId = Chats.insert({user1Id:Meteor.userId(), user2Id:otherUserId});
		}
		else {
			chatId = chat._id;
		}
		if (chatId) {
			console.log("addChat method: got an id" + chatId);
		}
	}
})