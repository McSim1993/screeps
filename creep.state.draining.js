const name = 'draining';

function findTarget (creep) {
	function structureWithEnergy (structureType, limit) {
		return creep.pos.findClosestByPath(FIND_STRUCTURES, {
			filter: (structure) => {
				return (structure.structureType == structureType) &&
				structure.store.energy >= limit;
			}
		});
	}
	var target;

	if (!target) {
		target = creep.pos.findClosestByPath(FIND_RUINS, {
			filter: (ruin) => ruin.store.energy > 0
		});
	}

	if (!target) {
		target = structureWithEnergy(STRUCTURE_CONTAINER, 0);
	}

	if (!target) {
		target = structureWithEnergy(STRUCTURE_SPAWN, 50);
	}

	if (!target) {
		target = structureWithEnergy(STRUCTURE_EXTENSION, 50);
	}

	if (target) {
		creep.memory.drainTarget = target.id;
	}

	return target;
}

module.exports = {
	name: name,
	loop: function (creep) {
		const target = Game.getObjectById(creep.memory.drainTarget);
		if (target && creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
			creep.moveTo(target, { visualizePathStyle: { stroke: '#1380cf' }});
		}
	},
	checkEnds: function (creep) {
		const target = Game.getObjectById(creep.memory.drainTarget);
		if (!creep.store.getFreeCapacity(RESOURCE_ENERGY) ||
			!target ||
			!target.store.getUsedCapacity(RESOURCE_ENERGY) ||
			target.store.getUsedCapacity(RESOURCE_ENERGY) == 1) {
			delete creep.memory.drainTarget;
			return CREEP_STATE_ENDS;
		} else {
			return CREEP_STATE_CONTINUES;
		}
	},
	enter: function (creep) {
		if (creep.memory.state != name) {
			creep.say('🧪Drain');
		}
		creep.memory.state = name;
	},
	findTarget: findTarget
};
