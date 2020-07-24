var roles = {
	harvester: require('./roles.harvester'),
	upgrader: require('./roles.upgrader'),
	builder: require('./roles.builder'),
	repairer: require('./roles.repairer'),
	warrior: require('./roles.warrior')
};

module.exports = {
	loop: function () {
		for (var name in Memory.creeps) {
			if (Game.creeps[name] == undefined) {
				delete Memory.creeps[name];
			} else {
				var creep = Game.creeps[name];
				if (roles[creep.memory.role]) {
					roles[creep.memory.role].loop(creep);
				}
			}
		}
	},
	roles: roles
};
