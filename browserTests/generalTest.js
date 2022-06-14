/* eslint-disable */
import { Selector, ClientFunction } from 'testcafe';
import { waitForReact } from 'testcafe-react-selectors';

import config from './config';
const { server } = config;

const page = `http://${server.address}:${server.port}/fi/`;

fixture`General test`
  .page`${page}`
  .beforeEach(async () => {
    await waitForReact();
  });

test('ToolMenu does close correctly', async (t) => {
  const toolMenu = Selector('#ToolMenuButton');
  const toolMenuItems = Selector('#ToolMenuPanel span[role="link"]');

  // Test esc does work correctly
  await t
    .click(toolMenu)
    .expect(toolMenuItems.exists).ok('ToolMenuPanel should exist and have items')
    .pressKey('esc') // Pressing esc on ToolMenuButton should close menu
    .expect(toolMenuItems.exists).notOk('ToolMenuPanel should not exist after pressing esc on ToolMenuButton')
    .click(toolMenu)
    .expect(toolMenuItems.exists).ok('ToolMenuPanel should exist and have items')
    .pressKey('tab') // Tab to first element
    .pressKey('esc') // Pressing esc while focused on menu item should close the panel
    .expect(toolMenuItems.exists).notOk('ToolMenuPanel should not exists after closing panel')
  ;

  // Test that ToolMenuPanel does close automatically when moving focus away from panel
  await t
    .click(toolMenu)
    .expect(toolMenuItems.exists).ok('ToolMenuPanel should exist and have items')
    .pressKey('tab') // Tab to first element
    .pressKey('shift+tab') // Tab backwards to ToolMenuButton should close menu
    .expect(toolMenuItems.exists).notOk('ToolMenuPanel should not exists after moving focus out of ToolMenuPanel')
    // Moving past all the items should also close the menu
    .click(toolMenu)
    .expect(toolMenuItems.exists).ok('ToolMenuPanel should exist and have items')
    .pressKey('tab') // Tab to first element
    .pressKey('tab') // Tab to second element
    .pressKey('tab') // Tab to third element
    .pressKey('tab') // Tab to fourth element
    .expect(toolMenuItems.exists).ok('ToolMenuPanel should exist and have items')
    .pressKey('tab') // Tab outside of ToolMenuPanel which should close the menu
    .expect(toolMenuItems.exists).notOk('ToolMenuPanel should not exists after moving focus out of ToolMenuPanel')
  ;

  // Moving focus out of ToolMenuButton while panel is open should close panel
  await t
    .click(toolMenu)
    .expect(toolMenuItems.exists).ok('ToolMenuPanel should exist and have items')
    .pressKey('shift+tab') // Move focus backwards out of ToolMenuButton to settings buttons
    .expect(toolMenuItems.exists).notOk('ToolMenuPanel should not exists after moving focus out of ToolMenuButton away from panel')
  ;
});

test('ToolMenu should move focus correctly on tool selection', async (t) => {
  const toolMenu = Selector('#ToolMenuButton');
  const toolMenuItems = Selector('#ToolMenuPanel span[role="link"]');

  // Embedder tool selection should move focus correctly
  const embedderCloseButton = Selector('button[aria-label="Sulje upotustyökalu"]');
  await t
    .click(toolMenu)
    .click(toolMenuItems.nth(0)) // Click embedder tool
    .expect(embedderCloseButton.focused).ok('Focus should move to embedder view close button')
    .click(embedderCloseButton)
  ;

  // Embedder tool selection should move focus correctly
  const downloadDialogCloseButton = Selector('button[aria-label="Sulje"]');
  await t
    .click(toolMenu)
    .click(toolMenuItems.nth(1)) // Click download tool
    .expect(downloadDialogCloseButton.focused).ok('Focus should move to download dialog close button')
    .click(downloadDialogCloseButton)
  ;

  // Embedder tool selection should move focus correctly
  const printToolCloseButton = Selector('button[aria-label="Sulje näkymä"]');
  await t
    .click(toolMenu)
    .click(toolMenuItems.nth(2)) // Click download tool
    .expect(printToolCloseButton.focused).ok('Focus should move to print tool\'s close button')
    .click(printToolCloseButton)
  ;

  // Measuring tool selection should move focus correctly
  const measuringCloseButton = Selector('#MeasuringStopButton');
  await t
    .click(toolMenu)
    .click(toolMenuItems.nth(3)) // Click measuring tool
    .expect(measuringCloseButton.focused).ok('Focus should move to #MeasuringStopButton')
  ;
});
