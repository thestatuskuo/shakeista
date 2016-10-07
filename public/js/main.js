$( document ).ready(function() {
	buildInventoryList();
    var orders = Ignition.getOrders();
    orders.then(function(data) {
		$.each(data, function(i, item) {
			$( "#orders .logo-wrapper" ).after( 
				'<div class="order"><span class="done"><i class="fa fa-check" aria-hidden="true"></i></span><p class="order-name">Sharie</p><p class="subhead">Order</p><div class="order-wrapper"><p class="order-title flavor">Flavor: <span class="order-selection">'+data[i]['Flavors[]']+'</span></p><p class="order-title base">Base: <span class="order-selection base">'+data[i]['Base[]']+'</span></p><p class="order-title add-ons">Add-Ons: <span class="order-selection">'+data[i]['Add-Ins[]']+'</span></p><p class="order-title boosts">Boosts: <span class="order-selection">'+data[i]['Boosts[]']+'</span></p></div><p class="subhead">Special Instructions</p><p class="order-instructions-box">'+data[i]['note']+'</p><button class="cancel">CANCEL ORDER</button><div id="cancel-modal" class="modal"><div class="modal-content"><div class="modal-header"><span class="close">×</span></div><div class="modal-body"><p>Sharie</p><textarea>Why your order cant be placed</textarea><button class="notify-user">Notify User</button></div></div></div></div>'
			);
		});
		$("#orders .order").first().addClass('first-order');
		$("#orders .first-order").next('#orders .order').addClass('second-order');
		$("#orders .order:not(.first-order,.second-order)").wrapAll("<div class='order-queue' />")
		$("#orders .order-selection").text(function(){
			return $(this).text().replace(",", ", "); 
		});

		$(".cancel").click(function(){
			$(this).next('#cancel-modal').show();
			$('#cancel-modal .close').click(function(){
				$(this).parents('#cancel-modal').hide();
			});
		});
    });

    $('#home .nav, #orders .nav, #break .nav, #inventory .nav').click(function(){
		var buttonClass = $(this).attr('class').split(' ')[1];
    	console.log(buttonClass);
    	$.each($('.section-wrapper'), function(){
    		$(this).hide();
    	});
    	$('#' + buttonClass + '').show();
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
		$(".switch .closed").toggleClass('open');
		Ignition.postOnBreakFlag(onBreak).then(function(data) {
			if (data) {
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
