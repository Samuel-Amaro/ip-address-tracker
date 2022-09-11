"use strict";

import {geolocationIp} from "./script.js";

const REGEX_IP =
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const REGEX_DOMAIN =
  /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/;
let btn = document.querySelector(".btn");


//initialize search ip user
function initializeStart() {
    let response = geolocationIp("", "none");
    response.then((data) => {
        setViewResults(data);
    }).catch((err) => {
        console.log("Error fetching information related to your IP address " + err);
    });
}

initializeStart();

function validateInput(value) {
    let searchRequest = "";
    if(value.match(REGEX_IP)?.[0] === value) {
        //corresponse ao formato de endereço ip
        searchRequest = "ip";
    }else if(value.match(REGEX_DOMAIN)?.[0] === value) {
        //correponse ao formato de endereço de domain
        searchRequest = "domain";
    }else{
        //não correponde a formato de endereço ip e nem de dominio
        searchRequest = "none";
    }
    return searchRequest;
}

function handlerClickBtn(event) {
    let value = getValueInput();
    if(value.trim() === '') {
        alert("Please enter an IP address or a domain!");
    }else{
        let result = geolocationIp(value, validateInput(value));
        result.then((data) => {
            if(data === null) {
                alert("Please enter a valid URL or domain.");
            }else{
                setViewResults(data);
            }
        }).catch((reason) => {
            //endereço ip e domain correpondem ao formato, mas não existem
            console.log(
              "Failed to fetch location information related to entered ip address or domain, please check if your entered domain or ip address really exists "
            );
        });
    }
}

btn.addEventListener("pointerdown", handlerClickBtn);

function getValueInput() {
    let input = document.querySelector(".input");
    return input.value;
}

function setViewResults(data) {
    let ipAddress = document.querySelector(".result__ip-addres");
    let location = document.querySelector(".result__location");
    let timezone = document.querySelector(".result__timezone");
    let isp = document.querySelector(".result__isp");
    ipAddress.innerHTML = data.ip;
    location.innerHTML = `${data.location.city}, ${data.location.region} ${data.location.postalCode}`;
    timezone.innerHTML = `UTC ${data.location.timezone}`;
    isp.innerHTML = data.isp;
}

function clearViewResults() {
    let ipAddress = document.querySelector(".result__ip-addres");
    let location = document.querySelector(".result__location");
    let timezone = document.querySelector(".result__timezone");
    let isp = document.querySelector(".result__isp");
    ipAddress.innerHTML = "";
    location.innerHTML = "";
    timezone.innerHTML = "";
    isp.innerHTML = "";
}
