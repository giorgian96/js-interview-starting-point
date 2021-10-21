import { getNearestShops } from './app.js';

let position = {
    x: parseInt(process.argv[2]),
    y: parseInt(process.argv[3])
}

let coffeeShops = await getNearestShops(position);
for(let coffeeShop of coffeeShops){
    console.log(`${coffeeShop.name}, ${coffeeShop.distance}`);
}