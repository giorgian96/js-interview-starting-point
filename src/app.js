import fetch from "node-fetch";

// API urls and token
const BASE_API_URL = 'https://blue-bottle-api-test.herokuapp.com';
const GET_COFFEE_SHOPS = '/v1/coffee_shops';
const GET_TOKEN = '/v1/tokens';
let apiKey = '0510f01c1c6278f159b6b3666bd16d2d';
let keyRefreshed = false;

/**
 * @param {Object} position
 * @param {Number} position.x
 * @param {Number} position.y
 * 
 * @returns {Array<position>}
 */
export async function getNearestShops(position) {
  let nearestShops = await getCoffeeShops();

  if (nearestShops.length > 0) {
    for(const coffeeShop of nearestShops){
      console.log(coffeeShop);
    }
  }

  return [];
}

async function getCoffeeShops() {
  apiKey = await retrieveNewToken();
  let response = await fetch(`${BASE_API_URL}${GET_COFFEE_SHOPS}?token=${apiKey}`);

  if (response.ok) {
    return await response.json();
  } else {
    console.error(`Could not retrieve data. Error code: ${response.status}`);
    if (!keyRefreshed) {
      console.log("Getting a new token and trying again...");
      apiKey = await retrieveNewToken();

      if(apiKey !== ''){
        keyRefreshed = true;
        return await getCoffeeShops();
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