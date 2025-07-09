/* eslint-disable camelcase */
import { parseSearchParams } from '../../utils';

export const reverseBBoxCoordinates = (bbox) => {
  const bboxParts = bbox.split(',');
  return [bboxParts[1], bboxParts[0], bboxParts[3], bboxParts[2]];
};

export const searchParamFetchOptions = (
  location,
  redirectNode,
  includeService = false
) => {
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

    if (options.service || options.service_node) {
      return options;
    }

    // Handle bbox and level
    if (bbox) {
      const nLevel = level || 'none';
      if (nLevel !== 'none') {
        options.level = nLevel;
        // Swapping latLngs
        options.bbox = reverseBBoxCoordinates(bbox).join(',');
        options.bbox_srid = 4326;
      }
    }
  }

  // Parse municipality
  if (municipality || city) {
    options.municipality = municipality || city;
  }

  return options;
};
