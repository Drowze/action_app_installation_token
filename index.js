import { createAppAuth } from '@octokit/auth-app';
import {
  getInput, info, setFailed, setOutput, setSecret,
} from '@actions/core';

const appId = getInput('app_id', { required: true });
const privateKey = getInput('app_private_key', { required: true });
const installationId = getInput('installation_id', { required: true });
const repositoryNames = getInput('repository_names');

const app = createAppAuth({
  appId,
  privateKey,
});

app({
  type: "installation",
  repositoryNames
}).then((response) => {
  const { token, createdAt, expiresAt } = response;
  setSecret(token);
  setOutput('token', token);
  info(`Token created at ${createdAt} and expiring at ${expiresAt}`)
}).catch((error) => {
  if (typeof error === 'string' || error instanceof Error) {
    setFailed(error);
  } else {
    setFailed(`Caught error of unexpected type: ${typeof error}`);
  }
});
