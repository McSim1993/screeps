/**
 * Created by McSim on 16.10.2016.
 */

var upgraderRole = require('./roles.upgrader')

var name = 'repairer'

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

function repairerRole (creep, structure) {
  if (creep.memory.working && creep.carry.energy == 0) {
    creep.memory.working = false
    creep.say('harvesting')
  } else if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
    creep.memory.working = true
    creep.say('repairing')
  }

  if (creep.memory.working) {
    if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
      creep.moveTo(structure)
    }
  } else {
    findEnergy(creep)
  }
}

function loop (creep) {
  var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
    filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL
  })
  if (structure) {
    return repairerRole(creep, structure)
  }
  structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
    filter: (s) => s.structureType == STRUCTURE_TOWER && s.energy < s.carryCapacity - 500
  })

  upgraderRole.loop(creep)
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

function spawnAdditional (spawnC, energy) {
  if (_.sum(Game.creeps, (c) => c.memory.role == name) < 1) {
    return spawn(spawnC, energy)
  } else {
    return -1
  }
}

module.exports = {
  loop: loop,
  spawn: spawn,
  spawnAdditional: spawnAdditional,
  min: 0,
  name: name
}
