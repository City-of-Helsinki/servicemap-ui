const cp = require('child_process');

const ensureSafeDir = () => {
  try {
    const getSafeDirs = 'git config --global --get-all safe.directory';
    const addSafeDir = 'git config --global --add safe.directory /servicemap-ui';
    const currentSafeDirs = cp.execSync(getSafeDirs, { cwd: '.' }).toString().trim();
    if (!currentSafeDirs.includes('/servicemap-ui')) {
      cp.execSync(addSafeDir, { cwd: '.' });
    }
  } catch (e) {
    console.error('Could not ensure safe dir /servicemap-ui', e);
  }
};

const getLastTag = () => {
  try {
    ensureSafeDir();
    const lastTagCommand = 'git describe --abbrev=0 --tags';
    return cp.execSync(lastTagCommand, { cwd: '.' }).toString();
  } catch (e) {
    console.error('Repository does not contain tags', e);
    return false;
  }
};

export const getVersion = () => {
  const lastTag = getLastTag();
  return lastTag ? lastTag.replace(/\r?\n|\r/g, '') : '';
};

export const getLastCommit = () => {
  try {
    ensureSafeDir();
    const lastCommitCommand = 'git rev-parse --short HEAD';
    return cp.execSync(lastCommitCommand, { cwd: '.' }).toString().trim();
  } catch (e) {
    console.error('Cannot read last commit hash', e);
    return '';
  }
};
