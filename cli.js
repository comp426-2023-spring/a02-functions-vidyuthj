#!/usr/bin/env node

import minimist from "minimist";
import moment from "moment-timezone";
import fetch from "node-fetch";

let args = minimist(process. argv.slice(2));

if(args.h) {
    console.log("Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE\n\t-h            Show this help message and exit.\n\t-n, -s        Latitude: N positive; S negative.\n\t-e, -w        Longitude: E positive; W negative.\n\t-z            Time zone: uses tz.guess() from moment-timezone by default.\n\t-d 0-6        Day to retrieve weather: 0 is today; defaults to 1.\n\t-j            Echo pretty JSON from open-meteo API and exit.")
    process.exit(0);
}



const timezone = moment.tz.guess();


//Use the Command Line inputed time zone or the System guess we have
var current_timezone;
if(args.z ) {
    current_timezone = argv.z;
}
else {
    current_timezone = timezone;
}

//Lat and Long Requirements

// Convert Latitude
if(args.n) {
    var lat_north = Math.round((args.n + Number.EPSILON) *100) / 100;
}
else if(args.s) {
    var lat_south = Math.round((args.s + Number.EPSILON) *100) / 100;
}

// Convert Longitude
if(args.w) {
    var long_west = Math.round((args.w + Number.EPSILON) *100) / 100;
}
else if(args.e) {
    var long_east = Math.round((args.e + Number.EPSILON) *100) / 100;
}

var lat_long_present = ((lat_north && long_east) || (lat_north && long_west) || (lat_south && long_west) || (lat_south && long_east));

if(!lat_long_present) {
    console.log("Lat & Long must be present and in range");
    process.exit(0);
}
var response;
if(args.n && args.w) {
   var result= await fetch("https://api.open-meteo.com/v1/forecast?latitude=" + lat_north + "&longitude=" + long_west + "&timezone=" + current_timezone + "&daily=precipitation_hours");

}
else if(args.n && args.e) {
    var result = await fetch("https://api.open-meteo.com/v1/forecast?latitude=" + lat_north + "&longitude=" + long_east + "&timezone=" + current_timezone + "&daily=precipitation_hours");

}
else if(args.s && args.e) {
    var result = await fetch("https://api.open-meteo.com/v1/forecast?latitude=" + lat_south + "&longitude=" + long_east + "&timezone=" + current_timezone + "&daily=precipitation_hours");

}
else if(args.s && args.w) {
    var result = await fetch("https://api.open-meteo.com/v1/forecast?latitude=" + lat_south + "&longitude=" + long_west + "&timezone=" + current_timezone + "&daily=precipitation_hours");

}


const requested_data = await response.json();

if(args.j) {
    console.log(requested_data);
    process.exit(0);
}


