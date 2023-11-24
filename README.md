
<h1 align="center">


  <br>
 

  <a href="https://imtaqin.id"> <img src="https://logos-world.net/wp-content/uploads/2022/04/OLX-Logo.png" width="300"></a>
  
# OLX Unofficial Client API
[![License: GPL-3.0 license](https://img.shields.io/github/license/fdciabdul/WhatsApp-Cloud-API-Wrapper?style=plastic)](https://opensource.org/licenses/Artistic-2.0)
[![npm version](https://badge.fury.io/js/wacloudapi.svg)](https://badge.fury.io/js/discord.js)[![Open Source Love svg2](https://badges.frapsoft.com/os/v2/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)


Unofficial Scraper API for OLX.CO.ID 



## Installation

You can install the package using npm or Yarn:

```bash
npm install olx-scraper
```
or

```bash
yarn add olx-scraper
```
## Usage

### Logging in

To log in to OLX:

```javascript
const { OLXClient } = require("olx-scraper");
const client = new OLXClient('your-email@example.com', 'your-password');

client.loginOLX().then(response => {
    console.log(response);
}).catch(error => {
    console.error(error);
});
```

### Fetching User Data

Retrieve user data from OLX by user ID:

```javascript
client.getUserData(userId, cookie).then(userData => {
    console.log(userData);
}).catch(error => {
    console.error(error);
});
```

### Getting Categories

Get a list of categories available on OLX:

```javascript
client.getCategory().then(categories => {
    console.log(categories);
}).catch(error => {
    console.error(error);
});
```

### Searching by Category

Search for listings in a specific category:

```javascript
client.searchbyCategory(categoryId, locationId).then(searchResults => {
    console.log(searchResults);
}).catch(error => {
    console.error(error);
});
```

### Searching for Locations

Search for locations on OLX:

```javascript
client.searchLocation('location-query').then(locations => {
    console.log(locations);
}).catch(error => {
    console.error(error);
});
```

