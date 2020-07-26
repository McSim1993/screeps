const name = 'upgrading';

module.exports = {
	name: name,
	loop: function (creep) {
		if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
			creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffaa00' }});
		}
	},
	checkEnds: function (creep) {
		if (!creep.store.getUsedCapacity(RESOURCE_ENERGY)) {
			return CREEP_STATE_ENDS;
		} else {
			return CREEP_STATE_CONTINUES;
		}
	},
	enter: function (creep) {
		creep.memory.state = name;
		creep.say('🔺Upgrade');
	}
};
