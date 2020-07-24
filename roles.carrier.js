/**
 * Created by McSim on 16.10.2016.
 */

var upgraderRole = require('./roles.upgrader');

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
        var source = creep.pos.findClosestByPath(FIND_SOURCES);
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    }
}

module.exports = function (creep) {
    var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
    if (constructionSite)
        return builderRole(creep, constructionSite);

    upgraderRole(creep);
};