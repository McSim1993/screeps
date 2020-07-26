const states = require('./creep.states');

module.exports = {
	name: 'builder',
	initialState: states.draining.name,
	nextState: function (creep) {
		if (!creep.store.getUsedCapacity()) {
			if (states.draining.findTarget(creep)) {
				return states.draining;
			} else {
				return states.waiting;
			}
		}
		if (creep.room.controller.ticksToDowngrade < 300) {
			return states.upgrading;
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
