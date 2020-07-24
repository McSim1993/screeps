function loop (room) {
	room.memory.towers.forEach((id) => {
		var tower = Game.getObjectById(id);
		if (tower) {
			var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
				filter: (structure) => structure.hits < structure.hitsMax
			});
			if (closestDamagedStructure) {
				tower.repair(closestDamagedStructure);
			}

			var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
			if (closestHostile) {
				tower.attack(closestHostile);
			}
		} else {
			delete room.memory.towers;
		}
	});
}

function findTowers (room) {
	return _.map(room.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER }}), (t) => t.id);
}

module.exports = {
	loop: function () {
		for (var roomName in Game.rooms) {
			var room = Game.rooms[roomName];
			if (!room.memory.towers || Game.time % 50 == 0) {
				room.memory.towers = findTowers(room);
			}

			loop(room);
		}
	}
};
