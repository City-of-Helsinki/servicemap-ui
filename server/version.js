const cp = require('child_process');

const ensureSafeDir = () => {
  try {
    const addSafeDir = 'git config --global --add safe.directory /servicemap-ui';
    cp.execSync(addSafeDir, { cwd: '.' });
  } catch (e) {
    console.error('Could not ensure safe dir /servicemap-ui', e);
  }
};

const getLastTag = () => {
  try {
    ensureSafeDir();
    const lastTagCommand = 'git describe --abbrev=0 --tags';
    return cp.execSync(lastTagCommand, { cwd: '.' })
      .toString()
      .replace(/\r?\n|\r/g, '');
  } catch (e) {
    console.error('Repository does not contain tags', e);
    return null;
  }
};

const getTagCommit = (tag) => {
  try {
    ensureSafeDir();
    const tagCommitCommand = `git rev-list --abbrev-commit -n 1 tags/${tag}`;
    return cp.execSync(tagCommitCommand, { cwd: '.' })
      .toString().trim();
  } catch (e) {
    console.error(`Could not query commit of tag ${tag}`, e);
    return '';
  }
};

/**
 * @returns {tag: string, tagCommit: string}, tag is the latest git tag, tagCommit is the short
 * commit hash of the tag.
 */
export const getVersion = () => {
  const lastTag = getLastTag();
  if (lastTag) {
    return { tag: lastTag, tagCommit: getTagCommit(lastTag) };
  }
  return {};
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
