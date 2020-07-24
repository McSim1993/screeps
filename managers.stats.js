var roles = require('./managers.creeps').roles

function fillEnergyStats () {
  for (var roomName in Game.rooms) {
    var room = Game.rooms[roomName]
    var prev
    if (room.memory.energyStats) {
      prev = {
        energy: room.memory.energyStats.energy,
        capacity: room.memory.energyStats.capacity
      }
    }

    var containers = room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType == STRUCTURE_CONTAINER)
      }
    })

    var curr = room.memory.energyStats = _.reduce(containers, (prev, curr) => {
      return {
        energy: prev.energy + curr.store.energy,
        capacity: prev.capacity + curr.storeCapacity
      }
    }, {
      energy: 0,
      capacity: 0
    })

    console.log('Prev stat: ' + JSON.stringify(prev))
    console.log('Current stat: ' + JSON.stringify(curr))

    if (prev) {
      console.log('A: ' + (curr.energy - prev.energy).toString())
      console.log('B: ' + Math.floor(room.energyCapacityAvailable / 200) * 50 * 3 * 15)
      if (curr.energy == curr.capacity || curr.energy - prev.energy > Math.floor(room.energyCapacityAvailable / 200) * 50 * 3 * 15) {
        room.memory.buildersCount++
      }
      if (curr.energy == 0 || curr.energy - prev.energy < 0) {
        room.memory.buildersCount--
      }
      console.log('Builders count: ' + room.memory.buildersCount)
    }
  }
}

module.exports = {

  loop: function () {
    if (Game.time % 1500 == 0) {
      fillEnergyStats()
    }
  }
}
