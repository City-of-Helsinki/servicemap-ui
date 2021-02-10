import booleanEqual from '@turf/boolean-equal';
import booleanWithin from '@turf/boolean-within';
import pointOnFeature from '@turf/point-on-feature';
import area from '@turf/area';

export const groupDistrictData = data => data.reduce((acc, cur) => {
  // Group data by district type and period
  const { start, end } = cur;
  if (start?.includes(2019)) {
    // FIXME: temporary solution to hide older school years
    return acc;
  }
  const period = start && end
    ? `${new Date(start).getFullYear()}-${new Date(end).getFullYear()}`
    : null;
  const currentType = period ? `${cur.type}${period}` : cur.type;
  const duplicate = acc.find(obj => obj.id === currentType);

  if (duplicate) {
    duplicate.data.push(cur);
  } else {
    acc.push({
      id: currentType,
      data: [cur],
      name: cur.type,
      period,
      category: null,
    });
  }
  return acc;
  // TODO: sort by period!
  //   groupedData.sort(
  //     (a, b) => new Date(a[0].start).getFullYear() - new Date(b[0].start).getFullYear(),
  //   );
}, []);

const compareBoundaries = (a, b) => {
  // This function checks if district b is within district a or districts are identical
  if (a.id === b.id || a.start !== b.start || a.end !== b.end) {
    return false;
  }
  if (booleanEqual(a.boundary, b.boundary)) {
    return true;
  }
  // Calculate which area is larger
  const areaA = a.boundary.coordinates.reduce((c, d) => c + area({ type: 'Polygon', coordinates: d }), 0);
  const areaB = b.boundary.coordinates.reduce((c, d) => c + area({ type: 'Polygon', coordinates: d }), 0);
  if (areaA < areaB) {
    return false;
  }

  /* Check if a point on the smaller polygon is found within the larger polygon.
  Array.every and Array.some are used because multipolygons can contain several polygons */
  return b.boundary.coordinates.every((polygon) => {
    const polygonBPoint = pointOnFeature({ type: 'Polygon', coordinates: polygon });
    return a.boundary.coordinates.some((polygon) => {
      const polygonA = { type: 'Polygon', coordinates: polygon };
      return booleanWithin(polygonBPoint, polygonA);
    });
  });
};


export const parseDistrictGeometry = (results) => {
  const data = results.filter(i => i.boundary && i.boundary.coordinates);
  let filteredData = [];
  data.forEach((district) => {
    if (!district.boundary) return;
    // Skip if district is already marked as overlaping with another district
    if (filteredData.some(obj => obj.overlaping
    && obj.overlaping.some(item => item.id === district.id))) {
      return;
    }
    const returnItem = district;
    // TODO: check if category is still needed
    // returnItem.category = category;

    // Combine other districts that are duplicates or within this district
    const overlapingDistricts = data.filter(obj => compareBoundaries(district, obj));

    if (overlapingDistricts.length) {
      returnItem.overlaping = overlapingDistricts;
      // Remove overlaping districts from filtered data if already added
      overlapingDistricts.forEach((obj) => {
        filteredData = filteredData.filter(item => item.id !== obj.id);
      });
    }
    filteredData.push(returnItem);
  });

  return filteredData;
};
