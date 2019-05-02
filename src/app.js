var loader = $("#loader");
var userContent = $("#userContent");
var adminContent = $("#adminContent");
var home = $("#home");
var admin = $("#admin");
var user = $("#user");
var adminCheck = null;
var uicInstance;

App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  //  initialization of Web3 instance provided by metamask
  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {

      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {

      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

// using Deployed contract JSON 
  initContract: function() {
    $.getJSON("UICBuilding.json", function(building) {
      App.contracts.UICBuilding = TruffleContract(building);
      App.contracts.UICBuilding.setProvider(App.web3Provider);
      return App.render();
    });
  },

// Rendering the Account Details
  render: function() {
    loader.show();
    userContent.hide();
    adminContent.hide();
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Account Address: " + account);
      }
    });
    return App.getResults()
  },

// Updating UI for Home View
  home: function(){
    home.show();
    user.hide();
    admin.hide();
  },

// Updating UI for User View
  user: function(){
    home.hide();
    userContent.show();
    admin.hide();
    user.show();
    adminContent.hide();
  },

  // Updating UI for Admin View 
  admin: function(){
    home.hide();
    userContent.hide();
    adminContent.show();
    admin.show();
  },
  
// Loading all the contents
  getResults: function() {
    loader.hide();
    userContent.show();
    adminContent.hide();
    var buildingDetails = $('#buildingDetails');
    var buildingDetailsAdmin = $('#buildingDetailsAdmin');
    buildingDetailsAdmin.empty();
    buildingDetails.empty();

    App.contracts.UICBuilding.deployed().then(function(instance) {
        uicInstance = instance;
        uicInstance.totalBuildings().then(function (obj){return obj.c}).then(function (totalBuildings) {
          // load user content
          for (var i = 1; i <= totalBuildings[0]; i++) {

              uicInstance.building(i).then(function(building) {
                var buildingTemp =  "<tr><td class='text-justify'><button type='button' class='btn btn-info btn-block btn-light' data-toggle='modal' data-target='#myModal' onclick='App.getBuildingDetails( "+ building[0] +" )'>" + building[2] + "</button> </td></tr>";
                buildingDetails.append(buildingTemp);
              })
          }
          // load admin content
          for (var i = 1; i <= totalBuildings[0]; i++) {
                uicInstance.building(i).then(function(building) {
                    var buildingTemp =  "<tr><td class='text-justify'><button type='button' class='btn btn-info btn-block btn-danger' onclick='App.deleteBuilding( "+ building[0] +" )'>" + building[2] + "</button> </td></tr>";
                    buildingDetailsAdmin.append(buildingTemp);
                  })
              }
          })
  })
    return App.checkIsAdmin();
  },

// check if admin or user
  checkIsAdmin: function(){
    var adminButton = $('#adminButton');
    adminButton.attr('disabled','disabled');
    if(adminCheck == null){
           App.contracts.UICBuilding.deployed().then(function(instance) {
            uicInstance = instance;
            uicInstance.checkIsAdmin().then(function (status){
              if(status['receipt']['status']){
                alert('Welcome Admin')
                adminButton.removeAttr('disabled');
                adminCheck = true;
              }else{
                alert('Welcome User');
              }
            })
      });
    }
},

// To delete the building
deleteBuilding: function(index){
   App.contracts.UICBuilding.deployed().then(function(instance) {
      uicInstance = instance;
      uicInstance.removeBuiding(index);
    });  
},

// Getting individual building details
getBuildingDetails: function(index){
  var buildingIdRes = $('#buildingIdRes');
  var buildingNameRes = $('#buildingNameRes');
  var buildingCodeRes = $('#buildingCodeRes');
  var buildingAddressRes = $('#buildingAddressRes');
  var buildingBuiltDateRes = $('#buildingBuiltDateRes');
  var NASFRes = $('#NASFRes');
  var NUSFRes = $('#NUSFRes');
  var GSFRes = $('#GSFRes');
  var categoryRes = $('#categoryRes');
  var regionRes = $('#regionRes');

  buildingIdRes.empty();
  buildingNameRes.empty();
  buildingCodeRes.empty();
  buildingAddressRes.empty();
  buildingBuiltDateRes.empty();
  NASFRes.empty();
  NUSFRes.empty();
  GSFRes.empty();
  categoryRes.empty();
  regionRes.empty();


  App.contracts.UICBuilding.deployed().then(function(instance) {
    uicInstance = instance;

    uicInstance.building(index).then( function(buildingObject) {
      buildingIdRes.append(buildingObject[1]);
      buildingNameRes.append(buildingObject[2]);
      buildingCodeRes.append(buildingObject[3]);
      buildingAddressRes.append(buildingObject[4]);
      buildingBuiltDateRes.append(buildingObject[5]);
      NASFRes.append(buildingObject[6]);
      NUSFRes.append(buildingObject[7]);
      GSFRes.append(buildingObject[8]);
      categoryRes.append(buildingObject[9]);
      regionRes.append(buildingObject[10]);
    })
  })

},

  
// add a new building details
addBuild: function() {
  var index = document.querySelector('#buildingIndex').value;
  var id = document.querySelector('#buildingId').value;
  var name = document.querySelector('#buildingName').value;
  var code = document.querySelector('#buildingCode').value;
  var address = document.querySelector('#buildingAddress').value;
  var builtDate = document.querySelector('#buildingBuiltDate').value;
  var NASF = document.querySelector('#buildingNASF').value;
  var NUSF = document.querySelector('#buildingNUSF').value;
  var GSF = document.querySelector('#buildingGSF').value;
  var category = document.querySelector('#buildingCategory').value;
  var region = document.querySelector('#buildingRegion').value;

  App.contracts.UICBuilding.deployed().then(function(instance) {
      instance.addBuilding(index, id, name, code, address, builtDate, NASF, NUSF, GSF, category, region);
  }).catch(function(err) {
      console.error(err);
    });
  }
};

// Initializing the App.js
$(function() {
  $(window).load(function() {
    App.init();
  });
});

