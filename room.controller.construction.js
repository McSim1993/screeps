const utils = require('utils');

function ConstructionController (room) {
	this.room = room;
}

ConstructionController.prototype.loop = function () {
	if (this.room.controller.level >= 2 && !this.room.memory.roadsConstructed) {
		this.constructRoads();
		this.room.memory.roadsConstructed = true;
	}
};

ConstructionController.prototype.constructRoads = function () {
	const spawns = this.room.find(FIND_MY_SPAWNS);
	const sources = this.room.memory.safeSources;
	spawns.forEach((spawn, i) => {
		sources.forEach((source, j) => {
			const closestFreeSpot = utils.minBy(source.freeSpots, (spot) => spawn.pos.getRangeTo(spot.x, spot.y));
			const closestPos = this.room.getPositionAt(closestFreeSpot.x, closestFreeSpot.y);
			const direction = closestPos.getDirectionTo(spawn.pos);
			const from = spawn.pos;
			var to = posPlusDirection(closestFreeSpot, direction, 2);
			if (this.room.getTerrain().get(to.x, to.y) == TERRAIN_MASK_WALL) {
				to = closestPos;
			}

			const path = PathFinder.search(
				from,
				{ pos: to, range: 0 },
				{swampCost: 1}
			).path;
			path.push(to);
			path.forEach((pos, i) => {
				pos.createConstructionSite(STRUCTURE_ROAD);
			});

			source.freeSpots.forEach((spot, i) => {
				const pathToSpot = PathFinder.search(
					to,
					{ pos: this.room.getPositionAt(spot.x, spot.y), range: 0 },
					{swampCost: 1}
				).path;
				pathToSpot.forEach((pos, i) => {
					pos.createConstructionSite(STRUCTURE_ROAD);
				});
			});
		});
	});
};

function posPlusDirection (pos, direction, factor) {
	const amount = factor ? factor : 1;
	switch (direction) {
		case TOP:
			return new RoomPosition(pos.x, pos.y - amount, pos.roomName);
		case TOP_RIGHT:
			return new RoomPosition(pos.x + amount, pos.y - amount, pos.roomName);
		case RIGHT:
			return new RoomPosition(pos.x + amount, pos.y, pos.roomName);
		case BOTTOM_RIGHT:
			return new RoomPosition(pos.x + amount, pos.y + amount, pos.roomName);
		case BOTTOM:
			return new RoomPosition(pos.x, pos.y + amount, pos.roomName);
		case BOTTOM_LEFT:
			return new RoomPosition(pos.x - amount, pos.y + amount, pos.roomName);
		case LEFT:
			return new RoomPosition(pos.x - amount, pos.y, pos.roomName);
		case TOP_LEFT:
			return new RoomPosition(pos.x - amount, pos.y - amount, pos.roomName);
	}
}

module.exports = ConstructionController;
