var roles = require('./managers.creeps').roles;

function loop() {
    for(let spawnName in Game.spawns) {
        var spawn = Game.spawns[spawnName];
        if (spawnNecessaryCreeps(spawn))
            return;

        if (spawnAdditionalCreeps(spawn))
            return;

        if (spawnHarvestingCreeps(spawn))
            return;
    }
}

function spawnNecessaryCreeps(spawn) {
    var code;
    for(let roleName in roles) {
        var role = roles[roleName];
        var creepsCount = _.sum(Game.creeps, (c) => c.memory.role == roleName);
        if (creepsCount < role.min) {
            code = role.spawn(spawn, spawn.room.energyCapacityAvailable);
            if (!(code < 0)) {
                console.log('Spawned new creep: ' + code + '(' + roleName + ')');
                return code;
            }
        }
    }
}

function spawnAdditionalCreeps(spawn) {
    var code;
    for(let roleName in roles) {
        var role = roles[roleName];
        var creepsCount = _.sum(Game.creeps, (c) => c.memory.role == roleName);
        code = role.spawnAdditional(spawn, spawn.room.energyCapacityAvailable);
        if (!(code < 0)) {
            console.log('Spawned new additional creep: ' + code + '(' + roleName + ')');
            return code;
        }
    }
}

function spawnHarvestingCreeps(spawn) {
    var code;
    if (!_.sum(Game.creeps, (c) => c.memory.role == roles.harvester.name)) {
        code = roles.harvester.spawn(spawn, spawn.room.energyAvailable);
        if (!(code < 0)) {
            console.log('Spawned new creep: ' + code + '(' + roles.harvester.name + ')');
            return code;
        }
    }
}

module.exports = {
    loop: loop
};