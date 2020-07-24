var creepsManager = require('./managers.creeps')
var spawnManager = require('./managers.spawn')
var flagManager = require('./managers.flags')
var statsManager = require('./managers.stats')
var towerManager = require('./managers.towers')

module.exports.loop = function () {
  statsManager.loop()
  flagManager.loop()
  creepsManager.loop()
  towerManager.loop()
  spawnManager.loop()
}
