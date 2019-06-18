import isClient from './index';

const APP_KEY = 'SM';


class LocalStorageUtility {
  storage;

  static setStorage() {
    if (isClient() && !this.storage) {
      this.storage = window.localStorage;
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

    const data = this.storage.getItem(this.generateKey(key));
    return data;
  }

  static saveItem(key, value) {
    this.setStorage();
    if (!this.storage) {
      return;
    }

    try {
      this.storage.setItem(this.generateKey(key), value);
    } catch (e) {
      throw new Error(`Error saving data: key: ${key}, value: ${value}`, e.message);
    }
  }
}

export default LocalStorageUtility;
