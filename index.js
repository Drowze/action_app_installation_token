import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';
import {
  getInput, info, setFailed, setOutput, setSecret,
} from '@actions/core';

const appId = getInput('app_id', { required: true });
const privateKey = getInput('app_private_key', { required: true });
const installationId = getInput('installation_id', { required: true });
const repositoryIds = getInput('repository_ids');

const appOctokit = new Octokit({
  authStrategy: createAppAuth,
  auth: {
    appId,
    privateKey,
    installationId,
  },
});

appOctokit.rest.apps.createInstallationAccessToken({
  installation_id: installationId,
  repository_ids: repositoryIds,
}).then((response) => {
  const { token } = response.data;
  setSecret(token);
  setOutput('token', token);
  info('Token generated successfully!');
}).catch((error) => {
  if (typeof error === 'string' || error instanceof Error) {
    setFailed(error);
  } else {
    setFailed(`Caught error of unexpected type: ${typeof error}`);
  }
});
