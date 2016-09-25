var User = require('../models/User.js');
var ObjectId = require('mongoose').Types.ObjectId;
var erisdb = require('eris-db');
var bCrypt = require('bcrypt');
var superAgent = require('superagent');

module.exports = function () {

  function create(req, res) {
    User.findOne({'email':req.body.email},function(err, user) {
      // In case of any error return
      if (err){
        console.log('Error in SignUp: '+err);
        return res.sendStatus(500);
      }
      // already exists
      if (user) {
        console.log('User already exists');
        return res.send({message: 'User already exists'}, 409);
      }

      var edb = erisdb.createInstance();
      edb.start(function(error, obj){
        if(!error){
            console.log("Ready to go");
        }
        obj.accounts().genPrivAccount({}, function (error, keyPair) {
          var accountData = keyPair;
          var myKey = req.user.priv_key;
          var myAddress = req.user.address;
          var newKey = accountData.priv_key[1];
          var newAddress = accountData.address;
          obj.txs().send(myKey, newAddress, 1000, {}, function (error, result) {
            if (error) {
              console.log(error);
              return;
            }
            obj.txs().send(newKey, myAddress, 1, {}, function (error, result1) {
              if(error) {
                console.log(error);
                return;
              }
              console.log("Successfully registered new Bank");
              var newUser = new User();
              // set the user's local credentials
              newUser.email = req.body.email;
              newUser.password = createHash(req.body.password);
              newUser.role = 2;
              newUser.name = req.body.name;
              newUser.branch = req.body.branch;
              newUser.address = accountData.address;
              newUser.pub_key = accountData.pub_key[1];
              newUser.priv_key = accountData.priv_key[1];

              // save the user
              newUser.save(function(err) {
                if (err){
                  console.log('Error in Saving user: '+err);
                  throw err;
                }
                res.sendStatus(200);
              });
            })
          });
        });
      });
    });
  }


  function createHash (password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
  }

  function getCount (req, res) {
    // get the contract
    // call the contract
    User.findOne({email: req.params.email}, function (err, bank) {
      if (err) return res.send(err, 500);
      if (! bank) return res.send({message: 'Bank not found'}, 403);

      var accountData = {
        address: req.user.address,
        pubKey:  req.user.pub_key,
        privKey:  req.user.priv_key
      }
      var contractPromise = require('../helpers/contract')(accountData);
      contractPromise.then(function (contract) {
        contract.getMyCount(bank.address, function (err, count) {
          if (err) return res.send(err, 500);
          var cc = count / 4;
          cc = Math.round(cc);
          res.send(cc+"", 200);
        });
      });
    });
  }

  return {
    create: create,
    getCount: getCount
  }
}
