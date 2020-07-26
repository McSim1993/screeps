module.exports = {
	randomInt: function (max) {
		return Math.floor(Math.random() * Math.floor(max));
	},
	minBy(array, f) {
		if (array.length == 0) return undefined;

		var min = 0;
		var minValue = f(array[min]);
		for (var i = 1; i < array.length; i++) {
			const next = f(array[i]);
			if (next < minValue) {
				min = i;
				minValue = next;
			}
		}

		return array[min];
	}
};
