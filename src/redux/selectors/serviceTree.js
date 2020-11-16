import { createSelector } from 'reselect';
import { getFilteredData } from './results';

const getUnits = state => state.serviceTree.serviceTreeUnits.data;
const getSettings = state => state.settings;
const getSelectedServices = state => state.serviceTree.serviceTree.selected;
const getFetchedServices = state => state.serviceTree.serviceTree.services;


const checkParents = (services, selectedServices, node) => {
  // This recursive function checks if any parent or grandparent node is selected
  const serviceNode = services.find(service => service.id === node);
  if (!serviceNode || !serviceNode.parent) return false;
  if (selectedServices.some(service => service === serviceNode.parent)) {
    return true;
  }
  return checkParents(services, selectedServices, node.parent);
};

const getSelectedServiceTreeUnits = createSelector(
  [getUnits, getSelectedServices, getFetchedServices],
  (units, selectedServices, services) => {
    if (!selectedServices.length) return [];

    const filteredUnits = units.filter(unit => unit.service_nodes.some((node) => {
      if (selectedServices.some(i => i === node.id || i === node.root)) {
        return true;
      }
      if (checkParents(services, selectedServices, node.id)) {
        return true;
      }
      return false;
    }));
    return filteredUnits;
  },
);

export const getServiceTreeUnits = createSelector(
  [getSelectedServiceTreeUnits, getSettings],
  (units, settings) => {
    const data = getFilteredData(units, null, settings);
    return data;
  },
);

export default { getServiceTreeUnits };
