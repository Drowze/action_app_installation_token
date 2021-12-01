"use strict";

var _rest = require("@octokit/rest");

var _authApp = require("@octokit/auth-app");

var _core = require("@actions/core");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var appId = (0, _core.getInput)('app_id', {
  required: true
});
var privateKey = (0, _core.getInput)('app_private_key', {
  required: true
});
var installationId = (0, _core.getInput)('installation_id', {
  required: true
});
var repositoryIds = (0, _core.getInput)('repository_ids');
var appOctokit = new _rest.Octokit({
  authStrategy: _authApp.createAppAuth,
  auth: {
    appId: appId,
    privateKey: privateKey,
    installationId: installationId
  }
});
appOctokit.rest.apps.createInstallationAccessToken({
  installation_id: installationId,
  repository_ids: repositoryIds
}).then(function (response) {
  var token = response.data.token;
  (0, _core.setSecret)(token);
  (0, _core.setOutput)('token', token);
  (0, _core.info)('Token generated successfully!');
})["catch"](function (error) {
  if (typeof error === 'string' || error instanceof Error) {
    (0, _core.setFailed)(error);
  } else {
    (0, _core.setFailed)("Caught error of unexpected type: ".concat(_typeof(error)));
  }
});
