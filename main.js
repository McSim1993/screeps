const constants = require('./constants');
const RoomController = require('./room.controller');

module.exports.loop = function () {
	const room = new RoomController(Game.spawns['Base'].room);
	room.loop();
};
