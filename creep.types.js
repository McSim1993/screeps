function CreepType (name, bodySet) {
	this.name = name;
	this.bodySet = bodySet;
}

module.exports = {
	worker: new CreepType('worker', function (room) {
		var emergensy = !Object.keys(Game.creeps).find((name) => name.startsWith(`${room.name}_harvester`));
		if (emergensy) {
			return [WORK, MOVE, MOVE, CARRY, CARRY];
		} else {
			const capacity = room.energyCapacityAvailable;
			var result = [];
			var cost = 0;
			for (var i = 0; i < Math.floor(capacity / 250); i++) {
				if (i % 2 == 0) {
					result = result.concat([WORK, MOVE, MOVE, CARRY]);
				} else {
					result = result.concat([WORK, MOVE, CARRY, CARRY]);
				}
				cost += 250;
			}
			for (var i = 0; i < Math.floor((capacity - cost) / 100); i++) {
				result = result.concat([MOVE, CARRY]);
				cost += 100;
			}
			for (var i = 0; i < Math.floor((capacity - cost) / 50); i++) {
				result.push(CARRY);
			}
			return result;
		}
	})
};
