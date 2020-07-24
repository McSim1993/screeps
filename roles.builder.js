/**
 * Created by McSim on 16.10.2016.
 */

var upgraderRole = require('./roles.upgrader');

var name = 'builder';

function builderRole(creep, constructionSite) {
    if (creep.memory.working && creep.carry.energy == 0) {
        creep.memory.working = false;
        creep.say('harvesting');
    }
    else if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
        creep.memory.working = true;
        creep.say('construct');
    }

    if (creep.memory.working) {
        if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
            creep.moveTo(constructionSite);
        }
    }
    else {
        findEnergy(creep);
    }
}

function findEnergy(creep) {
    var source = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_CONTAINER) &&
                structure.store.energy > 0;
        }
    });
    if (source) {
        if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            creep.moveTo(source);
    } else {
        source = creep.pos.findClosestByPath(FIND_SOURCES);
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    }
}

function loop(creep) {
    var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
    if (constructionSite)
        return builderRole(creep, constructionSite);

    upgraderRole.loop(creep);
}

function spawn(spawn, energy) {
    var numberOfParts = Math.floor(energy / 200);
    var body = [];
    for (let i = 0; i < numberOfParts; i++) {
        body.push(WORK);
        body.push(CARRY);
        body.push(MOVE);
    }
    return spawn.createCreep(body, undefined, {
        role: name
    });
}

function spawnAdditional(spawnC, energy) {
    if (!spawnC.room.memory.hasOwnProperty('buildersCount'))
        spawnC.room.memory.buildersCount = 4;

    if (_.sum(Game.creeps, (c) => c.memory.role == name) < spawnC.room.memory.buildersCount) {
        return spawn(spawnC, energy);
    }
    else
        return -1;
}

module.exports = {
    loop: loop,
    spawn: spawn,
    spawnAdditional: spawnAdditional,
    min: 1,
    name: name
};