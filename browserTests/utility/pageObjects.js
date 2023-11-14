import { ClientFunction, Selector } from 'testcafe';

export const setLocalStorageItem = ClientFunction((key, value) => window.localStorage.setItem(key, value));

export const mapToolsButton = Selector('[data-sm="ToolMenuButton"]');
export const embedderToolButton = Selector('#EmbedderToolMenuButton');
export const embedderToolCloseButton = Selector('[data-sm="EmbedderToolCloseButton"]');
export const feedbackButton = Selector('#FeedbackLink');
export const infoButton = Selector('#PageInfoLink');
export const accordionSelector = '[data-sm="AccordionComponent"]';

export const searchBarInput = Selector('#SearchBar input');

export const settingsMenuPanel = '#SettingsMenuPanel';
export const sensesDropdown = '[data-sm="senses-setting-dropdown"]';
export const mobilityDropdown = '[data-sm="mobility-setting-dropdown"]';
export const cityDropdown = '[data-sm="cities-setting-dropdown"]';
export const organisationDropdown = '[data-sm="organizations-setting-dropdown"]';
export const settingsMenuButton = Selector('[data-sm="SettingsMenuButton"]');

export const ESPOO_ORG = '520a4492-cb78-498b-9c82-86504de88dce';
export const HELSINKI_ORG = '83e74666-0836-4c1d-948a-4b34a8b90301';
