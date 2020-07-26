const name = 'transfering';

function findTarget (creep) {
	var target;

	if (!target) {
		target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
			filter: (structure) => {
				return (structure.structureType == STRUCTURE_EXTENSION) &&
				structure.energy < structure.energyCapacity;
			}
		});
	}

	if (!target) {
		target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
			filter: (structure) => {
				return (structure.structureType == STRUCTURE_SPAWN) &&
				structure.energy < structure.energyCapacity;
			}
		});
	}

	if (!target) {
		target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
			filter: (structure) => {
				return (structure.structureType == STRUCTURE_TOWER) &&
				structure.energy < structure.energyCapacity;
			}
		});
	}

	if (!target) {
		target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
			filter: (structure) => {
				return (structure.structureType == STRUCTURE_CONTAINER) &&
				structure.store.energy < structure.storeCapacity;
			}
		});
	}
	if (target) {
		creep.memory.transferTarget = target.id;
	}

	return target;
}

module.exports = {
	name: name,
	loop: function (creep) {
		const target = Game.getObjectById(creep.memory.transferTarget);
		if (target && creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
			creep.moveTo(target, { visualizePathStyle: { stroke: '#1380cf' }});
		}
	},
	checkEnds: function (creep) {
		const target = Game.getObjectById(creep.memory.transferTarget);
		if (!creep.store.getUsedCapacity(RESOURCE_ENERGY) || !target || !target.store.getFreeCapacity(RESOURCE_ENERGY)) {
			delete creep.memory.transferTarget;
			return CREEP_STATE_ENDS;
		} else {
			return CREEP_STATE_CONTINUES;
		}
	},
	enter: function (creep) {
		creep.memory.state = name;
		creep.say('🔄Transfer');
	},
	findTarget: findTarget
};
