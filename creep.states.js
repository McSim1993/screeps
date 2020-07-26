const Harvesting = require('./creep.state.harvesting');
const Transfering = require('./creep.state.transfering');
const Building = require('./creep.state.building');
const Upgrading = require('./creep.state.upgrading');
const Repairing = require('./creep.state.repairing');
const Draining = require('./creep.state.draining');

module.exports = {
	harvesting: Harvesting,
	transfering: Transfering,
	building: Building,
	upgrading: Upgrading,
	repairing: Repairing,
	draining: Draining
};
