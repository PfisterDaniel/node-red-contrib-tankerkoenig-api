# <img src="https://github.com/PfisterDaniel/node-red-contrib-tankerkoenig-api/blob/main/nodes/icons/petrol.svg" width="60"> [node-red](http://nodered.org)-contrib-tankerkoenig-api
Node-RED node to receive actual petrol prices (Tankerkoenig.de/Tankerkönig api).

**Remark:** Only valid for petrol stations in Germany.

Node-RED nodes for calling up fuel prices (Tankerkoenig.de/Tankerkönig api) for petrol stations in Germany.
The prices E5, E10 and diesel are output for defined petrol stations.

**Note:** [Registration](https://creativecommons.tankerkoenig.de/api-key) for an API KEY is required.

## Installation
[![NPM](https://nodei.co/npm/node-red-contrib-tankerkoenig-api.png)](https://npmjs.org/package/node-red-contrib-tankerkoenig-api)

[![Current Release](https://img.shields.io/github/v/release/PfisterDaniel/node-red-contrib-tankerkoenig-api.svg?colorB=4cc61e)](https://github.com/PfisterDaniel/node-red-contrib-tankerkoenig-api/releases/latest)

Install from your Node-RED Manage Palette

or

Install using npm

    $ npm install node-red-contrib-tankerkoenig-api

Redmatic:

    $ source /usr/local/addons/redmatic/home/.profile
    $ cd /usr/local/addons/redmatic/var
    $ npm install --save --no-package-lock --global-style --save-prefix="~" --production node-red-contrib-tankerkoenig-api



#### Available nodes:
| Node | Inputs | Outputs | Description |
| ------ | ------ | ------ | ------ |
| Tankerkönig Prices (Input)     | 1 | 1 | Node-RED node to get a list of gasoline prices at specific gas stations (find the cheapest and most expensive gas station) |
| Tankerkönig Prices (Interval)  | 0 | 1 | Node-RED node to get a regular list of gasoline prices for specific gas stations (find the cheapest and most expensive gas station) |
| Tankerkönig List (Interval)    | 0 | 1 | Node-RED node to get a list of petrol stations and their petrol prices within a certain radius on a regular basis (find the cheapest and most expensive gas station) |
| Tankerkönig Details (Interval) | 0 | 1 | Node-RED node to periodically receive information of a particular gas station |


#### Example Outputs:
Node: Tankerkönig Prices
```yaml
    {
        "timestamp":1607447447266,
        "date":"08.12.2020",
        "time":"18:10",
        "cheapest":{
            "name":"HEM (Seukendorf)",
            "isOpen":true,
            "patroltype":"e5",
            "price":1.239
        },
        "most_expensive":{
            "name":"Shell Station (Cadolzburg)",
            "isOpen":true,
            "patroltype":"e5",
            "price":1.249
        },
        "payload":[
            {
                "name":"Shell Station (Cadolzburg)",
                "isOpen":true,
                "patroltype":"e5",
                "price":1.249
            },
            {
                "name":"HEM (Seukendorf)",
                "isOpen":true,
                "patroltype":"e5",
                "price":1.239
            }
        ]
    }
 ```
Node: Tankerkönig List
```yaml
    {
        "timestamp":1607448138760,
        "date":"08.12.2020",
        "time":"18:22",
        "payload":[
            {
                "id":"519c486f-e2ce-4af2-94de-0d05e8ef4e5b",
                "name":"Shell Cadolzburg Nuernberger Str. 41",
                "brand":"Shell",
                "street":"Nuernberger Str.",
                "place":"Cadolzburg",
                "lat":49.463629,
                "lng":10.859763,
                "dist":0,
                "diesel":1.059,
                "e5":1.249,
                "e10":1.199,
                "isOpen":true,
                "houseNumber":"41",
                "postCode":90556
            },
            {
                "id":"037ee9bb-b22e-4527-bd82-6da4032cc214",
                "name":"Seukendorf, Röteweg 2",
                "brand":"HEM",
                "street":"Röteweg",
                "place":"Seukendorf",
                "lat":49.483692,
                "lng":10.873313,
                "dist":2.4,
                "diesel":1.049,
                "e5":1.239,
                "e10":1.189,
                "isOpen":true,
                "houseNumber":"2",
                "postCode":90556
            }
        ]
    }
 ```
 Node: Tankerkönig Details
```yaml
    {
        "timestamp":1607448323341,
        "date":"08.12.2020",
        "time":"18:25",
        "payload":{
            "id":"037ee9bb-b22e-4527-bd82-6da4032cc214",
            "name":"Seukendorf, Röteweg 2",
            "brand":"HEM",
            "street":"Röteweg",
            "houseNumber":"2",
            "postCode":90556,
            "place":"Seukendorf",
            "openingTimes":[
                {
                    "text":"Mo-Fr",
                    "start":"05:00:00",
                    "end":"22:00:00"
                },
                {
                    "text":"Samstag, Sonntag, Feiertag",
                    "start":"06:00:00",
                    "end":"22:00:00"
                }
            ],
            "overrides":[
                
            ],
            "wholeDay":false,
            "isOpen":true,
            "e5":1.239,
            "e10":1.189,
            "diesel":1.049,
            "lat":49.483692,
            "lng":10.873313,
            "state":"deBY"
        }
    }    
 ```
 

## Bugs and feature requests
Please create an issue in [GitHub](https://github.com/PfisterDaniel/node-red-contrib-tankerkoenig-api/issues)
