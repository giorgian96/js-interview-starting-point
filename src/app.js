import fetch from "node-fetch";

// API urls and token
const BASE_API_URL = 'https://blue-bottle-api-test.herokuapp.com';
const GET_COFFEE_SHOPS = '/v1/coffee_shops';
const GET_TOKEN = '/v1/tokens';
let keyRefreshed = false;

/**
 * @param {Object} position
 * @param {Number} position.x
 * @param {Number} position.y
 * 
 * @returns {Array<position>}
 */
export async function getNearestShops(position) {
  if (!validateValues(position.x, position.y)) {
    // The values are invalid, stop execution
    return [];
  }

  let coffeeShops = await getCoffeeShops();
  let distanceToCoffeeShops = [];

  if (coffeeShops.length > 0) {
    for (const coffeeShop of coffeeShops) {
      distanceToCoffeeShops.push({
        name: coffeeShop.name,
        distance: (Math.sqrt((coffeeShop.x - position.x) ** 2 + (coffeeShop.y - position.y) ** 2)).toFixed(4)
      });
    }

    distanceToCoffeeShops = distanceToCoffeeShops.sort(compareDistances).slice(0, 3);
  }

  return distanceToCoffeeShops;
}

async function getCoffeeShops(apiKey = '') {
  if(apiKey === ''){
    apiKey = await retrieveNewToken();
  }  

  console.log("Getting the coffee shops...");
  let response = await fetch(`${BASE_API_URL}${GET_COFFEE_SHOPS}?token=${apiKey}`);

  if (response.ok) {
    return await response.json();
  } else {
    console.error(`Could not retrieve data. Error code: ${response.status}`);

    if (!keyRefreshed) {
      console.log("Getting a new token and trying again...");
      apiKey = await retrieveNewToken();

      if (apiKey !== '') {
        keyRefreshed = true;
        return await getCoffeeShops(apiKey);
      }
    } else {
      console.log("Data could not be retrieved, please wait a few seconds and try again.");
      return [];
    }
  }
}

async function retrieveNewToken() {
  let response = await fetch(`${BASE_API_URL}${GET_TOKEN}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  if (response.ok) {
    return (await response.json()).token;
  } else {
    console.error(`Could not retrieve a new token. Error code: ${response.status}`);
    return '';
  }
}

function validateValues(latitude, longitude) {
  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    console.error("The latitude and longitude need to be numbers");
    return false;
  } else if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
    console.error("The latitude should be between -90 and 90 degrees, also the longitude between -180 and 180");
    return false;
  } else {
    return true;
  }
}

function compareDistances(a, b) {
  if (parseFloat(a.distance) < parseFloat(b.distance)) {
    return -1;
  } else if (parseFloat(a.distance) > parseFloat(b.distance)) {
    return 1;
  } else {
    return 0;
  }
}