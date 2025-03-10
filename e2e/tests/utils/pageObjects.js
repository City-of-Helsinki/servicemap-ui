/* eslint-disable max-classes-per-file */
import { expect } from '@playwright/test';

export class NavigationPage {
  constructor(page) {
    this.page = page;
    this.mapToolsButton = page.locator('[data-sm="ToolMenuButton"]');
    this.embedderToolButton = page.locator('#EmbedderToolMenuButton');
    this.embedderToolCloseButton = page.locator('[data-sm="EmbedderToolCloseButton"]');
    this.feedbackButton = page.locator('#FeedbackLink');
    this.infoButton = page.locator('#PageInfoLink');
    this.searchBarInput = page.locator('#SearchBar input');
    this.embedderToolTitle = page.locator('[data-sm="EmbedderToolTitle"]');
    this.infoPageTitle = page.locator('[data-sm="TitleContainer"]');
    this.feedbackTitle = page.locator('[data-sm="TitleContainer"]');
  }
}

export class GeneralPage {
  constructor(page) {
    this.page = page;
    this.languageButtons = page.locator('header button');
    this.title = page.locator('.app-title');
    this.contrastButton = page.locator('#ContrastLink');
    this.searchbarContainer = page.locator('main .SearchBar');
  }
}

export class EmbeddedView {
  constructor(page) {
    this.page = page;
    this.districtOverlay = page.locator('.leaflet-pane .leaflet-overlay-pane svg');
    this.unitMarkers = page.locator('.unitMarker');
    this.loadingIndicator = page.locator('[data-sm="LoadingIndicator"]');
    this.unitList = page.locator('#paginatedList-embeddedResults [data-sm="UnitItem"]');
    this.unitListItemTitle = page.locator('[data-sm="ResultItemTitle"]');
    this.unitDialogTitle = page.locator('#form-dialog-title');
  }
}

export class MapPage {
  constructor(page) {
    this.page = page;
    this.zoomInButton = page.locator('.zoomIn');
    this.markers = page.locator('.leaflet-marker-icon');
    this.polygon = page.locator('.leaflet-pane .leaflet-overlay-pane svg');
    this.listItem = page.locator('#paginatedList-Toimipisteet-results li[role="link"]').first();
    this.heightProfile = page.locator('.heightgraph svg');
    this.heightProfilePrevButton = page.locator('.height-profile-prev-button');
    this.heightProfileNextButton = page.locator('.height-profile-next-button');
  }
}

export class AddressPage {
  constructor(page) {
    this.page = page;
    this.addressInfo = page.locator('[data-sm="AddressInfo"]');
    this.tabList = page.locator('div[role="tablist"] button');
    this.divisions = page.locator('[data-sm="DivisionItemName"]');
    this.loadingMessage = page.locator('[data-sm="LoadingMessage"]');
    this.noDataMessage = page.locator('[data-sm="NoDataMessage"]');
    this.unitItems = page.locator('[data-sm="UnitItem"]');
    this.zoomOutButton = page.locator('.zoomOut');
    this.unitMarkers = page.locator('.unitMarker, .unitClusterMarker');
    this.areaViewLink = page.locator('#areaViewLink');
    this.addressSearchBar = page.locator('[data-sm="AddressSearchBar"] input');
    this.addressMarker = page.locator('div[class*="AddressMarkerIcon"]');
    this.serviceButtons = page.locator('#tab-content-0 ul button[role="link"]');
    this.unitTitle = page.locator('.TitleText');
    this.backToAddressButton = page.getByRole('link', { name: 'Palaa takaisin' });
    this.nearbyUnitsTab = page.locator('button[role="tab"]').nth(1);
    this.listItems = page.locator('#tab-content-1 li[role="link"]');
    this.paginationNextButton = page.locator('#PaginationNextButton');
    this.links = page.locator('#tab-content-0 a');
  }

  async getListItemTopRowText(index) {
    const listItem = this.listItems.nth(index);
    const topRow = listItem.locator('p[data-sm="ResultItemTitle"]');
    return await topRow.textContent();
  }
}

export class AreaPage {
  constructor(page) {
    this.page = page;
    // Main view elements
    this.areaView = page.locator('[data-sm="AreaView"]');
    this.accordions = page.locator('[data-sm="AccordionComponent"]');
    this.drawerButtons = page.locator('[data-sm="ServiceTabComponent"] [data-sm="AccordionComponent"]');
    this.radioButtons = page.locator('[data-sm="DistrictToggleButton"]');
    this.unitList = page.locator('[data-sm="DistrictUnits"]');
    this.districtList = page.locator('[data-sm="DistrictList"]');
    this.districtDataTitle = page.locator('[data-sm="DistrictUnitsTitle"]');

    // Search elements
    this.addressSearchBar = page.locator('[data-sm="AddressSearchBar"] input');
    this.addressSuggestions = page.locator('#address-results div[role="option"]');
    this.selectedAddressSuggestion = page.locator('[data-sm="AddressSuggestion"].Mui-selected');

    // Statistical area elements
    this.statisticalCityList = page.locator('#StatisticalCityList');
    this.serviceAccordions = page.locator('#StatisticalCityList [data-sm="AccordionComponent"]');
    this.resultItems = page.locator('[data-sm="ResultItemComponent"]');

    // Map tools
    this.mapToolsButton = page.locator('[data-sm="ToolMenuButton"]');
    this.embedderToolButton = page.locator('#EmbedderToolMenuButton');
    this.embedderToolCloseButton = page.locator('[data-sm="EmbedderToolCloseButton"]');
  }

  async openInnerAccordion(element) {
    const accordion = element.locator('[data-sm="AccordionComponent"]').first();
    await accordion.click();
    return accordion;
  }

  async openStatisticalTotals() {
    const statisticalAccordion = this.accordions.nth(2);
    await statisticalAccordion.click();

    const ageAccordion = await this.openInnerAccordion(statisticalAccordion);
    const totalAccordion = await this.openInnerAccordion(ageAccordion);

    return totalAccordion;
  }
}

export class HomePage {
  constructor(page) {
    this.page = page;
    // Navigation buttons
    this.backButton = page.locator('[data-sm="BackButton"]');
    this.areaButton = page.locator('#AreaPage');
    this.servicesButton = page.locator('#ServicePage');
    this.feedbackButton = page.locator('#FeedbackLink');
    this.infoButton = page.locator('#PageInfoLink');

    // Search elements
    this.searchInput = page.locator('#SearchBar input');
    this.searchButton = page.locator('#SearchButton');

    // Markers
    this.unitMarkers = page.locator('.unitMarker');
  }
}

export class SearchPage {
  constructor(page) {
    this.page = page;
    // Search inputs and results
    this.searchInput = page.locator('#SearchBar input');
    this.suggestions = page.locator('#SuggestionList li');
    this.suggestionsOptions = page.locator('#SuggestionList li[role="option"]')
    this.searchButton = page.locator('#SearchButton');
    this.addressInput = page.locator('[data-sm="AddressSearchBar"] input');
    this.resultSorter = page.getByRole('combobox', { name: 'Järjestä hakutulokset:' });
    this.senses = page.locator('[data-sm="senses-setting-dropdown"] .MuiAutocomplete-tag');
    this.mobility = page.locator('[data-sm="mobility-setting-dropdown"] input');

    // Lists and items
    this.listItems = page.locator('#paginatedList-Toimipisteet-results li[role="link"]');
    this.resultList = page.locator('[data-sm="ResultList"]');
    this.suggestions = page.locator('#address-results div[role="option"]');

    // Result list accessibility elements
    this.resultItem = page.locator('#paginatedList-Toimipisteet-results li[role="link"]').first();
    this.resultItemImage = page.locator('#paginatedList-Toimipisteet-results li[role="link"]').first().locator('img');
    this.resultItemSRText = page.locator('#paginatedList-Toimipisteet-results li[role="link"]').first().locator('p').nth(0);
    this.resultItemTitle = page.locator('#paginatedList-Toimipisteet-results li[role="link"]').first().locator('p').nth(1);

    // Tabs
    this.tabs = page.locator('div[role="tablist"] button[role="tab"]');
    this.services = page.locator('#paginatedList-Palvelut-results li[role="link"]');
    this.units = page.locator('#paginatedList-Toimipisteet-results li[role="link"]');
    this.resultList = page.locator('[data-sm="ResultListRoot"] li');

    // Tab accessibility elements
    this.tabList = page.locator('div[role="tablist"]');
    this.tabs = page.locator('div[role="tablist"] button[role="tab"]');

    // Address search elements
    this.addressInput = page.locator('[data-sm="AddressSearchBar"] input');
    this.addressSuggestions = page.locator('#address-results div[role="option"]');
    this.marker = page.locator('div[class*="MarkerIcon"]');
    this.distanceText = page.locator('div[data-sm="ResultItemRightColumn"]');

    // Navigation buttons
    this.cancelButton = page.getByRole('button', { name: 'Tyhjennä hakukenttä' });
    this.searchIconButton = page.getByRole('button', { name: 'Hae' });
    this.addressSearchClear = page.getByRole('button', { name: 'Lisää' });
    this.hideSettings = page.getByRole('button', { name: 'Piilota omat asetukset' });
    this.senseSettings = page.getByRole('combobox', { name: 'Valitse aistirajoitteesi' });
    this.mobilitySettings = page.getByRole('combobox', { name: 'Valitse liikkumisrajoitteesi' });
    this.citySettings = page.getByRole('combobox', { name: 'Valitse kaupunkiasetuksesi' });
    this.organizationSettings = page.getByRole('combobox', { name: 'Valitse palveluntarjoaja' });
    this.resetSettings = page.getByRole('button', { name: 'Tyhjennä kaikki valintani' });

    this.title = page.locator('.TitleText');

    // City settings elements
    this.cityChips = page.locator('[data-sm="cities-setting-dropdown"] .MuiAutocomplete-tag');
    this.kumpulaBath = page.locator('[data-sm="ResultItemTitle"]', { hasText: /^Kumpulan maauimala$/ });
    this.leppavaaraBath = page.locator('[data-sm="ResultItemTitle"]', { hasText: /^Leppävaaran maauimala$/ });
    this.orgChips = page.locator('[data-sm="organizations-setting-dropdown"] .MuiAutocomplete-tag');

    // Constants
    this.ESPOO_ORG = '520a4492-cb78-498b-9c82-86504de88dce';
    this.HELSINKI_ORG = '83e74666-0836-4c1d-948a-4b34a8b90301';
    this.ESPOO_ORG = '520a4492-cb78-498b-9c82-86504de88dce';

    // Settings elements
    this.settingsMenuButton = page.locator('[data-sm="SettingsMenuButton"]');
    this.senseChips = page.locator('#SettingsMenuPanel').locator('[data-sm="senses-setting-dropdown"] .MuiAutocomplete-tag');
    this.mobilityInput = page.locator('#SettingsMenuPanel').locator('[data-sm="mobility-setting-dropdown"] input');

    // Map type radio buttons
    this.mapToolsButton = page.locator('[data-sm="ToolMenuButton"]');
    this.servicemapRadio = page.locator('#servicemap-map-type-radio');
    this.ortographicRadio = page.locator('#ortographic-map-type-radio');
    this.guidemapRadio = page.locator('#guidemap-map-type-radio');
    this.accessibleMapRadio = page.locator('#accessible_map-map-type-radio');
  }

  async setLocalStorage(key, value) {
    await this.page.evaluate(([k, v]) => {
      window.localStorage.setItem(k, v);
    }, [key, value]);
  }

  async searchUnits(search = 'kirjasto') {
    await this.searchInput.click();
    await this.searchInput.press('Meta+A');
    await this.searchInput.press('Delete');
    await this.searchInput.type(search);
    //await this.searchInput.press('Enter');
  }
}

export class ServicePage {
  constructor(page) {
    this.page = page;

    // Service view elements
    this.marker = page.locator('.leaflet-marker-icon > img');
    this.units = page.locator('#paginatedList-events li[role="link"]');
    this.unitTitle = page.locator('.TitleText');
    this.backToServiceButton = page.locator('[data-sm="BackButton"]');
    this.servicePageTitle = page.locator('#view-title');
    this.firstUnitTextbox = this.units.first().locator('p[role="textbox"]');

    // Constants
    this.coordinates = ['60.281936', '24.949933'];
  }

  async getMarkerPosition() {
    return await this.marker.evaluate((element) => {
      const reactInstance = element[Object.keys(element).find(key => key.startsWith('__reactFiber'))];
      return reactInstance.memoizedProps.position;
    });
  }
}

export class SettingsPage {
  constructor(page) {
    this.page = page;

    // Settings menu elements
    this.settingsMenuButton = page.locator('[data-sm="SettingsMenuButton"]');
    this.sensesDropdown = page.locator('[data-sm="senses-setting-dropdown"]');
    this.mobilityDropdown = page.locator('[data-sm="mobility-setting-dropdown"]');
    this.cityDropdown = page.locator('[data-sm="cities-setting-dropdown"]');
    this.organisationDropdown = page.locator('[data-sm="organizations-setting-dropdown"]');

    // Map tools elements
    this.mapToolsButton = page.locator('[data-sm="ToolMenuButton"]');
    this.mapLink3d = page.locator('[data-sm="3dMapLink"]').first();

    // Settings container elements
    this.settingsContainer = page.locator('#SettingsContainer');
    this.checkboxGroup = this.settingsContainer.locator('[aria-labelledby=SenseSettings]');
    this.checkboxes = this.checkboxGroup.locator('input[type=checkbox]');
    this.topSaveButton = this.settingsContainer.locator('button[aria-label="Tallenna"]').first();
    this.bottomSaveButton = this.settingsContainer.locator('button[aria-label="Tallenna asetukset"]').first();
    this.ariaLiveElement = this.settingsContainer.locator('p[aria-live="polite"]').first();
    this.closeButton = this.settingsContainer.locator('button[aria-label="Sulje asetukset"]').nth(1);
    this.title = page.locator('.TitleText');
  }
}

export class UnitExtendedPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.title = page.locator('h3[class*="TitleText"]');
    this.markers = page.locator('.leaflet-pane .unitMarker');

    // Constants
    this.unitName = 'Keskustakirjasto Oodi';
  }
}

export class UnitPage {
  constructor(page) {
    this.page = page;

    // Constants
    this.unitName = 'Keskustakirjasto Oodi';

    // Main elements
    this.unitMarkers = page.locator('.unitMarker');
    this.title = page.locator('h3[class*="TitleText"]');
    this.showMoreEventsButton = page.locator('#UniteventsButton');
    this.feedbackButton = page.locator('#UnitFeedbackButton');
    this.infoLink = page.locator('#FeedbackInfoLink');

    // Additional entrances
    this.additionalEntrances = page.locator('#additional-entrances');
    this.showAccessibilityInfo = page.locator('[data-sm="AdditionalEntranceContent"] button');
    this.tabListButtons = page.locator('div[role="tablist"] button');

    // Tab elements
    this.tabListButtons = page.locator('div[role="tablist"] button');
    this.accessibilityTab = this.tabListButtons.nth(1);
    this.serviceTab = this.tabListButtons.nth(2);

    // Links
    this.infoTabLinks = page.locator('#tab-content-0 li[role="link"]');
    this.accessibilityTabLinks = page.locator('#tab-content-1 li[role="link"]');
    this.eventLinks = page.locator('main li[role="link"]');
    this.backButton = page.locator('[data-sm="BackButton"]');
    this.showMoreEventsButton = page.locator('#UniteventsButton');

    // Accessibility elements
    this.accessibilityInfoContainer = page.locator('[data-sm="InfoContainer"]');
    this.accessibilityShortcomingTitle = page.locator('[data-sm="AccessibilityInfoShortcomingTitle"]');
    this.accessibilityShortcoming = page.locator('[data-sm="AccessibilityInfoShortcoming"]');

    // Services
    this.moreServicesButton = page.locator('#UnitservicesButton');
    this.serviceTitle = page.locator('.ExtendedData-title h3');
    this.backButton = page.locator('[data-sm="BackButton"]');

    // Share
    this.shareButton = page.locator('[data-sm="TitleContainer"] button');
    this.copyLinkButton = page.locator('div[data-sm="DialogContainer"] button p');
  }

  async navigateToService() {
    await this.serviceTab.click();
    await this.moreServicesButton.click();
  }

  async selectAccessibilitySettings() {
    await this.page.click('[data-sm="SettingsMenuButton"]');
    await this.page.click('[data-sm="senses-setting-dropdown"]');
    await this.page.click('[data-sm="senses-hearingAid"]');
    await this.page.click('[data-sm="senses-visuallyImpaired"]');
    await this.page.click('[data-sm="senses-setting-dropdown"]');
    await this.page.click('[data-sm="mobility-setting-dropdown"]');
    await this.page.click('[data-sm="mobility-wheelchair"]');
  }
}

export class BrowserPage {
  constructor(page) {
    this.page = page;
    this.finnishButton = page.locator('header button', { hasText: /^Suomeksi$/ });
    this.englishButton = page.locator('header button', { hasText: /^In English$/ });
    this.swedishButton = page.locator('header button', { hasText: /^På svenska$/ });
    this.title = page.locator('.app-title');
    this.contrastButton = page.locator('#ContrastLink');
    this.searchbarContainer = page.locator('main .SearchBar');
  }

  async getSearchbarColor() {
    return await this.searchbarContainer.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
  }
}

export class ToolMenuPage {
  constructor(page) {
    this.page = page;

    // Tool menu elements
    this.toolMenu = page.locator('[data-sm="ToolMenuButton"]');
    this.toolMenuItems = page.locator('#ToolMenuPanel span[role="link"]');

    // Language buttons
    this.swedishButton = page.locator('header button', { hasText: /^På svenska$/ });

    // Close buttons
    this.embedderCloseButton = page.locator('[data-sm="EmbedderToolCloseButton"]');
    this.downloadDialogCloseButton = page.locator('button[aria-label="Sulje"]');
    this.printToolCloseButton = page.locator('button[aria-label="Sulje näkymä"]');
    this.measuringCloseButton = page.locator('#MeasuringStopButton');
  }

  async clickToolMenuItem(index) {
    await this.toolMenuItems.nth(index).click();
  }

  async pressKey(key) {
    await this.page.keyboard.press(key);
  }
}

export class TreeView {
  constructor(page) {
    this.page = page;
    this.searchButton = page.locator('#ServiceTreeSearchButton');
    this.accordions = page.locator('[data-sm="AccordionComponent"]');
    this.accordion = page.locator('[data-sm="AccordionComponent"]');
    this.getInnerAccordion = (accordion) => accordion.locator('div[class*="MuiCollapse-root"]').locator('[data-sm="AccordionComponent"]');
    this.getAccordionCheckbox = (accordion) => accordion.locator('input[type="checkbox"]');
  }

  async testAccordions() {
    const firstAccordion = this.accordion.nth(0);
    const firstInnerAccordion = this.getInnerAccordion(firstAccordion);

    // Test main accordion
    await expect(this.getInnerAccordion(firstAccordion)).toHaveCount(0, "Accordion shouldn't have child items visible");
    await firstAccordion.locator('button').click();
    await expect(this.getInnerAccordion(firstAccordion)).not.toHaveCount(0);

    // Test inner accordion
    await expect(this.getInnerAccordion(firstInnerAccordion)).toHaveCount(0, "First inner accordion shouldn't have child items visible");
    await firstInnerAccordion.first().locator('button').click();
    await expect(this.getInnerAccordion(firstInnerAccordion)).not.toHaveCount(0);
  }

  async testTreeSearch() {
    const rootCategory = this.accordion.nth(1);
    const innerAccordions = this.getInnerAccordion(rootCategory);

    // Check initial state
    await expect(this.searchButton).toHaveAttribute('disabled', "");

    // Perform selections
    await rootCategory.click();
    await this.getAccordionCheckbox(innerAccordions.nth(1)).click();
    await this.getAccordionCheckbox(innerAccordions.nth(2)).click();

    // Verify and click search
    await expect(this.searchButton).toBeEnabled({ message: 'Search button should be active after selecting services' });
    await this.searchButton.click();
  }
}
