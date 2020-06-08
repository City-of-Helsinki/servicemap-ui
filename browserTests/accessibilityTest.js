/* eslint-disable */
import axeCheck from 'axe-testcafe';
import config from './config';

const { server } = config;

const axeOptions = { rules: { 'label': { enabled: false } } };

const axeCheckHandler = (t) => {
  return axeCheck(t, null, axeOptions)
}

fixture`TestCafe Axe test: frontpage`
  .page`http://${server.address}:${server.port}/fi/`;

test('Automated accessibility testing', async (t) => {
  await axeCheckHandler(t);
});

fixture`TestCafe Axe test: search page`
  .page`http://${server.address}:${server.port}/fi/search?q=kirjasto`;

test('Automated accessibility testing', async (t) => {
  await axeCheckHandler(t);
});

fixture`TestCafe Axe test: unit page`
  .page`http://${server.address}:${server.port}/fi/unit/8215`;

test('Automated accessibility testing', async (t) => {
  await axeCheckHandler(t);
});

fixture`TestCafe Axe test: service page`
  .page`http://${server.address}:${server.port}/fi/service/813`;

test('Automated accessibility testing', async (t) => {
  await axeCheckHandler(t);
});

fixture`TestCafe Axe test: address page`
  .page`http://${server.address}:${config.server.port}/fi/address/helsinki/Fleminginkatu/1`;

test('Automated accessibility testing', async (t) => {
  await axeCheckHandler(t);
});

fixture`TestCafe Axe test: area page`
  .page`http://${server.address}:${config.server.port}/fi/area`;

test('Automated accessibility testing', async (t) => {
  await axeCheckHandler(t);
});

// This page expires when the event is done
fixture`TestCafe Axe test: event page`
  .page`http://${server.address}:${server.port}/fi/event/helmet:190724`;

test('Automated accessibility testing', async (t) => {
  await axeCheckHandler(t);
});