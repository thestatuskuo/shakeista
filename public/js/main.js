$( document ).ready(function() {
	buildInventoryList();
	// Ignition.getOrders().then(function(data) {
	// 	console.log(data);
	// });

	$("#submitMissing").click(function() {
		Ignition.postMissingIngredients(getMissingIngredients()).then(function(data) {
			if (data) {
				//show success message
			} else {
				//show error message
			}
		});
	});

	$("#break-switch").change(function() {
		var onBreak = $("#break-switch").is(':checked');
		Ignition.postOnBreakFlag(onBreak).then(function(data) {
			if (data) {
				//show success message
			} else {
				//show error message
			}
		});
	})
});

function buildInventoryList() {
	var html = "";
	var options = Ignition.options;
	for (key in options) {
		if (options.hasOwnProperty(key)){
			html += '<div class="customization-panel"><h1>' +key +'<ul class="list" id="' + key +'-inventory">';
			var choices = options[key];
			for (var i = 0; i < choices.length; i++) {
				var val = choices[i];
				html += "<li>" + '<input id="' + val + '" class="checkbox-custom" name="' + val + '" type="checkbox" value="' + val +'">' + 
				'<label for="' + val + '" class="checkbox-custom-label">' + val + '</label>' +
				"</li>";
			}
			html += '</div>';
		}
	}
	$(".customization-container").html(html);
}

function getMissingIngredients() {
	var options = Ignition.options;
	var list = {};
	for (key in options) {
		list[key] = [];
		var missing = $("#" + key + "-inventory").find("li>input:checked");
		for (var i = 0; i < missing.length; i++) {
			list[key].push(missing[i].value);
		}
	}
	return list;
}