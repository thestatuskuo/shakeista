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

	var orderUrl = "https://ignition-hackday.herokuapp.com/orders/";
	var ingredientsUrl = "https://ignition-hackday.herokuapp.com/ingredients";

	function closeOrder(orderId) {
		$.ajax({
		    url: orderUrl + orderId,
			type: 'PUT',
			data: {
				"status": "closed"
			},
			success: function(res) {
				console.log(res);
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
				return res;
			}
		});
	}

	function postRandomMissingIngredients() {
		var list = generateRandomIngredientList();
		postMissingIngredients(list);
	}

	return {
		closeOrder: closeOrder,
		generateRandomIngredientList: generateRandomIngredientList,
		generateRandomOrder: generateRandomOrder,
		getMissingIngredientList: getMissingIngredientList,
		getOrders: getOrders,
		options: Options,
		postMissingIngredients: postMissingIngredients,
		postOrder: postOrder,
		postRandomOrder: postRandomOrder,
		postRandomMissingIngredients: postRandomMissingIngredients
	}
})();