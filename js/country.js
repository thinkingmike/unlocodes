

 	var CountryData = function() {

 		var country = JSON.parse(localStorage.localData).UNLOCODE.country;

 		var thisCountry = function(id) {
 			for(var i = 0, len = country.length ; i < len ; i++) {
 				if(country[i].ID == id.toUpperCase()) {
					return country[i];
 				}
 			}
 		}

 		this.test = function(id) {

 			var isCountry = thisCountry(id) ? thisCountry(id) : false;
 			var res = {};
 			res.countryName = '';
 			var portList = [];
 			var len;


 			if(!isCountry) {		//Country does not exist
 				return res;
 			}

 			res.countryName = isCountry.name;

 			if(!isCountry.port) { 	//Country has no ports
 				return res;
 			}

 			len = isCountry.port.length ? isCountry.port.length : 1;
 			//If country has more then one port , add portlist in loop
 			//if there is only one port set array length to one

 			for(var i = 0, len = isCountry.port.length ; i < len ; i++) {
 				portList.push({
 					portName : isCountry.port.name ,
 					portId : isCountry.port.ID
				})
			}
			res.port = portList;
			return res;
 		},


 		this.findById = function(id) {
 			var res = [];
 			var blnFound = false;
 			var message = '';
 			var countryExist = false;

 			for(var p in country) {
 				if (country[p].ID == id.toUpperCase()) {	//Country found

 					if(typeof country[p].port != 'undefined') {	//Found ports in this country
 						blnFound = true;
		 				var list = country[p].port;

		 				if(typeof list.length == 'undefined') {  //Only one port in this country (see the comment in port.js)
			 				res.push({
		 						portName	  : list.name,
		 						portId			: list.ID,
		 						countryName : country[p].name,
		 						countryId   : country[p].ID
		 					})
		 					message = country[p].name;
		 					countryExist = true;
		 				}

		 				for(var port in list) { //Return list ports in this country
		 					res.push ({
		 						portName	  : list[port].name,
		 						portId			: list[port].ID,
		 						countryName : country[p].name,
		 						countryId   : country[p].ID
		 					})	 					
		 				}
		 				message = country[p].name;
		 				countryExist = true;
		 			}

		 			else { //No ports in this Country
		 					blnFound = true;
	 						res.push({
		 						portName	  : '',
		 						portId			: '',
		 						countryName : country[p].name,
		 						countryId   : country[p].ID
		 					})
						message =  country[p].name + ' , no ports in this country';
		 				countryExist = true;
				 	}
			 	}	
			} //eof For Loop

			if(!blnFound) {
				res = '';
				message = 'There is no country ' + id.toUpperCase();
		 		countryExist = false;
			}

 				return {
					data:res,
					message:message,
					countryExist:countryExist
				};
 		} //eof Function
		
 	}// eof country.js
