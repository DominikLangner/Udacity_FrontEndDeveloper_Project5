### Travel App

Project 5 of Udacitie's Front End Web Developer Nano Degree.
It showcases the combination of client side and server side code.

This project required the creation of an asynchronous web app that send user input (travel destination & date) to the server side and there querries different Web APIs, where some APIs are chained so that the output from one API is used as an input for the next API.
This relies eavily on promises & use of .then() / async / await.

Received Data is stored in localStorage, so the last result can be displayed again after the apps browser page is closed and opened again.

### Installation

- Install dependencies by running `npm install`:
- create an .env file in your root folder with your API keys for pixabay, geonames & weatherbit:

PIXABAY_API_KEY ='xxxxxxx'
GEONAMES_API_KEY='xxxxxxx'
WEATHERBIT_API_KEY='xxxxxxx'

### Run it

- Start the server side by running `npm run start`
- Start the web app by running `npm run build-dev` --> check your browser

### Deploy it

- Run `npm run build-prod` & check the folder distribution
