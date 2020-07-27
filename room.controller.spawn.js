const creepRoles = require('./creep.roles');
const creepTypes = require('./creep.types');

function SpawnController (room) {
	this.room = room;
	this.spawn = room.find(FIND_MY_SPAWNS)[0];
}

SpawnController.prototype.loop = function () {
	this.createHarversters();
	this.createBuilders();
	const nextSpawn = this.next();
	if (nextSpawn) {
		this.spawn.spawnCreep(nextSpawn.type.bodySet(this.room), nextSpawn.name, {memory: nextSpawn.memory});
	}
};

SpawnController.prototype.createHarversters = function () {
	const sources = this.room.memory.safeSources;
	sources.forEach((source, i) => {
		source.freeSpots.forEach((spot, j) => {
			const name = `${this.room.name}_${creepRoles.harvester.name}_${i}_${j}`;
			if (!Memory.creeps[name]) {
				Memory.creeps[name] = {
					role: creepRoles.harvester.name,
					state: creepRoles.harvester.initialState,
					source: source.id
				};
			}
		});
	});
};

SpawnController.prototype.createBuilders = function () {
	for (var i = 0; i < 2; i++) {
		const name = `${this.room.name}_${creepRoles.builder.name}_${i}`;
		if (!Memory.creeps[name]) {
			Memory.creeps[name] = {
				role: creepRoles.builder.name,
				state: creepRoles.builder.initialState
			};
		}
	}
};

SpawnController.prototype.next = function () {
	for (var name in Memory.creeps) {
		if (name.startsWith(this.room.name) && !Game.creeps[name]) {
			return {
				type: creepTypes.worker,
				name: name,
				memory: Memory.creeps[name]
			};
		}
	}
};

module.exports = SpawnController;
