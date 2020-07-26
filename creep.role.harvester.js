const states = require('./creep.states');

module.exports = {
	name: 'harvester',
	initialState: states.harvesting.name,
	nextState: function (creep) {
		if (!creep.store.getUsedCapacity()) {
			return states.harvesting;
		}
		if ( states.transfering.findTarget(creep)) {
			return states.transfering;
		}
		if (states.repairing.findTarget(creep)) {
			return states.repairing;
		}
		if (states.building.findTarget(creep)) {
			return states.building;
		}
		return states.upgrading;
	}
};
