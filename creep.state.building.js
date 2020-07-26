const name = 'building';

function findTarget (creep) {
	const constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
	if (constructionSite) {
		creep.memory.constructionSite = constructionSite.id;
	}
	return constructionSite;
}

module.exports = {
	name: name,
	loop: function (creep) {
		const constructionSite = Game.getObjectById(creep.memory.constructionSite);
		if (constructionSite && creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
			creep.moveTo(constructionSite, { visualizePathStyle: { stroke: '#d716e8' }});
		}
		if (!creep.store.getUsedCapacity(RESOURCE_ENERGY) || !constructionSite) {
			delete creep.memory.constructionSite;
			return CREEP_STATE_ENDS;
		} else {
			return CREEP_STATE_CONTINUES;
		}
	},
	enter: function (creep) {
		creep.memory.state = name;
		creep.say('👷Build');
	},
	findTarget: findTarget
};
