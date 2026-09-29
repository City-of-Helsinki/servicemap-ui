import isClient from './index';
import { isEmbed } from './path';

const APP_KEY = 'SM';

class LocalStorageUtility {
  storage = null;

  static setStorage() {
    if (!isClient()) {
      return;
    }

    // Embedded views must not use storage, since the embedding site
    // shows no cookie consent banner
    if (isEmbed()) {
      this.storage = null;
      return;
    }

    try {
      if (!this.storage) {
        this.storage = window.localStorage;
      }
    } catch {
      // Error while setting storage
      // Can be caused by blocked cookies
      this.storage = null;
    }
  }

  static generateKey(key) {
    return `${APP_KEY}:${key}`;
  }

  static getItem(key) {
    this.setStorage();
    if (!this.storage) {
      return null;
    }

    return this.storage.getItem(this.generateKey(key));
  }

  static saveItem(key, value) {
    this.setStorage();
    if (!this.storage) {
      return;
    }

    try {
      this.storage.setItem(this.generateKey(key), value);
    } catch (e) {
      throw new Error(
        `Error saving data: key: ${key}, value: ${value}`,
        e.message
      );
    }
  }
}

export default LocalStorageUtility;
