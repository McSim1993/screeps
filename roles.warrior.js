/**
 * Created by McSim on 16.10.2016.
 */

var upgraderRole = require('./roles.upgrader')

var name = 'warrior'

function loop (creep) {
  var wall = creep.pos.findClosestByPath(FIND_STRUCTURES, {
    filter: (s) => s.structureType == STRUCTURE_WALL
  })
  if (creep.attack(wall) == ERR_NOT_IN_RANGE) {
    creep.moveTo(wall)
  }
}

function spawn (spawn, energy) {
  var numberOfParts = Math.floor((energy - 50) / 80)
  var body = [MOVE]

  for (let i = 0; i < numberOfParts; i++) {
    body.push(ATTACK)
  }
  return spawn.createCreep(body, undefined, {
    role: name
  })
}

function spawnAdditional (spawnC, energy) {
  if (_.sum(Game.creeps, (c) => c.memory.role == name) < 0) {
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
