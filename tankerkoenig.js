var request = require('request')

module.exports = function(RED) {

	/**
	 * Define Constanten
	 */
	const RootLink_List = "https://creativecommons.tankerkoenig.de/json/list.php?"
	const RootLink_Prices = "https://creativecommons.tankerkoenig.de/json/prices.php?";
	const RootLink_Details = "https://creativecommons.tankerkoenig.de/json/detail.php?";

	/**
	 * Format Date to Time hh:mm
	 * @param {Javascript Date} date 
	 */
	function formatTime(date) {
		var hours = date.getHours();
		var minutes = date.getMinutes();
		hours = hours < 10 ? '0' + hours : hours;
		minutes = minutes < 10 ? '0'+minutes : minutes;
		var strTime = hours + ':' + minutes;
		return strTime;
	}

	/**
	 * Format Date to String (Format: dd.mm.yyyy)
	 * @param {Javascript Date} date 
	 */
	function formatDate(date) {
		var day = date.getDate();
		var month = date.getMonth()+1;
		day = day < 10 ? '0' + day : day;
		month = month < 10 ? '0'+month : month;
		var strDate = day + '.' + month + "." + date.getFullYear();
		return strDate;
	}

	/**
	 * Function TankerkoenigConfig
	 * @param {Config} config 
	 */
	function TankerkoenigConfig(config) {
		RED.nodes.createNode(this, config);
        var node = this;
        node.key = this.credentials.key; 	
	}

	

	/**
	 * Function TankerkoenigPricesWithInput
	 * @param {Config} config 
	 */
	function TankerkoenigPricesWithInput(config) {
		RED.nodes.createNode(this, config);
        var node = this;
        this.credentials = RED.nodes.getNode(config.account);
		this.on('input', function(msg) {

			var date = new Date();

			if(config.stations.length > 0){
				
				//Build Request-Link
				var reqUrl = RootLink_Prices + "ids=" + config.stations.map(function(elem){
					return elem.id;
				}).join(",") + "&apikey=" + this.credentials.key;
				
				//Run Request
				request(reqUrl, function(error, response, body) {
					try {
						var resp = JSON.parse(body)
						if (error) {
							node.error(error)
						} else if (resp.status === 'error') {
							node.error(resp.message)
						} else {
							var GasStations = [];
							msg.timestamp = date.getTime();
							msg.date = formatDate(date);
							msg.time = formatTime(date);
							config.stations.forEach(function(item){
								var Station;
								var IsOpenState = false;
								if(resp.prices[item.id].status == "open"){
									IsOpenState = true;
								}
								if(config.petroltype == "all"){
									Station = { "name": item.name, "isOpen": IsOpenState, "prices": { "e5" : resp.prices[item.id].e5, "e10": resp.prices[item.id].e10, "diesel": resp.prices[item.id].diesel }};
								}else{
									Station = { "name": item.name, "isOpen": IsOpenState, "patroltype": config.petroltype, "price": resp.prices[item.id][config.petroltype]};
								}
								GasStations.push(Station);
							}); 
							if(config.petroltype != "all") {
								var min = GasStations.reduce(function(res, station) {
									return (station.price < res.price && station.price != null) ? station : res;
								});
								var max = GasStations.reduce(function(res, station) {
									return (station.price > res.price && station.price != null) ? station : res;
								});
								msg.cheapest = min;
								msg.most_expensive = max;
							}
							msg.payload = GasStations;
							node.send(msg);
						}
					} catch(error) {
							node.error(error)
					}
				})
			}else{
				node.error("No Station-IDs were given!")
			}		
		})
	}
	/**
	 * Function TankerkoenigPricesWithInterval
	 * @param {Config} config 
	 */
	function TankerkoenigPricesWithInterval(config) {
		RED.nodes.createNode(this, config);
        var node = this;
		this.credentials = RED.nodes.getNode(config.account);
		this.repeat = config.triggerInterval;
		this.interval_id = null;

		this.interval_id = setInterval( function() {
            node.emit("input",{});
        }, this.repeat );

		this.on('input', function(msg) {

			var date = new Date();

			if(config.stations.length > 0){
				
				//Build Request-Link
				var reqUrl = RootLink_Prices + "ids=" + config.stations.map(function(elem){
					return elem.id;
				}).join(",") + "&apikey=" + this.credentials.key;
				

				//Run Request
				request(reqUrl, function(error, response, body) {
					try {
						var resp = JSON.parse(body)
						if (error) {
							node.error(error)
						} else if (resp.status === 'error') {
							node.error(resp.message)
						} else {
							var GasStations = [];
							msg.timestamp = date.getTime();
							msg.date = formatDate(date);
							msg.time = formatTime(date);
							config.stations.forEach(function(item){
								var Station;
								var IsOpenState = false;
								if(resp.prices[item.id].status == "open"){
									IsOpenState = true;
								}
								if(config.petroltype == "all"){

									Station = { "name": item.name, "isOpen": IsOpenState, "prices": { "e5" : resp.prices[item.id].e5, "e10": resp.prices[item.id].e10, "diesel": resp.prices[item.id].diesel }};
								}else{
									Station = { "name": item.name, "isOpen": IsOpenState, "patroltype": config.petroltype, "price": resp.prices[item.id][config.petroltype]};
								}
								GasStations.push(Station);
							});
							if(config.petroltype != "all") {
								var min = GasStations.reduce(function(res, station) {
									return (station.price < res.price && station.price != null) ? station : res;
								});
								var max = GasStations.reduce(function(res, station) {
									return (station.price > res.price && station.price != null) ? station : res;
								});
								msg.cheapest = min;
								msg.most_expensive = max;
							}
							msg.payload = GasStations;
							node.send(msg);
						}
					} catch(error) {
							node.error(error)
					}
				})
				
			}else{
				node.error("No Station-IDs were given!")
			}
		})
	
		this.on("close", function() {
            if (this.interval_id !== null) {
                clearInterval(this.interval_id);
            }
        });

        node.emit("input",{});    
	}
	/**
	 * Function TankerkoenigListWithInterval
	 * @param {Config} config 
	 */
	function TankerkoenigListWithInterval(config) {
		RED.nodes.createNode(this, config);
        var node = this;
		this.credentials = RED.nodes.getNode(config.account);
		this.repeat = config.triggerInterval;
		this.interval_id = null;

		this.interval_id = setInterval( function() {
            node.emit("input",{});
        }, this.repeat );

		this.on('input', function(msg) {

			var date = new Date();

	
			//Build Request-Link
			var reqUrl = RootLink_List + "lat=" + config.lat + "&lng=" + config.lon + "&rad=" + config.radius + "&type=" + config.petroltype + "&sort=dist&apikey=" + this.credentials.key;
			
			//Run Request
			request(reqUrl, function(error, response, body) {
				try {
					var resp = JSON.parse(body)
					if (error) {
						node.error(error)
					} else if (resp.status === 'error') {
						node.error(resp.message)
					} else {
						msg.timestamp = date.getTime();
						msg.date = formatDate(date);
						msg.time = formatTime(date);

						if(resp.stations.length > 0){
							if(config.petroltype != "all") {
								var min = resp.stations.reduce(function(res, station) {
									return (station.price < res.price && station.price != null) ? station : res;
								});
								var max = resp.stations.reduce(function(res, station) {
									return (station.price > res.price && station.price != null) ? station : res;
								});
								msg.cheapest = min;
								msg.most_expensive = max;
							}

							msg.payload = resp.stations.slice(0, 10)
							node.send(msg);
						}else{
						msg.payload = "No stations found in this radius";
						node.send(msg);
						}
					}
				} catch(error) {
						node.error(error)
				}
			})
		})
	
		this.on("close", function() {
            if (this.interval_id !== null) {
                clearInterval(this.interval_id);
            }
        });

        node.emit("input",{});    
	}
	/**
	 * Function TankerkoenigDetailsWithInterval
	 * @param {Config} config 
	 */
	function TankerkoenigDetailsWithInterval(config) {
		RED.nodes.createNode(this, config);
        var node = this;
		this.credentials = RED.nodes.getNode(config.account);
		this.repeat = config.triggerInterval;
		this.interval_id = null;

		this.interval_id = setInterval( function() {
            node.emit("input",{});
        }, this.repeat );

		this.on('input', function(msg) {

			var date = new Date();

			//Build Request-Link
			var reqUrl = RootLink_Details + "id=" + config.stationid + "&apikey=" + this.credentials.key;
			
			//Run Request
			request(reqUrl, function(error, response, body) {
				try {
					var resp = JSON.parse(body)
					if (error) {
						node.error(error)
					} else if (resp.status === 'error') {
						node.error(resp.message)
					} else {
						msg.timestamp = date.getTime();
						msg.date = formatDate(date);
						msg.time = formatTime(date);
						msg.payload = resp.station;
						node.send(msg);
					}
				} catch(error) {
						node.error(error)
				}
			})
		})
	
		this.on("close", function() {
            if (this.interval_id !== null) {
                clearInterval(this.interval_id);
            }
        });

        node.emit("input",{});    
	}


	/**
	 * Register Nodes
	 */
	RED.nodes.registerType('node-red-tankerkoenig-config', TankerkoenigConfig,{
        credentials: {
            key: {type:"password"}
        }
    });
	RED.nodes.registerType('node-red-tankerkoenig-prices-with-interval', TankerkoenigPricesWithInterval);
	RED.nodes.registerType('node-red-tankerkoenig-prices-with-input', TankerkoenigPricesWithInput);
	RED.nodes.registerType('node-red-tankerkoenig-list-with-interval', TankerkoenigListWithInterval);
	RED.nodes.registerType('node-red-tankerkoenig-details-with-interval', TankerkoenigDetailsWithInterval);

}
