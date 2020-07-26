const name = 'waiting';

module.exports = {
	name: name,
	loop: function (creep) {},
	checkEnds: function (creep) {
		return CREEP_STATE_ENDS;
	},
	enter: function (creep) {
		if (creep.memory.state != name) {
			creep.say('🕒Wait');
		}
		creep.memory.state = name;
	}
};
