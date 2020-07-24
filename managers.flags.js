var roles = require('./managers.creeps').roles;

module.exports = {

    loop: function () {
        for (var name in Game.flags) {
            var flag = Game.flags[name];
            // console.log(name);
            if (flag.color == COLOR_BLUE && !flag.memory.creep) {
                var creep = flag.pos.findClosestByPath(FIND_MY_CREEPS, {
                    filter: (c) => (c.memory.role == roles.upgrader.name || c.memory.role == roles.builder.name)
                        && c.memory.state == 'moving'
                });
                if (creep) {
                    flag.memory.creep = creep.name;
                }
            }
            if (flag.memory.creep && !Game.creeps[flag.memory.creep])
                delete flag.memory.creep;
        }
    }
};