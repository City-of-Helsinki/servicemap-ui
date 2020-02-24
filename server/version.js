var cp = require('child_process');

export const getVersion = () => {
    var lastTag = getLastTag();
    var lastCommit = getLastCommit();

    if (lastTag && tagContainsCommit(lastCommit)) {
      return lastTag.replace(/\r?\n|\r/g, "");
    }
    return '';
}

const getLastTag = () => {
  try {
    var lastTagCommand = 'git describe --abbrev=0 --tags';
    return cp.execSync(lastTagCommand, {cwd: '.'}).toString();
  } catch (e) {
    console.error('Repository does not contain tags');
    return false;
  }
}

export const getLastCommit = () => {
  try {
    var lastCommitCommand = 'git rev-parse --short HEAD';
    return cp.execSync(lastCommitCommand, {cwd: '.'}).toString().trim();
  } catch (e) {
    console.error('Cannot read last commit hash');
    return '';
  }
}

const tagContainsCommit = (commit) => {
  try {
    var compareCommand = 'git tag --contains ' + commit;
    return cp.execSync(compareCommand, {cwd: '.'}).toString().trim().length !== 0;
  } catch (e) {
    console.error('Checking if tag contains commit failed');
    return false;
  }
}
