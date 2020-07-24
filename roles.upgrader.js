/**
 * Created by McSim on 16.10.2016.
 */

var name = 'upgrader'

var i = 0

var states = {
  'upgrading': {
    next: (creep) => {
      if (creep.carry.energy == 0) {
        creep.memory.state = 'harvesting'
      }
      if (upgradeController(creep) == ERR_NOT_IN_RANGE) {
        creep.memory.state = 'moving'
      }
    },
    loop: () => {}
  },
  'harvesting': {
    next: (creep) => {
      if (creep.carry.energy == creep.carryCapacity) {
        creep.memory.state = 'moving'
      }
    },
    loop: findEnergy
  },
  'moving': {
    next: (creep) => {
      if (creep.memory.flag) {
        var flag = Game.flags[creep.memory.flag]
        if (!flag) {
          delete creep.memory.flag
        } else if (flag.pos.x == creep.pos.x && flag.pos.y == creep.pos.y) {
          creep.memory.state = 'upgrading'
          delete Game.flags[creep.memory.flag].memory.creep
          delete creep.memory.flag
        }
      } else {
        if (creep.upgradeController(creep.room.controller) != ERR_NOT_IN_RANGE) {
          creep.memory.state = 'upgrading'
        }
      }
    },
    loop: moveToController
  }
}

function loop (creep) {
  if (!creep.memory.state) creep.memory.state = 'harvesting'
  states[creep.memory.state].next(creep)
  states[creep.memory.state].loop(creep)
}

function findEnergy (creep) {
  var source = creep.pos.findClosestByPath(FIND_STRUCTURES, {
    filter: (structure) => {
      return (structure.structureType == STRUCTURE_CONTAINER) &&
                structure.store.energy > 0
    }
  })
  if (source) {
    if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      creep.moveTo(source)
    }
  } else {
    source = creep.pos.findClosestByPath(FIND_SOURCES)
    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
      creep.moveTo(source)
    }
  }
}

function moveToController (creep) {
  if (!creep.memory.flag) {
        // console.log('net flaga');
    var flag = creep.room.find(FIND_FLAGS, {
      filter: (f) => f.color == COLOR_BLUE && f.memory.creep == creep.name
    })[0]
    if (flag) {
      creep.memory.flag = flag.name
    }
  }

  if (creep.memory.flag) {
    creep.moveTo(Game.flags[creep.memory.flag])
  } else {
    creep.moveTo(creep.room.controller)
  }
}

function upgradeController (creep) {
  return creep.upgradeController(creep.room.controller)
}

function spawn (spawn, energy) {
  var numberOfParts = Math.floor(energy / 200)
  var body = []
  for (let i = 0; i < numberOfParts; i++) {
    body.push(WORK)
    body.push(CARRY)
    body.push(MOVE)
  }
  return spawn.createCreep(body, undefined, {
    role: name
  })
}

module.exports = {
  loop: loop,
  spawn: spawn,
  spawnAdditional: () => { return -1 },
  min: 1,
  name: name
}
