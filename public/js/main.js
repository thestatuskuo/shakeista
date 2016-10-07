$( document ).ready(function() {
	buildInventoryList();
    var orders = Ignition.getOrders();
    orders.then(function(data) {
		$.each(data, function(i, item) {
			$( "#orders .logo-wrapper" ).after( 
				'<div class="order"><p class="order-name">Sharie</p><p class="subhead">Order</p><div class="order-wrapper"><p class="order-title">Flavor: <span class="order-flavor">'+data[i]['Flavors[]']+'</span></p><p class="order-title">Base: <span class="order-base">'+data[i]['Base[]']+'</span></p><p class="order-title">Add-Ons: <span class="order-add-ons">'+data[i]['Add-Ins[]']+'</span></p><p class="order-title">Boosts: <span class="order-boosts">'+data[i]['Boosts[]']+'</span></p></div><p class="subhead">Special Instructions</p><textarea class="order-instructions-box">'+data[i]['note']+'</textarea></div>'
			);
		});
		$("#orders .order").first().addClass('first-order');
		$("#orders .first-order").next('#orders .order').addClass('second-order');
    });

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
