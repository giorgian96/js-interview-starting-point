import { getNearestShops } from './app.js';

let position = {
  x: parseFloat(process.argv[2]),
  y: parseFloat(process.argv[3])
}

let coffeeShops = await getNearestShops(position);

if (coffeeShops.length > 0) {
  for (let coffeeShop of coffeeShops) {
    console.log(`${coffeeShop.name}, ${coffeeShop.distance}`);
  }
}