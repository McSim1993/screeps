var name = 'harvester'

function loop (creep) {
  if (creep.memory.transfering && creep.carry.energy == 0) {
    creep.memory.transfering = false
  } else if (!creep.memory.transfering && creep.carry.energy == creep.carryCapacity) {
    creep.memory.transfering = true
  }
  if (!creep.memory.transfering) {
    var source = Game.getObjectById(creep.memory.source)
    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
      creep.moveTo(source)
    }
  } else {
    var target = findTarget(creep)
    if (target) {
      if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target)
      }
    } else {
      var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES)
      if (constructionSite && creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
        creep.moveTo(constructionSite)
      }
    }
  }
}

function findTarget (creep) {
  var target

  if (!target) {
    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType == STRUCTURE_EXTENSION) &&
                    structure.energy < structure.energyCapacity
      }
    })
  }

  if (!target) {
    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType == STRUCTURE_SPAWN) &&
                    structure.energy < structure.energyCapacity
      }
    })
  }

  if (!target) {
    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType == STRUCTURE_TOWER) &&
                    structure.energy < structure.energyCapacity - 700
      }
    })
  }

  if (!target) {
    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType == STRUCTURE_CONTAINER) &&
                    structure.store.energy < structure.storeCapacity
      }
    })
  }

  return target
}

function spawn (spawn, energy) {
  if (!spawn.room.memory.sourcesCount) {
    spawn.room.memory.sourcesCount = spawn.room.find(FIND_SOURCES).length
  }

  var sCount = spawn.room.memory.sourcesCount
  var hCount = _.sum(Game.creeps, (c) => c.memory.role == name)
  var HpS = Math.ceil(3000 * 50 / 300 / (Math.floor(energy / 200) * 50))
  if (HpS > 3) HpS = 3
    // console.log(HpS);
  if (hCount < HpS * sCount) {
    var source = spawn.room.find(FIND_SOURCES, {
      filter: (s) => _.sum(Game.creeps, (c) => c.memory.role == name && c.memory.source == s.id) < HpS
    })[0].id
    return spawnHarvester(spawn, energy, source)
  }
  return -1
}

function spawnHarvester (spawn, energy, source) {
  var numberOfParts = Math.floor(energy / 200)
  var body = []
  for (let i = 0; i < numberOfParts; i++) {
    body.push(WORK)
    body.push(CARRY)
    body.push(MOVE)
  }
  return spawn.createCreep(body, undefined, {
    role: name,
    source: source
  })
}

module.exports = {
  loop: loop,
  spawn: spawn,
  spawnAdditional: spawn,
  name: name,
  min: 2
}
