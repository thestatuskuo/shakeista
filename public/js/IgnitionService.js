var Ignition = (function() {
	var Options = {
	  "Flavors" : [
		  "Chocolate", 
		  "Vanilla", 
		  "Strawberry", 
		  "Chocolate Vegan", 
		  "Tropical Strawberry Vegan",
		  "Caffe Latte", 
		  "Greenberry"
		  ],
	  "Base": [
		  "Water",
		  "Almond Milk",
		  "Non-Fat Milk",
		  "1% Milk",
		  "2% Milk",
		  "Iced Coffee"
		],
		"Add-Ins": [
			"Banana",
			"Strawberries",
			"Blueberries",
			"Tropical Fruit Blend",
			"PB2"
		  ],

		"Boosts": [
			"Power Greens",
			"Digesitve Health",
			"Focused Energy" 
		]
	};

	var ignitionBaseUrl = "https://ignition-hackday.herokuapp.com";
	var orderUrl = ignitionBaseUrl + "/orders";
	var ingredientsUrl = ignitionBaseUrl + "/ingredients";
	var onBreakUrl = ignitionBaseUrl + "/break";

	function cancelOrder(orderId, note) {
		return $.post({
		    url: orderUrl + "/cancel/" + orderId,
		    data : { note: note},
			success: function(res) {
				return res;
			}
		});
	}

	function closeOrder(orderId) {
		return $.post({
		    url: orderUrl + "/close/" + orderId,
		    data : {},
			success: function(res) {
				return res;
			}
		});
	}

 	function getOrders() {
		return $.get({
			url: orderUrl,
			success: function(res) {
				return res;
			}
		});
	}

	function postOrder(order) {
		return $.post({
			url: orderUrl,
			data : order,
			success: function(res) {
				return res;
			}
		});
	}

	function postRandomOrder() {
		postOrder(generateRandomOrder());
	}

	function generateRandomOrder() {
		var order = generateRandomIngredientList();
		
		order.status = "open";
		order.note = "";

		return order;
	}

	function generateRandomIngredientList() {
		var order = {};
		var options = Options;
		for (key in options) {
			if (options.hasOwnProperty(key)){
				var choices = options[key];
				var item = choices[Math.floor(Math.random()*choices.length)];
				order[key] = [item];
			}
		}
		return order;
	}


 	function getMissingIngredientList() {
		return $.get({
			url: ingredientsUrl,
			success: function(res) {
				return res;
			}
		});
	}

	function postMissingIngredients(ingredientList) {
		return $.post({
			url: ingredientsUrl,
			data : ingredientList,
			success: function(res) {
				return true;
			},
			error: function(res) {
				return false;
			}
		});
	}

	function postRandomMissingIngredients() {
		var list = generateRandomIngredientList();
		postMissingIngredients(list);
	}

	function getOnBreakFlag() {
		return $.get({
			url: onBreakUrl,
			success: function(res) {
				return res;
			}
		});
	}

	function postOnBreakFlag(flag) {
		return $.post({
			url: onBreakUrl,
			data : {
				"onBreak": flag
			},
			success: function(res) {
				return true;
			},
			error: function(res) {
				return false;
			}
		});
	}

	return {
		cancelOrder: cancelOrder,
		closeOrder: closeOrder,
		generateRandomIngredientList: generateRandomIngredientList,
		generateRandomOrder: generateRandomOrder,
		getMissingIngredientList: getMissingIngredientList,
		getOrders: getOrders,
		getOnBreakFlag : getOnBreakFlag,
		options: Options,
		postMissingIngredients: postMissingIngredients,
		postOrder: postOrder,
		postRandomOrder: postRandomOrder,
		postRandomMissingIngredients: postRandomMissingIngredients,
		postOnBreakFlag: postOnBreakFlag
	}
})();