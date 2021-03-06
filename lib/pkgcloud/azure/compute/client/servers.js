/*
 * servers.js: Instance methods for working with servers from Azure Cloud
 *
 * (C) Microsoft Open Technologies, Inc.
 *
 */
var async = require('async'),
  base     = require('../../../core/compute'),
  pkgcloud = require('../../../../../lib/pkgcloud'),
  errs     = require('errs'),
  azureApi = require('../../utils/azureApi'),
  compute  = pkgcloud.providers.azure.compute;

//
// ### function getVersion (callback)
// #### @callback {function} f(err, version).
//
// Gets the current API version
//
exports.getVersion = function getVersion(callback) {
  callback(null, this.version);
};

//
// ### function getLimits (callback)
// #### @callback {function} f(err, version).
//
// Gets the current API limits
//
exports.getLimits = function getLimits(callback) {
  return errs.handle(
    errs.create({ message: "Azure's API is not rate limited" }),
    callback
  );
};

//
// ### function getServers (callback)
// #### @callback {function} f(err, servers). `servers` is an array that
// represents the servers that are available to your account
//
// Lists all servers available to your account.
//
exports.getServers = function getServers(callback) {
  var self = this,
    servers = [];

  azureApi.getServers(this, function(err, results) {
    if(err) {
      callback(err);
    } else {
      results.forEach(function(server) {
        servers.push(new compute.Server(self, server))
      });
      callback(null, servers)
    }
  });
};

//
// ### function getServer(server, callback)
// #### @server {Server|String} Server id or a server
// #### @callback {Function} f(err, serverId).
//
// Gets a server in Azure.
//
exports.getServer = function getServer(server, callback) {
  var self     = this,
    serverId = server instanceof base.Server ? server.id : server;

  azureApi.getServer(this, serverId, function(err, server) {
    if(err) {
      callback(err);
    } else {
      callback(null, new compute.Server(self, server));
    }
  });
};

//
// ### function createServer (options, callback)
// #### @opts {Object} **Optional** options
// ####    @name     {String} **Optional** the name of server
// ####    @image    {String|Image} the image (AMI) to use
// ####    @flavor   {String|Flavor} **Optional** flavor to use for this image
// #### @callback {Function} f(err, server).
//
// Creates a server with the specified options. The flavor
// properties of the options can be instances of Flavor
// OR ids to those entities in Azure.
//
exports.createServer = function createServer(options, callback) {
  var self = this;

  if (typeof options === 'function') {
    callback = options;
    options  = {};
  }

  options = options || {}; // no args

  azureApi.createServer(this, options, function(err, server) {
    if(err) {
      callback(err)
    } else {
      callback(null, new compute.Server(self, server));
    }
  });
};

//
// ### function destroyServer(server, callback)
// #### @server {Server|String} Server id or a server
// #### @callback {Function} f(err, serverId).
//
// Destroy a server in Azure.
//
exports.destroyServer = function destroyServer(server, callback) {
  var serverId = server instanceof base.Server ? server.id : server;

  azureApi.destroyServer(this, serverId, function(err, res) {
    if(err) {
      console.log(err);
      if(callback) {
        callback(err);
      }
    } else {
      if(callback) {
        callback(null, { ok: serverId });
      }
    }
  });
};

//
// ### function stopServer(server, callback)
// #### @server {Server|String} Server id or a server
// #### @callback {Function} f(err, serverId).
//
// Destroy a server in Azure.
//
exports.stopServer = function stopServer(server, callback) {
  var serverId = server instanceof base.Server ? server.id : server;

  azureApi.stopServer(this, serverId, function(err, res) {
    if(err) {
      callback(err);
    } else {
      callback(null, { ok: serverId });
    }
  });
};

//
// ### function createHostedService(serviceName, callback)
// #### @serviceName {String} name of the Hosted Service
// #### @callback {Function} f(err, serverId).
//
// Creates a Hosted Service in Azure.
//
exports.createHostedService = function createHostedService(serviceName, callback) {

  azureApi.createHostedService(this, serviceName, function(err, res) {
    if(err) {
      callback(err);
    } else {
      callback(null, res);
    }
  });
};

//
// ### function rebootServer (server, options, callback)
// #### @server   {Server|String} The server to reboot
// #### @callback {Function} f(err, server).
//
// Reboots a server
//
exports.rebootServer = function rebootServer(server, callback) {
  var serverId = server instanceof base.Server ? server.id : server;

  azureApi.rebootServer(this, serverId, function(err, res) {
    if(err) {
      callback(err);
    } else {
      callback(null, { ok: serverId });
    }
  });
};

//
// ### function renameServer(server, name, callback)
// #### @server {Server|String} Server id or a server
// #### @name   {String} New name to apply to the server
// #### @callback {Function} f(err, server).
//
// Renames a server
//
exports.renameServer = function renameServer(server, name, callback) {
  return errs.handle(
    errs.create({ message: 'Not supported by Azure.' }),
    callback
  );
};
