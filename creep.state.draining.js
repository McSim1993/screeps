const name = 'draining';

function findTarget (creep) {
	function structureWithEnergy (structureType) {
		return creep.pos.findClosestByPath(FIND_STRUCTURES, {
			filter: (structure) => {
				return (structure.structureType == structureType) &&
				structure.store.energy > 50;
			}
		});
	}
	var target;

	if (!target) {
		target = structureWithEnergy(STRUCTURE_CONTAINER);
	}

	if (!target) {
		target = structureWithEnergy(STRUCTURE_SPAWN);
	}

	if (!target) {
		target = structureWithEnergy(STRUCTURE_EXTENSION);
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
		if (!creep.store.getFreeCapacity(RESOURCE_ENERGY) || !target || !target.store.getUsedCapacity(RESOURCE_ENERGY)) {
			delete creep.memory.drainTarget;
			return CREEP_STATE_ENDS;
		} else {
			return CREEP_STATE_CONTINUES;
		}
	},
	enter: function (creep) {
		creep.memory.state = name;
		creep.say('🧪Drain');
	},
	findTarget: findTarget
};
