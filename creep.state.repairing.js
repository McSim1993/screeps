const name = 'repairing';

function findTarget (creep) {
	const structureToRepair = creep.pos.findClosestByPath(FIND_STRUCTURES, {
		filter: (structure) => {
			return (structure.hits / structure.hitsMax) < 0.8;
		}
	});
	if (structureToRepair) {
		creep.memory.structureToRepair = structureToRepair.id;
	}

	return structureToRepair;
}

module.exports = {
	name: name,
	loop: function (creep) {
		const structure = Game.getObjectById(creep.memory.structureToRepair);
		if (structure && creep.repair(structure) == ERR_NOT_IN_RANGE) {
			creep.moveTo(structure, { visualizePathStyle: { stroke: '#e2ba13' }});
		}

		if (!creep.store.getUsedCapacity(RESOURCE_ENERGY) || !structure || structure.hits / structure.hitsMax == 1) {
			delete creep.memory.structureToRepair;
			return CREEP_STATE_ENDS;
		} else {
			return CREEP_STATE_CONTINUES;
		}
	},
	enter: function (creep) {
		creep.memory.state = name;
		creep.say('🔨Repair');
	},
	findTarget: findTarget
};
