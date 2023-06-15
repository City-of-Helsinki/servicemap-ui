const cp = require('child_process');

const getLastTag = () => {
  try {
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
    const lastCommitCommand = 'git rev-parse --short HEAD';
    return cp.execSync(lastCommitCommand, { cwd: '.' }).toString().trim();
  } catch (e) {
    console.error('Cannot read last commit hash', e);
    return '';
  }
};
