import { Selector } from 'testcafe';

const searchButton = Selector('#ServiceTreeSearchButton');
const accordion = Selector('[data-sm="AccordionComponent"]');
const innerAccordion = (accordion) => accordion.find('div[class*="MuiCollapse-root"] [data-sm="AccordionComponent"]');
const accordionCheckbox = (accordion) => accordion.find('input[type="checkbox"]');

export const treeViewAccordionTest = () => {
  test('Accordions work correctly', async (t) => {
    await t
      .expect(innerAccordion(accordion.nth(0)).count).eql(0, 'Accordion shouldn\'t have child items visible')
      .click(accordion.nth(0).find('button'))
      .expect(innerAccordion(accordion.nth(0)).count).gt(0, 'Accordion should have child items visible after selection')
    ;

    const firstInnerAccordion = innerAccordion(accordion.nth(0));
    await t
      .expect(innerAccordion(firstInnerAccordion).count).eql(0, 'First inner accordion shouldn\'t have child items visible')
      .click(firstInnerAccordion.find('button'))
      .expect(innerAccordion(firstInnerAccordion).count).gt(0, 'First inner accordion should have child items visible after selection')
  });
};

export const treeSearchTest = async (t) => {
  const rootCategory = accordion.nth(1);

  await t
    .expect(searchButton.getAttribute('disabled') !== undefined).ok('Mobility tree search button should be disabled by default')
    .click(rootCategory)
    .click(accordionCheckbox(innerAccordion(rootCategory).nth(1)))
    .click(accordionCheckbox(innerAccordion(rootCategory).nth(2)))
    .expect(searchButton.getAttribute('disabled')).notOk('Search button should be active after selecting services')
    .click(searchButton);
};
