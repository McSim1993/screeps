function RoomParser (room) {
	this.room = room;
}

RoomParser.prototype.loop = function () {
	this.findKeeperLairs();
	this.findEnergySources();
};

RoomParser.prototype.findKeeperLairs = function () {
	this.room.memory.lairs = this.room.find(FIND_HOSTILE_STRUCTURES, (structure) => structure.type == STRUCTURE_KEEPER_LAIR)
		.map((lair) => {
			return {
				id: lair.id,
				pos: lair.pos
			};
		});
};

RoomParser.prototype.findEnergySources = function () {
	this.room.memory.safeSources = this.room.find(FIND_SOURCES, {
		filter: (source) => {
			return !this.findLairNearby(source);
		}
	})
		.map((source) => {
			return {
				id: source.id,
				pos: source.pos,
				freeSpots: this.lookForFreeSpotsAround(source.pos)
			};
		});
};

RoomParser.prototype.findLairNearby = function (source) {
	return _.find(this.room.memory.lairs, (lair) => {
		const path = PathFinder.search(source.pos, {pos: lair.pos, range: 1}).path;
		return (path.length < 10) ? lair : null;
	});
};

RoomParser.prototype.lookForFreeSpotsAround = function (sourcePos) {
	const positions = [
		{x: sourcePos.x - 1, y: sourcePos.y - 1, roomName: sourcePos.roomName},
		{x: sourcePos.x, y: sourcePos.y - 1, roomName: sourcePos.roomName},
		{x: sourcePos.x + 1, y: sourcePos.y - 1, roomName: sourcePos.roomName},
		{x: sourcePos.x - 1, y: sourcePos.y, roomName: sourcePos.roomName},
		{x: sourcePos.x + 1, y: sourcePos.y, roomName: sourcePos.roomName},
		{x: sourcePos.x - 1, y: sourcePos.y + 1, roomName: sourcePos.roomName},
		{x: sourcePos.x, y: sourcePos.y + 1, roomName: sourcePos.roomName},
		{x: sourcePos.x + 1, y: sourcePos.y + 1, roomName: sourcePos.roomName},
	];

	return _.filter(positions, (p) => {
		return this.room.getTerrain().get(p.x, p.y) != TERRAIN_MASK_WALL;
	});
};

module.exports = RoomParser;
