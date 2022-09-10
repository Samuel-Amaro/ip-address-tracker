"use strict";

const API_KEY = "at_XU2YyLuIScz1hNcDctSp8APQQg0eT";
let mapElement = document.querySelector(".map");
let map = L.map(mapElement);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap",
}).addTo(map);

export async function geolocationIp(valueSearch, searchRequest) {
  let url = "";
  //corresponder a um formato de endereço IP xxx.xxx.xxx.xxx
  if (searchRequest === "ip") {
    url = `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&ipAddress=${valueSearch}`;
    //corresponder a um formato de dominio nomedomain
  } else if (searchRequest === "domain") {
    url = `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&domain=${valueSearch}`;
  } else {
    //obter ip na navegação inicial do user, ou caso o ip ou domain não esteja no formato correto
    url = `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}`;
  }
  try {
    let response = await fetch(url);
    let objectIp = await response.json();
    //console.log(objectIp);
    setMap(objectIp.location.lat, objectIp.location.lng, objectIp.location);
    return objectIp;
  } catch (error) {
    alert("There was an error fetching related information or IP address provided to your domain.");
  }
}

function setMap(lat, lng, location) {
  map.setView([lat, lng], 16);
  markerMap(lat, lng, location);
}

function markerMap(lat, lng, location) {
  let iconMarker = L.icon({
    iconUrl: "./images/icon-location.svg",
    iconSize: [48, 58]
  });
  let marker = L.marker([lat, lng], {icon: iconMarker, alt: `Ip or domain localization in Country ${location.country} from region ${location.region} in city ${location.city}`}).addTo(map);
}
