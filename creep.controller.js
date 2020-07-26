const roles = require('./creep.roles');
const states = require('./creep.states');

function CreepController (creep) {
	this.creep = creep;
	this.role = roles[creep.memory.role];
	this.state = states[creep.memory.state];
}

CreepController.prototype.loop = function () {
	const stateResult = this.state.loop(this.creep);
	if (stateResult == CREEP_STATE_ENDS) {
		const nextState = this.role.nextState(this.creep);
		nextState.enter(this.creep);
	}
};

module.exports = CreepController;
