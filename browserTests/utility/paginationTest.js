import { ClientFunction, Selector } from 'testcafe';
import { getLocation } from '.';

export default (pageUrl) => {
  test('Keyboard navigation is OK', async (t) => {

    const pagination = Selector('[data-sm="PaginationComponent"]');
    const previousPageButton = pagination.find('#PaginationPreviousButton');
    const nextPageButton = pagination.find('#PaginationNextButton');
    const buttons = pagination.find('button');
    await t
      // Click next page button
      .click(nextPageButton)
      // Focus is lost to start of the page after button click
      // Pagination moves focus to p element with tabindex -1 which doesn't seem to work
      // with testCafe tests but works on live version
      .expect(getLocation()).contains(pageUrl)
      .expect(getLocation()).contains('p=2')
    ;

    const focusNextButton = await ClientFunction(() => document.getElementById('PaginationNextButton').focus());
    await focusNextButton();

    // Check keyboard navigation
    await t
      .pressKey('shift+tab') // Move back to previous page button
      .expect(previousPageButton.focused).ok()
      .pressKey('tab') // next page button
      .expect(nextPageButton.focused).ok()
      .pressKey('tab') // 1st page button
      .expect(buttons.nth(2).focused).ok()
      // Tab to 3rd page element since 2nd is active and tabindex -1
      .pressKey('tab') // 3 page button
      .expect(buttons.nth(4).focused).ok()
      .pressKey('enter')
      .expect(getLocation()).contains('p=3')
    ;
  });
  
  test('Pagination attributes change correctly', async (t) => {
    const pagination = Selector('[data-sm="PaginationComponent"]');
    const buttons = pagination.find('button');
    const previousPageButton = pagination.find('#PaginationPreviousButton');
    const nextPageButton = pagination.find('#PaginationNextButton');
    await t
      .expect(previousPageButton.getAttribute('tabindex')).eql('-1')
      .expect(previousPageButton.getAttribute('disabled')).eql('')
      .click(nextPageButton)
      .expect(previousPageButton.getAttribute('disabled')).notOk()
      .expect(previousPageButton.getAttribute('tabindex')).eql('0')
    ;
  
    await t
      // Expect page id to exists in url
      .expect(getLocation()).contains(pageUrl)
      .expect(getLocation()).contains('p=2')
      // Expect 2nd page element to be set active and have related attributes
      .expect(buttons.nth(3).getAttribute('disabled')).eql('')
      .expect(buttons.nth(3).getAttribute('tabindex')).eql('-1')
      // Click 3rd page element
      .click(buttons.nth(4))
      .expect(getLocation()).contains('p=3')
      // Expect 2nd page element to reset attributes
      .expect(buttons.nth(3).getAttribute('disabled')).notOk()
      .expect(buttons.nth(3).getAttribute('tabindex')).eql('0')
      // Expect 3rd page element to be set active and have related attributes
      .expect(buttons.nth(4).getAttribute('disabled')).eql('')
      .expect(buttons.nth(4).getAttribute('tabindex')).eql('-1')
    ;
  });
  
  test('Pagination\'s page change focuses correctly', async(t) => {
    const focusTarget = Selector('#PaginatedListFocusTarget');
    const pagination = Selector('[data-sm="PaginationComponent"]');
    const buttons = pagination.find('button');
  
    await t
      .click(buttons.nth(3))
      // Focus target should be focused
      .expect(focusTarget.focused).ok()
      // Focus target should be screen reader text with pagination information
      .expect(focusTarget.innerText).contains('sivu 2 kautta')
    ;
  });

  test('Pagination\'s page defaults correctly', async(t) => {
    const pagination = Selector('[data-sm="PaginationComponent"]');
    // 4th button is second page element
    const secondPageElement = pagination.find('button').nth(3);
    const location = await getLocation();
    const url = new URL(location);
    url.searchParams.set('p', '2');

    await t
      .navigateTo(url.toString())
      // Expect second page to be out of tabindex because it's active
      .expect(secondPageElement.getAttribute('tabindex')).eql('-1')
      // Expect second page to be disabled because it's active
      .expect(secondPageElement.getAttribute('disabled')).eql('')
    ;
  });
}

