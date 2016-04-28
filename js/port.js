var PortData = function() {

	var q = JSON.parse(localStorage.localData).UNLOCODE.country;

	/*
	It is a bit strange and I dont really understand it yet, but here how it works.

	If there are no ports in a country (e.g. Andorra) we will get an 'undefined' when looking up port
	Therefore the outer loop, so we will not search in countries without ports.

	Now if there is only ONE port in a country strange things are happening.
	Then the type of port is 'Object' instead of Array. Problem is these ports will give
	an error when looping (but checking for 'undefined' will not work). 
	Therefore second inner loop will seperate these ports by getting array.length.

	But it works :) */

	this.findById = function(id) {
		var res = [];
		var message = '';
	
		for (p in q) {		//loop all countries
			if(typeof q[p].port != 'undefined') {	//Check countries with port only

				if(q[p].port.length > 0) {				 //Countries with more then one port

					var objCountry = q[p].port;
					for(var s in objCountry) {

						if(objCountry[s].ID == id.toUpperCase()) {
							res.push({
								portName    : objCountry[s].name,
								portId      : objCountry[s].ID,
								countryName : q[p].name,
								countryId   : q[p].ID
							});
						}
					}
					message = '\xA0';
				}

				else { 								//Countries with one port only
					var objPort = q[p].port;
					if(objPort.ID == id.toUpperCase()) {
						res.push({
							portName    : objCountry[s].name,
							portId      : objCountry[s].ID,
							countryName : q[p].name,
							countryId   : q[p].ID
						});
					}
					message = '\xA0';
				}
			}
		}
		
		if(res.length == 0) { //huhu, no ports found
			res = '';
			message = 'No port found with ' + id.toUpperCase()
		}

		return {
			data: res,
			message: message
		}
	}

	this.findByName = function(searchKey) {
			var res = [];
			var message = '';

			//loop all countries
			for (p in q) {
				if(typeof q[p].port != 'undefined') {	//Check countries with port only

					if(q[p].port.length > 0) {				 //Countries with more then one port

						var objCountry = q[p].port;
						for(var s in objCountry) {
							if(objCountry[s].name.indexOf(searchKey.toUpperCase()) != -1) {

								res.push({
									portName		: objCountry[s].name,
									portId      : objCountry[s].ID,
									countryName : q[p].name,
									countryId   : q[p].ID,									
								});							
							}
						}
					}


					else { 															//Countries with one port only
						var objPort = q[p].port;
						if(objPort.name.indexOf(searchKey.toUpperCase()) != -1) {
							res.push({
								portName    : objPort.name,
								portId      : objPort.ID,
								countryName : q[p].name,
								countryId   : q[p].ID							
							});
						}
					}
				}
			}

			if(res.length == 0) { //huhu, no ports found
				res = '';
				message = 'Port ' + searchKey.toUpperCase() + ' not found';
			}

			return {
				data: res,
				message: message
			}
	}
}




