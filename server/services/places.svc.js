"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
let googleMapsClient = require('@google/maps').createClient({
    key: `${process.env.GOOGLE_WEB_SERVICES_KEY}`,
    Promise: Promise
});
function getCoords(query) {
    return googleMapsClient.geocode({
        address: query.address
    }).asPromise()
        .then((response) => {
        query.lat = response.json.results[0].geometry.location.lat;
        query.lng = response.json.results[0].geometry.location.lng;
        return hasCoords(query);
    })
        .catch((error) => {
        console.log(error);
    });
}
exports.getCoords = getCoords;
;
function hasCoords(query) {
    let convertedKeywords = convert(query.keywords);
    const url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + query.lat + "," + query.lng + "&radius=" + query.radius + "&type=" + query.type + convertedKeywords + "&opennow=true&key=" + process.env.GOOGLE_PLACES_KEY;
    return axios_1.default.get(url)
        .then(results => {
        return getArrayDetails(results.data.results.map((element) => {
            return element.place_id;
        }));
    })
        .catch(error => {
        console.log(error);
    });
}
exports.hasCoords = hasCoords;
function convert(keywords) {
    if (keywords.length > 0) {
        let gKeywords = "&keyword=";
        for (let i = 0; i < keywords.length; i++) {
            if (i === keywords.length - 1) {
                gKeywords += keywords[i];
            }
            else {
                gKeywords += `${keywords[i]},`;
            }
        }
        return gKeywords;
    }
    else {
        return '';
    }
}
;
function getArrayDetails(places) {
    let promiseList = shuffle(places).slice(0, 9).map((element) => {
        return getPlaceDetails(element);
    });
    return Promise.all(promiseList)
        .then(values => {
        return values;
    });
}
function getPlaceDetails(placeId) {
    const url = "https://maps.googleapis.com/maps/api/place/details/json?placeid=" + placeId + "&key=" + process.env.GOOGLE_PLACES_KEY;
    return axios_1.default.get(url)
        .then(response => {
        // console.log(response.data.result)
        let placeDetail = {
            place_id: response.data.result.place_id,
            name: response.data.result.name,
            url: response.data.result.url,
            website: response.data.result.website,
            address: response.data.result.formatted_address.slice(0, -11),
            phone: response.data.result.formatted_phone_number,
            lat: response.data.result.geometry.location.lat,
            lng: response.data.result.geometry.location.lng,
            rating: response.data.result.rating,
            price: response.data.result.price_level,
            reviews: response.data.result.reviews,
            photos: response.data.result.photos
        };
        return placeDetail;
    })
        .catch(error => {
        console.log(error);
    });
}
;
function getImage(reference) {
    const url = "https://maps.googleapis.com/maps/api/place/photo?key=" + process.env.GOOGLE_PLACES_KEY + "&maxheight=1600&photoreference=" + reference;
    return axios_1.default.get(url)
        .then(response => {
        return response.data;
    })
        .catch(error => {
        console.log(error);
    });
}
exports.getImage = getImage;
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
function findState(element) {
    return element.types === ["administrative_area_level_1", "political"];
}
