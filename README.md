# node-red-tankerkoenig
Node-RED node to receive actual petrol prices (Tankerkoenig.de/Tankerkönig api).

**Remark:** Only valid for petrol stations in Germany.

Node-RED nodes for calling up fuel prices (Tankerkoenig.de/Tankerkönig api) for petrol stations in Germany.
The prices E5, E10 and diesel are output for defined petrol stations.

**Note:** [Registration](https://creativecommons.tankerkoenig.de/api-key) for an API KEY is required.

## Installation
[![NPM](https://nodei.co/npm/node-red-tankerkoenig.png)](https://npmjs.org/package/node-red-tankerkoenig)

Install from your Node-RED Manage Palette

or

Install using npm

    $ npm install node-red-tankerkoenig

Redmatic:

    $ source /usr/local/addons/redmatic/home/.profile
    $ /usr/local/addons/redmatic/var
    $ npm install --save --no-package-lock --global-style --save-prefix="~" --production node-red-tankerkoenig



#### Available nodes:
| Node | Inputs | Outputs | Description |
| ------ | ------ |
| Tankerkönig Prices (Input)     | 1 | 1 | Node-RED node to get a list of gasoline prices at specific gas stations |
| Tankerkönig Prices (Interval)  | 0 | 1 | Node-RED node to get a regular list of gasoline prices for specific gas stations |
| Tankerkönig List (Interval)    | 0 | 1 | Node-RED node to get a list of petrol stations and their petrol prices within a certain radius on a regular basis |
| Tankerkönig Details (Interval) | 0 | 1 | Node-RED node to periodically receive information of a particular gas station |