const RoomParser = require('./room.parser');
const SpawnController = require('./room.controller.spawn');
const ConstructionController = require('./room.controller.construction');
const CreepController = require('./creep.controller');

function RoomController (room) {
	this.room = room;
	this.parser = new RoomParser(room);
	this.spawnController = new SpawnController(room);
	this.constructionController = new ConstructionController(room);
}

RoomController.prototype.loop = function () {
	this.parser.loop();
	this.constructionController.loop();
	this.spawnController.loop();
	for (var creepName in Game.creeps) {
		if (creepName.includes(this.room.name)) {
			const controller = new CreepController(Game.creeps[creepName]);
			controller.loop();
		}
	}
};

module.exports = RoomController;
