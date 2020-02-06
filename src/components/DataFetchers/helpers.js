/* eslint-disable camelcase */
import { parseSearchParams } from '../../utils';

export const searchParamData = (location, redirectNode, includeService = false) => {
  const searchParams = parseSearchParams(location.search);

  const {
    q,
    category,
    city,
    municipality,
    service,
    service_node,
    bbox,
    level,
  } = searchParams;

  const options = {};
  if (q) {
    options.q = q;
  } else {
    // Handle bbox and level
    if (bbox) {
      const nLevel = level || 'customer_service'; // Taken from old servicemap
      if (nLevel === 'none') {
        return null;
      }
      options.level = nLevel;
      // Swapping latLngs
      const bboxParts = bbox.split(',');
      options.bbox = [bboxParts[1], bboxParts[0], bboxParts[3], bboxParts[2]].join(',');
      options.bbox_srid = 4326;
      return options;
    }
    // Parse service
    if (includeService && service) {
      options.service = service;
    }

    // Parse service_node
    if (service_node) {
      options.service_node = service_node;
    }
    if (!includeService && redirectNode) {
      options.service_node = redirectNode;
    }

    if (category) {
      const data = category.split(',');

      // Parse services
      const services = data.reduce((result, item) => {
        if (item.indexOf('service:') === 0) {
          result.push(item.split(':')[1]);
        }
        return result;
      }, []);

      if (services.length) {
        options.service = services.join(',');
      }

      // Parse serviceNodes
      const serviceNodes = data.reduce((result, item) => {
        if (item.indexOf('service_node:') === 0) {
          result.push(item.split(':')[1]);
        }
        return result;
      }, []);

      if (serviceNodes.length) {
        options.service_node = serviceNodes.join(',');
      }
    }
  }

  // Parse municipality
  if (municipality || city) {
    options.municipality = municipality || city;
  }


  return options;
};

export const reverseBBoxCoordinates = (bbox) => {
  const bboxParts = bbox.split(',');
  return [bboxParts[1], bboxParts[0], bboxParts[3], bboxParts[2]];
};
