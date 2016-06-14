// This code starts JavaScript's equivalent of a "class" that takes a
// single argument, a Socket.io socket, when instantiated.
var Chat = function(socket) {
	this.socket = socket;
};

// Function to send messages
Chat.prototype.sendMessage = function(room, text) {
	var message = {
		room: room,
		text: text
	};
	this.socket.emit('message', message);
};

// Function to change rooms
Chat.prototype.changeRoom = function(room) {
	this.socket.emit('join', {
		newRoom: room
	});
};

// Function  for processing a chat command. Two chat commands are recognized: 
// "join" for joining/creation a room and "nick" for changing one's nickname.
Chat.prototype.processCommand  = function(command) {
	var words = command.split(' ');
	// Parse command from first word
	var command = words[0].substring(1, words[0].length).toLowerCase();
	var message = false;

	switch(command) {
		case 'join':
			words.shift();
			var room = words.join(' ');
			// Handle room changing/creation
			this.changeRoom(room);
			break;

		case 'nick':
			words.shift();
			var name = words.join(' ');
			// Handle name change attempts
			this.socket.emit('nameAttempt', name);
			break;

		default:
			// Return an error message if the command isn't recognized
			message = 'Unrecognized command.';
			break;
	}

	return message;
};