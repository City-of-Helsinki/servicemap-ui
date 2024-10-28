import { ClientFunction, Selector } from 'testcafe';

const config = require('../config');

export const getLocation = ClientFunction(() => document.location.href);

export const getBaseUrl = () => `http://${config.server.address}:${config.server.port}`;

export const acceptCookieConcent = async (t) => {
  if (t) {
    const cookieConsentApproveButton = Selector('button[data-testid="cookie-consent-approve-button"]');
    await t
      .expect(cookieConsentApproveButton.exists).ok('Cookie consent approve button should exist')
      .click(cookieConsentApproveButton);
  }
}