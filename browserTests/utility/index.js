import { ClientFunction } from 'testcafe';

const config = require('../config');

export const getLocation = ClientFunction(() => document.location.href);

export const getBaseUrl = () => `http://${config.server.address}:${config.server.port}`;
