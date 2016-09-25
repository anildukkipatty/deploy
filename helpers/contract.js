var User = require('../models/User');
var fs = require('fs');
var erisC = require("eris-contracts");
module.exports = function (accountData, ip) {
  if(!ip) ip = "13.75.47.219";
  var erisdbURL = "http://"+ip+":1337/rpc";
  var promise = new Promise (function (resolve, reject) {
    var contractData = require('../../.eris/apps/ckyc/epm.json');
    var kycContractAddress = contractData["deployCkyc"];
    var kycAbi = JSON.parse(fs.readFileSync("../.eris/apps/ckyc/abi/" + kycContractAddress));
    var contractsManager = erisC.newContractManagerDev(erisdbURL, accountData);
    var contract = contractsManager.newContractFactory(kycAbi).at(kycContractAddress);
    resolve(contract);
  });

  return promise;
}
