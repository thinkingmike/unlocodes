//Hack to avoid error message in FF console for local json file
$.ajaxSetup({beforeSend: function(xhr)  {
	if (xhr.overrideMimeType) {
		xhr.overrideMimeType("application/json");
		}
	}
});


$(document).ready(function() {
	// console.log('init');

	LoadFileJSON ('myData','ports.json');

	//load data to local storage
	function LoadFileJSON(toLocalStorage, url) {
		if(localStorage[toLocalStorage]) {
			// console.log('data already loaded local');
		}
		else {
			$.getJSON(url, function(data) {
				localStorage[toLocalStorage] = JSON.stringify(data);
				// console.log('data retrieved and stored local');
			});
		}
	}

// 	function test(id) {
// 		//Get data from local storage
// 		var myJSON = JSON.parse(localStorage.myData);

// 		$.each(myJSON.UNLOCODE, function() {
// 			$.each(this, function() {
// 				if(id == this.ID.toUpperCase()) {
// 					console.log(this.name);
// 					return this.name;
// 				}
// 			})
// 		})
// }

	var countryID = document.getElementById('lbCountryID');
	var portID = document.getElementById('lblPortID');

	var labelCountry = document.getElementById('lstCountry');
	var labelPort = document.getElementById('lstPort');

	var dropdown = document.getElementById('dropdown');
	// var message = document.getElementById('message');

	//Global variables
	var JSONdata = JSON.parse(localStorage.myData);
	var ports = [];

	//EventListeners
	countryID.addEventListener('keyup',findCountryName,false);
	portID.addEventListener('keyup',findPortName,false);
	labelCountry.addEventListener('keyup', getListCountries, false);
	labelCountry.addEventListener('click', clearLabel, false);
	labelPort.addEventListener('keyup', getPortID, false);
	dropdown.addEventListener('click', setLabelfromDropDown, false);
	
	//Initial Settings
	countryID.value = "",portID.value = "", labelCountry.value = "",labelPort.value="";

	$('#dropdown').hide();


	function findCountryName() {
   
   	if(countryID.value.length == 2) {
		portID.focus();
		
		var blnFound;

		$.each(JSONdata.UNLOCODE, function() {
			$.each(this,function() {
				if(this.ID === countryID.value.toUpperCase()) {
					labelCountry.value = this.name;
					ports = this.port;
					blnFound = ! blnFound;
				}
			})
		})

		if(!blnFound) {
			labelCountry.value = 'No country ' + countryID.value.toUpperCase();
			countryID.focus();
		}
	}
}

function getCoutryId() {

	labelPort.focus();
	portID.value = "", labelPort.value = "";

	$.getJSON('ports.JSON', function (data) {
		$.each(data.UNLOCODE, function() {
			$.each(this, function() {
				if(this.name == labelCountry.value.toUpperCase()) {
					countryID.value = this.ID;

					ports = this.port;
					if(typeof ports == 'undefined') {
						console.log('no ports here');
						return;
					}
					//TODO error handling if there is no port -> eg AD Andorra

					var select = document.getElementById('dropdown');
					select.innerHTML = "";

					$('#dropdown').show();
					$('#dropdown').attr('size',15);
					$('#dropdown').focus();

					for(var i = 0; i < ports.length; i++) {
						var opt = document.createElement('option');
						opt.innerHTML = ports[i].name;
						opt.value = i;

						select.appendChild(opt);
					}
				}
			})
		})
	});
}

function findPortName() {

	if(typeof ports === 'undefined') {
		labelPort.value = ('No ports in ' + labelCountry.value);
	}

	else {
		if(portID.value.length == 3) {

			var blnFound;

			$.each(ports, function() {		
				if(this.ID == portID.value.toUpperCase()) {
				labelPort.value = this.name;

				blnFound = !blnFound;
				}			
			})

			if(!blnFound) {
				labelPort.value = 'Port ' + portID.value.toUpperCase() + ' not found.';
			}
		}
	}
}

function getListCountries() {

var countries = [];
strSearch = labelCountry.value;

	$.getJSON('ports.json', function(data) {
		$.each(data.UNLOCODE, function() {
			$.each(this, function() {

					if(this.name.indexOf(strSearch.toUpperCase()) != -1) {
						countries.push(this.name);
					}
				})
			})

			if(countries.length == 1) {
				labelCountry.value = countries[0];
				$('#dropdown').hide();

				getCoutryId();
			}

			else {
				var select = document.getElementById('dropdown');
				select.innerHTML = "";

				$('#dropdown').show();
				$('#dropdown').attr('size',countries.length);

				for(var i = 0; i < countries.length; i++) {
					var opt = document.createElement('option');
					opt.innerHTML = countries[i];
					opt.value = i;

					select.appendChild(opt);
				}
		}
	});
}



function setLabelfromDropDown () {
	
	labelCountry.value = dropdown.options[dropdown.selectedIndex].text;

	$('#dropdown').hide();
	getCoutryId();
}

});





function getPortID() {
	console.log('getportID function');
	//TODO
}

function clearLabel () {
	labelCountry.value = "";
}


