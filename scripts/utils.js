import { execSync } from 'child_process'

export const getGitTag = () => {
  try {
    return execSync('git describe --abbrev=0 --tags', { cwd: '.' })
      .toString()
      .replace(/\r?\n|\r/g, '')
  } catch (error) {
    return 'no-tag'
  }
}

export const getGitCommit = () => {
  try {
    return execSync('git rev-parse --short HEAD', { cwd: '.' })
      .toString()
      .trim()
  } catch (error) {
    return 'unknown'
  }
}
