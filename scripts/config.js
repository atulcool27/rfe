//var url='http://localhost:8080';
var url='https://racekon.herokuapp.com';

var homeurl='https://racekonindustries.in/';
//var homeurl='http://localhost:5500/';

var dashboard = "/bill.html";
var tempDate = new Date();
var previousTokenKey= new Date(tempDate.setDate(tempDate.getDate()-1)).toLocaleDateString("en-US");
var currentTokenValue=localStorage.getItem(new Date().toLocaleDateString("en-US"));
var currentTokenKey = new Date().toLocaleDateString("en-US")