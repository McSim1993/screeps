const RoomParser = require('./room.parser');
const SpawnController = require('./room.controller.spawn');
const CreepController = require('./creep.controller');

function RoomController (room) {
	this.room = room;
	this.parser = new RoomParser(room);
	this.spawnController = new SpawnController(room);
}

RoomController.prototype.loop = function () {
	this.parser.loop();
	this.spawnController.loop();
	for (var creepName in Game.creeps) {
		if (creepName.includes(this.room.name)) {
			const controller = new CreepController(Game.creeps[creepName]);
			controller.loop();
		}
	}
};

module.exports = RoomController;
