import { waitForReact } from 'testcafe-react-selectors';
import { Selector } from 'testcafe';
import { getBaseUrl } from '../utility';
import {
  embedderToolButton,
  embedderToolCloseButton,
  feedbackButton,
  infoButton,
  mapToolsButton,
  searchBarInput,
} from '../utility/pageObjects';

/* eslint-disable */

fixture`Navigation home page`
  .page`${getBaseUrl()}/fi`
  .beforeEach(async () => {
    await waitForReact();
  });

test('Should navigate to embedder tool', async (t) => {
  await t
    .click(mapToolsButton)
    .click(embedderToolButton)
    .expect(Selector('[data-sm="EmbedderToolTitle"]').exists).ok();
});

test('Should navigate back to home from embedder tool', async (t) => {
  await t
    .setNativeDialogHandler(() => true)
    .click(mapToolsButton)
    .click(embedderToolButton)
    .click(embedderToolCloseButton)
    .expect(searchBarInput.exists).ok();
});

fixture`Navigation embedder`
  .page`${getBaseUrl()}/fi/embedder`
  .beforeEach(async () => {
    await waitForReact();
  });

test('Should navigate to home page from embedder tool', async (t) => {
  await t
    .setNativeDialogHandler(() => true)
    .click(embedderToolCloseButton)
    .expect(searchBarInput.exists).ok();
});

test.skip('Should navigate to info page from embedder tool', async (t) => {
  await t
    .click(infoButton)
    .expect(Selector('[data-sm="InfoPageTitle"]').exists).ok();
});

test.skip('Should navigate to feedback page from embedder tool', async (t) => {
  await t
    .click(feedbackButton)
    .expect(Selector('[data-sm="FeedbackTitle"]').exists).ok();
});

