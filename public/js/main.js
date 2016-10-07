var ordersCache;
$( document ).ready(function() {
	buildOrders();
	buildInventoryList();

    $('#home .nav, #orders .nav, #break .nav, #inventory .nav').click(function(){
		var buttonClass = $(this).attr('class').split(' ')[1];
    	toggleSections(buttonClass);
    });

    function toggleSections(showSection) {
		$.each($('.section-wrapper'), function(){
    		$(this).hide();
    	});
    	$('#' + showSection + '').show();
    }

	$("#submitMissing").click(function() {
		Ignition.postMissingIngredients(getMissingIngredients()).then(function(data) {
			if (data) {
				alert("Inventory updated.");
				toggleSections("home");
			} else {
				alert("you failed");
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

	$('body').on('click', '.done', function() {
	    var id = $(this).data("id");
	    console.log(id);
		Ignition.closeOrder(id).then(function(data) {
			//refresh list
			buildOrders();
		});
	});

	$('body').on('click', '.notify-user', function() {
	    var id = $(this).data("id");
	    console.log(id);
	    var note = $(this).siblings('textarea').val()
		Ignition.cancelOrder(id, note).then(function(data) {
			//refresh list
			buildOrders();
		});
	});
});

function buildOrders() {
    var orders = Ignition.getOrders();
    orders.then(function(data) {
    	data.sort(function(a,b){
		  return new Date(b.date) - new Date(a.date);
		});
    	ordersCache = data;
    	var html = "";
		$.each(data, function(i, item) {
			var flavors = data[i]['Flavors[]'] ? data[i]['Flavors[]'] : "";
			var base = data[i]['Base[]'] ? data[i]['Base[]'] : "";
			var addIns = data[i]['Add-Ins[]'] ? data[i]['Add-Ins[]'] : "";
			var boosts = data[i]['Boosts[]'] ? data[i]['Boosts[]'] : "";


			html += '<div class="order"><span class="done" data-id="' + data[i]._id + '""><i class="fa fa-check" aria-hidden="true"></i></span>' + 
				'<p class="order-name">' + data[i].name + '</p><p class="subhead">Order</p><div class="order-wrapper">' + 
				'<p class="order-title flavor">Flavor: <span class="order-selection">' +
				flavors +'</span></p><p class="order-title base">Base: <span class="order-selection base">' +
				base +'</span></p><p class="order-title add-ons">Add-Ons: <span class="order-selection">' +
				addIns +'</span></p><p class="order-title boosts">Boosts: <span class="order-selection">'+
				boosts+'</span></p></div><p class="subhead">Special Instructions</p><p class="order-instructions-box">'+
				data[i]['note']+'</p><button class="cancel">CANCEL ORDER</button><div id="cancel-modal" class="modal">' + 
				'<div class="modal-content"><div class="modal-header"><span class="close">×</span></div><div class="modal-body">' + 
				'<p>' + data[i].name + '</p><textarea placeholder="Why your order cant be placed"></textarea><button class="notify-user" data-id="' + data[i]._id + '">Notify User</button>' + 
				'</div></div></div></div>';
		});
		
		$("#orders-container").html(html);
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
}

function buildInventoryList() {
	var html = "";
	var options = Ignition.options;
	for (key in options) {
		if (options.hasOwnProperty(key)){
			html += '<div class="customization-panel"><h1>' +key +'</h1><ul class="list" id="' + key +'-inventory">';
			var choices = options[key];
			for (var i = 0; i < choices.length; i++) {
				var val = choices[i];
				html += "<li>" + '<input id="' + val + '" class="checkbox-custom" name="' + val + '" type="checkbox" checked value="' + val +'">' + 
				'<label for="' + val + '" class="checkbox-custom-label">' + val + '</label>' +
				"</li>";
			}
			html += '</ul></div>';
		}
	}
	$(".customization-container").html(html);
}

function getMissingIngredients() {
	var options = Ignition.options;
	var list = {};
	for (key in options) {
		list[key] = [];
		var missing = $("#" + key + "-inventory").find("li > input:not(:checked)");
		for (var i = 0; i < missing.length; i++) {
			list[key].push(missing[i].value);
		}
	}
	return list;
}
