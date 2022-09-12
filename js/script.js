"use strict";

const API_KEY = "at_lDWHjeYx2yxf0TMCOwcJoqq9WtXnf";
;
let map = null;

export async function geolocationIp(valueSearch, searchRequest) {
  let url = "";
  let objectIp = null;
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
    if (response.status === 200) {
      objectIp = await response.json();
      if (map === null) {
        map = initMap(
          objectIp.location.lat,
          objectIp.location.lng,
          objectIp.location
        );
        markerMap(
          objectIp.location.lat,
          objectIp.location.lng,
          objectIp.location
        );
      } else {
        setMap(objectIp.location.lat, objectIp.location.lng, objectIp.location);
      }
    }
    //limited request 1000
    if(response.status === 403) {
      alert(
        "I apologize but my plan to use the location API and free, and that limits me to only 1000 query request, if you are seeing this message, my limit is probably already reached. :("
      );
    }
    return objectIp;
  } catch (error) {
    //domain ou ip addres não existe, correponse ao formato mas não existe
    alert(
      "There was an error fetching related information or IP address provided to your domain. " +
        error
    );
  }
}

function initMap(lat, lng, location) {
  let mapElement = document.querySelector(".map");
  let mapLocal = L.map(mapElement).setView([lat, lng], 16);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  }).addTo(mapLocal);
  return mapLocal;
}

function setMap(lat, lng, location) {
  map.setView([lat, lng], 16);
  markerMap(lat, lng, location);
}

function markerMap(lat, lng, location) {
  let iconMarker = L.icon({
    iconUrl: "./images/icon-location.svg",
    iconSize: [48, 58],
  });
  let marker = L.marker([lat, lng], {
    icon: iconMarker,
    alt: `Ip or domain localization in Country ${location.country} from region ${location.region} in city ${location.city}`,
  }).addTo(map);
}
