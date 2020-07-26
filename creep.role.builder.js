const states = require('./creep.states');

module.exports = {
	name: 'builder',
	initialState: states.draining.name,
	nextState: function (creep) {
		if (!creep.store.getUsedCapacity()) {
			states.draining.findTarget(creep);
			return states.draining;
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
