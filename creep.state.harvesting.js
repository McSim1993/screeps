const name = 'harvesting';

module.exports = {
	name: name,
	loop: function (creep) {
		const source = Game.getObjectById(creep.memory.source);
		if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
			creep.moveTo(source, { visualizePathStyle: { stroke: '#68e213' }});
		}
	},
	checkEnds: function (creep) {
		const source = Game.getObjectById(creep.memory.source);
		if (!creep.store.getFreeCapacity(RESOURCE_ENERGY)) {
			return CREEP_STATE_ENDS;
		} else {
			return CREEP_STATE_CONTINUES;
		}
	},
	enter: function (creep) {
		creep.memory.state = name;
		creep.say('🌾Harvest');
	}
};
