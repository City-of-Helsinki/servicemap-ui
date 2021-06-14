import booleanEqual from '@turf/boolean-equal';
import booleanWithin from '@turf/boolean-within';
import pointOnFeature from '@turf/point-on-feature';
import area from '@turf/area';

export const dataStructure = [ // Categorized district data structure
  {
    id: 'health',
    titleID: 'area.list.health',
    districts: [
      'health_station_district',
      'maternity_clinic_district',
    ],
  },
  {
    id: 'education',
    titleID: 'area.list.education',
    districts: [
      'lower_comprehensive_school_district_fi',
      'lower_comprehensive_school_district_sv',
      'upper_comprehensive_school_district_fi',
      'upper_comprehensive_school_district_sv',
    ],
    subCategories: [
      {
        titleID: 'area.list.education.finnish',
        districts: [
          'lower_comprehensive_school_district_fi',
          'upper_comprehensive_school_district_fi',
        ],
      },
      {
        titleID: 'area.list.education.swedish',
        districts: [
          'lower_comprehensive_school_district_sv',
          'upper_comprehensive_school_district_sv',
        ],
      },
    ],
  },
  {
    id: 'preschool',
    titleID: 'area.list.preschool',
    districts: [
      'preschool_education_fi',
      'preschool_education_sv',
    ],
  },
  {
    id: 'geographical',
    titleID: 'area.list.geographical',
    districts: [
      'neighborhood',
      'postcode_area',
    ],
  },
  {
    id: 'protection',
    titleID: 'area.list.protection',
    districts: [
      'rescue_area',
      'rescue_district',
      'rescue_sub_district',
    ],
  },
  {
    id: 'nature',
    titleID: 'area.list.natureConservation',
    districts: [
      'nature_reserve',
    ],
  },
  {
    id: 'parking',
    titleID: 'area.list.parking',
    districts: [
      'resident_parking_zone',
    ],
  },
];

// Get geographical districts
export const geographicalDistricts = dataStructure.find(obj => obj.id === 'geographical').districts;
// Get category districts by id
export const getCategoryDistricts = id => dataStructure.find(obj => obj.id === id)?.districts || [];


export const groupDistrictData = (data) => {
  const groupedData = data.reduce((acc, cur) => {
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
      });
    }
    return acc;
  }, []);

  // Sort by period
  groupedData.sort(
    (a, b) => new Date(a.data[0].start).getFullYear() - new Date(b.data[0].start).getFullYear(),
  );

  // Sort by data structure order
  const categoryOrder = dataStructure.flatMap(obj => obj.districts);
  groupedData.sort((a, b) => categoryOrder.indexOf(a.name) - categoryOrder.indexOf(b.name));

  return groupedData;
};

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
