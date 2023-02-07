#!/usr/bin/env node

import minimist from "minimist";
import moment from "moment-timezone";
import fetch from "node-fetch";

let argv = minimist(process. argv.slice(2));

if(argv.h) {
    console.log("Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE\n\t-h            Show this help message and exit.\n\t-n, -s        Latitude: N positive; S negative.\n\t-e, -w        Longitude: E positive; W negative.\n\t-z            Time zone: uses tz.guess() from moment-timezone by default.\n\t-d 0-6        Day to retrieve weather: 0 is today; defaults to 1.\n\t-j            Echo pretty JSON from open-meteo API and exit.")
    process.exit(0);
}



const timezone = moment.tz.guess();


//Use the Command Line inputed time zone or the System guess we have
var current_timezone;
if(argv.z ) {
    current_timezone = argv.z;
}
else {
    current_timezone = timezone;
}

//Lat and Long Requirements
var lat;
var long;
if(argv.n) {
    lat = argv.n;
}
else {
   lat = (argv.s * -1);
}

if(argv.e) {
    long = argv.e;
}
else {
   long = (argv.w * -1);
}

var result= await fetch("https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + long + "&timezone=" + current_timezone + "&daily=precipitation_hours");

const requested_data = await result.json();

if(argv.j) {
    console.log(requested_data);
    process.exit(0);
}

const num_days = argv.d;

if(num_days == 0) {
    var certain_day = "today.";
}
else if(num_days > 1) {
    var certain_day = "in " + num_days + " days.";
}
else {
    var certain_day = "tomorrow.";
}

if(num_days && num_days != 1) {
    var rain_forecast = requested_data.daily.precipitation_hours[num_days];
    if(rain_forecast == 0) {
        console.log("You probably won't need your galoshes" + certain_day);
    }
    else {
        console.log("You might want to be your galoshes" + certain_day);
    }
}
else {
    var rain_forecast = requested_data.daily.precipitation_hours[1];
    if(rain_forecast == 0) {
        console.log("You probably won't need your galoshes" + certain_day);
    }
    else {
        console.log("You might want to be your galoshes" + certain_day);
    }
}


