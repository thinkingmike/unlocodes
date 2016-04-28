//Hack to avoid error message in FF console for local json file
$.ajaxSetup({beforeSend: function(xhr)  {
	if (xhr.overrideMimeType) {
		xhr.overrideMimeType("application/json");
		}
	}
});

/*--------------------------- Get Data from server-------------------------------------------*/
if(!localStorage.localData) {
	$.getJSON('ports.json', function(data) {
		localStorage['localData'] = JSON.stringify(data);			//Save data to LocalStorage
	});
}

$(function() {

	FastClick.attach(document.body);

	$('.lblCountryID').focus(); 

	var p = new CountryData();
	var testCountries = ['ad', 'af', 'am', 'n8'];

	for(var e in testCountries) {
		var f = p.test(testCountries[e]);

		// if(!f.countryName) {
		// 	console.log(testCountries[e].toUpperCase() + ' is not a country');
		// 	return;
		// }

		// if(!f.port) {
		// 	console.log(f.countryName + ' has no ports');
		// }

		if(!f.port) {
			console.log(f.countryName);
		}

	}
	


/*--------------------------- Event Handlers lblCountryID-------------------------------------------*/
	$('.lblCountryID').keyup(function(evt) {
		var countryID = $(this).val().toUpperCase();
		var portID = $('.lblPortID').val().toUpperCase();

		if(countryID.length == 2 && portID.length != 3) {
			$('.lblPortID').focus();

			//Sort output by portID's
			var list = getCountryList(countryID);
			var data = new Sort();
			var output = data.sortList(list.data, 'portId');

			createCard({data:output});
		}

		if(countryID.length !=2 && portID.length != 3) {
			$('.found').html('');
			$('.message').text('\xA0');
		}

		if(countryID.length == 2 && portID.length == 3) {

			var list = getCountryList(countryID);

			if(list.countryExist) {
				var blnFound = false;

				for(var p in list.data) {
						if(list.data[p].portId == portID) {
						createCard({data:list.data[p], message:''});
						blnFound = true;
					}
				}

				if(!blnFound) {
					createCard({data:'', message:'There is no port ' + portID + ' in ' + countryID});
				}
			}

			else {   //Country does not exist
				createCard(list);
			}
		}

		if(countryID.length !=2 && portID.length == 3) {
			//Do nothing, handled by lblPortID handler
		}

	});//eof 'keyup lblCountryID'


/*--------------------------- Event Handlers lblPortID-------------------------------------------*/
	$('.lblPortID').keyup(function(evt){

		var countryID = $('.lblCountryID').val().toUpperCase();
		var portID = $(this).val().toUpperCase();

		if(portID.length == 3 && countryID.length != 2) {
			var list = getPortList(portID);
			var data = new Sort();
			var output = data.sortList(list.data, 'countryId');
			
			createCard({data:output});
		}

		if(portID.length == 1 && countryID.length == 2) {
			//scroll to item in list with first letter  --> TODO , as of now horrible UX 
			// var list = getCountryList(countryID);
			// var data = new Sort();
			// var output = data.sortList(list.data, 'portId');

			// for(var w in output) {
			// 	if (output[w].portId.indexOf(portID) == 0) {

			// 		$('.found').animate({
			// 			scrollTop: $('.card li:nth-child(' + (++w) + ')').position().top - $('.card li:first').position().top
			// 		}, 400);
			// 		return;
			// 	}
			// }
		}

		if(portID.length == 2 && countryID.length == 2) {
			//TODO -> scroll to portcode first two letters
		}

		if(portID.length == 3 && countryID.length == 2) {
			var list = getCountryList(countryID);
			
			if(list.countryExist) {
				var blnFound = false;

				for(var p in list.data) {
					if(list.data[p].portId == portID) {
						createCard({data:list.data[p], message:list.message[p]});
						blnFound = true;

						// document.activeElement.blur();		//Hide iOS keyboard
					}
				}
				if(!blnFound) {
						message =  'No port ' + portID.toUpperCase() + ' in ' + list.data[0].countryName;
						createCard({data: '',message: message});
				}
			}
		}

		// if(portID.length != 3 && countryID.length == 2) {
		// 	var data = new Sort();
		// 	var list = getCountryList(countryID);
		// 	var output = data.sortList(list.data, 'portId');

		// 	createCard({data:output});
		// }

		if(portID.length !=3 && countryID.length != 2) {
			$('.found').html('');
			$('.message').text('\xA0');
		}

	}); //eof 'keyup' handler


/*--------------------------- Event Handlers Search-------------------------------------------*/

	$('.search-icon').click(function(evt) {
		//In progress
		var sr = $('.search-box');

		if(sr.hasClass('search-box-expanded')) {
			//search box is expanded -- DO Something
			if(sr.val().length > 0) {
				var key = sr.val();

				createCard(searchItem(key));
				document.activeElement.blur();		//hide iOS keyboard
			}
		}

		else {
			$('.countryID').focus();
		}

		//change -> give all elements additional classname
		$('.search').toggleClass('search-expanded');
		$('.search-box').toggleClass('search-box-expanded');
		$('.search-icon').toggleClass('search-icon-expanded');

		$('.lblPortID').toggleClass('lbl-expanded');
		$('.lblCountryID').toggleClass('lbl-expanded');

		$('.search-box').focus();
		$('.search-box').val('');
		$('.lblCountryID').val('');
		$('.lblPortID').val('');
		$('.found').html('');


		return false;
	});//eof 'click' searchglass


	 $('.search-box').keyup(function(evt) {
	 	//TODO -> faster Search algo

	 	var keyENTER = 13;
	 	var key = $(this).val();

	 	if(key == '') {
	 		$('.found').html('');
	 		return;
	 	}

	 	if (evt.which == keyENTER) {
		 	createCard(searchItem(key));
			document.activeElement.blur();		//hide iOS keyboard

	 	}
	 });//eof 'search' handler

	 $('.found').scroll(function() {
	 	document.activeElement.blur();		//Hide iOS keyboard
	 })

/*-------------------------------------------- (Controller)-------------------------------------------*/
// TODO MVC
// Input : lblCountryId , lblPortId , searchKey
// Return : List [] , message
// Communicate with Model (country.js / port.js)

/*---------------------------TODO templating handlebars.js  -------------------------------------------*/
	function createCard(obj) {

		var data = obj.data;

		var card = '<ul class = "card">';

		if(typeof obj.data.length == 'undefined') {		//Just one item
				var str = '<li class = cardInfo>'
					str += '<h3><span class = countryID>' + data.countryId + '</span><span class = portID> ' + data.portId + '</span></h3>';
					str += '<p class = portName>' + data.portName + '</p>';
					str += '<p class = countryName>' + data.countryName + '</p>';
					str += '</li>';

			card += str;
	 		// document.activeElement.blur();		//Hide iOS keyboard

		}

		else {		//List of items
			for(var c in data) {
				var str = '<li class = cardInfo>'
					str += '<h3><span class = countryID>' + data[c].countryId + '</span><span class = portID> ' + data[c].portId + '</span></h3>';
					str += '<p class = portName>' + data[c].portName + '</p>';
					str += '<p class = countryName>' + data[c].countryName + '</p>';
					str += '</li>';

			card += str;
			}
		}

	card += '</ul>';

	$('.found').html(card).show();
	$('.message').text(obj.message);
	// document.activeElement.blur();		//Hide iOS keyboard


	$('.found li').click(function() {			//Event Handler to Get data Selected Card

		var str = '<div class = selectedCard>'
			str += '<h3>' + $(this).find('.countryID').html() + $(this).find('.portID').html() + '</h3>';
			str += '<p>' + $(this).find('.portName').html() + '</p>';
			str += '<p>' + $(this).find('.countryName').html() + '</p></div';

		$('.found').html(str);

		$('.lblCountryID').val($(this).find('.countryID').html());
		$('.lblPortID').val($(this).find('.portID').html());
		
		$('.message').text('\xA0');
		document.activeElement.blur();		//Hide iOS keyboard

	});
}

function getCountryList(Id) {
	var c = new CountryData();

	return c.findById(Id);
}

function getPortList(Id) {
	var p = new PortData();

	return p.findById(Id);
}

function searchItem(key) {
	var p = new PortData();
	
	return p.findByName(key);
}

}); //End of $(document).ready()

var Sort = function() {

	this.sortList = function(list, key) {
		return list.sort(sort_by(key, false, function(a){return a}));
	}	

 	//found on Stack Overflow
	var sort_by = function(field, reverse, primer) {

		var key = primer ? 
			function(x) {return primer (x[field])} :
			function(x) {return x[field]};

		reverse = !reverse ? 1 : -1;

		return function(a, b) {
			return a = key(a), b = key(b), reverse * ((a > b) - (b > a ));
		}
	}
}








