var SteamUser = require('steam-user');
var SteamStore = require('steamstore');
var SteamTotp = require('steam-totp');
var readlineSync = require('readline-sync');
var fs = require('fs');

var client = new SteamUser();
var user = new SteamUser();
var store = new SteamStore();

var username, password;
var tusername, tpassword, numbr;
var win, lose;
var cookieArray = {};

win = 0;
lose = 0;
client.logOn();

client.on('loggedOn', function(details) {
  //console.log('>> Successfully logged onto Steam anonmyously.');
  //console.log('>> Beginning process of account creation:');
  createAccount();
});


user.on('loggedOn', function(details) {
  console.log('>> Logged onto new account.');
  user.webLogOn();
  verifyEmail();
});

process.stdout.write('\033c')
username = readlineSync.question('Username: ');
process.stdout.write('\033c')
password = readlineSync.question('Password: ');
process.stdout.write('\033c')
var email = readlineSync.question('Email: ');
process.stdout.write('\033c')
numbr = readlineSync.question('Start: ');
process.stdout.write('\033c')

createAccount();

function createAccount() {
	tusername = username + numbr ;
	tpassword = password + numbr;
  client.createAccount(tusername, tpassword, email, function (result) {
    if (result == SteamUser.Steam.EResult.OK) {
		win++;
		process.stdout.write('\033c')
      console.log('Create account:' + win);
	  console.log('Error create:' + lose);
	  savedan();
      initClient();
    } 
	else {
		lose++;
	  process.stdout.write('\033c')
	  console.log('Create account:' + win);
	  console.log('Error create:' + lose);
	  console.log('Last Error: ' + result);
      relog();
    }
  });
}
 
 function initClient() {
  client.logOff();
  //client = null;
  user.logOn({
    'accountName': tusername,
    'password': tpassword
  });
}
 
function verifyEmail() {
  console.log('>> Please complete verification by email sent by Steam.');
  user.requestValidationEmail(function(result) {
    if (result == SteamUser.Steam.EResult.OK) {
		user.logOff();
    } else {
		console.log('>> Error verification email.');
	}
	
  });
}
 
 function relog() {
client = null;
client = new SteamUser();
client.logOn();
client.on('loggedOn', function(details) {
setTimeout(createAccount, 6000);
});
}

function savedan() {
fs.open("list.txt", "a", 0644, function(err, file_handle) {
 fs.write(file_handle, tusername + ":" + tpassword + "\r\n", null, 'ascii', function(err, written) { 
	 });
});
relog()
numbr++;
}