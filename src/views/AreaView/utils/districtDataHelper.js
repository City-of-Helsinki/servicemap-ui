import area from '@turf/area';
import booleanEqual from '@turf/boolean-equal';
import booleanWithin from '@turf/boolean-within';
import pointOnFeature from '@turf/point-on-feature';

export const dataStructure = [
  // Categorized district data structure
  {
    id: 'health',
    titleID: 'area.list.health',
    districts: [
      {
        id: 'health_station_district',
        searchWords: [
          'terveysasema',
          'terveys- ja hyvinvointialue',
          'terveyskeskus',
          'terkkari',
          'lääkäri',
          'omalääkäri',
          'oma terveydenhoitaja',
          'lähiterveysasema',
          'lähin terveysasema',
        ],
      },
      {
        id: 'maternity_clinic_district',
        searchWords: [
          'neuvolat',
          'neuvola-alueet',
          'omaneuvola',
          'oma neuvola',
        ],
      },
    ],
  },
  {
    id: 'education',
    titleID: 'area.list.education',
    searchWords: [
      'koulu',
      'koulut',
      'koulu ruotsi',
      'ruotsinkieliset koulut',
      'oppilaaksiotto',
      'oppilaaksiottoalueet',
      'koulualueet',
      'oma koulu',
      'lähikoulu',
    ],
    districts: [
      {
        id: 'lower_comprehensive_school_district_fi',
        searchWords: [
          'ala-aste',
          'alakoulu',
          'ala-aste suomi',
          'alakoulu suomi',
        ],
      },
      {
        id: 'lower_comprehensive_school_district_sv',
        searchWords: ['ala-aste', 'ruotsi', 'alakoulu ruotsi'],
      },
      {
        id: 'upper_comprehensive_school_district_fi',
        searchWords: ['yläaste', 'yläkoulu', 'yläaste suomi', 'yläkoulu suomi'],
      },
      {
        id: 'upper_comprehensive_school_district_sv',
        searchWords: ['yläaste ruotsi', 'yläkoulu ruotsi'],
      },
    ],
    subCategories: [
      {
        titleID: 'area.list.education.finnish',
        districts: [
          'lower_comprehensive_school_district_fi',
          'upper_comprehensive_school_district_fi', // TODO: Hmmm
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
    searchWords: ['eskarit', 'esikoulut'],
    districts: [
      {
        id: 'preschool_education_fi',
        searchWords: ['esikoulu', 'esikoulu suomi', 'eskari', 'esiopetus'],
      },
      {
        id: 'preschool_education_sv',
        searchWords: [
          'esikoulu ruotsi',
          'eskari ruotsi',
          'eskari ruotsinkielinen',
          'esiopetus ruotsi',
        ],
      },
    ],
  },
  {
    id: 'geographical',
    titleID: 'area.list.geographical',
    districts: [
      { id: 'neighborhood', searchWords: ['kaupunginosat'] },
      { id: 'postcode_area', searchWords: ['postinumerot'] },
      { id: 'major_district', searchWords: ['suurpiirit'] },
    ],
  },
  {
    id: 'protection',
    titleID: 'area.list.protection',
    searchWords: ['VSS', 'väestönsuojelu'],
    districts: [
      { id: 'rescue_area', searchWords: ['suojelupiirit'] },
      { id: 'rescue_district', searchWords: ['suojelulohkot'] },
      { id: 'rescue_sub_district', searchWords: ['suojelualalohkot'] },
    ],
  },
  {
    id: 'nature',
    titleID: 'area.list.natureConservation',
    districts: [
      {
        id: 'nature_reserve',
        searchWords: ['luonnonsuojelualueet', 'luonnonsuojelu'],
      },
    ],
  },
  {
    id: 'parking',
    titleID: 'area.list.parking',
    districts: [
      {
        id: 'resident_parking_zone',
        searchWords: ['asukaspysäköinti', 'tunnuksellinen pysäköinti'],
      },
      { id: 'parking_payzone', searchWords: ['maksuvyöhykkeet'] },
    ],
  },
];

// Get geographical districts
export const geographicalDistricts = dataStructure
  .find((obj) => obj.id === 'geographical')
  .districts.map((obj) => obj.id);
// Get category districts by id
export const getCategoryDistricts = (id) =>
  dataStructure.find((obj) => obj.id === id)?.districts.map((obj) => obj.id) ||
  [];
// Get category by district id
export const getDistrictCategory = (districtId) =>
  dataStructure.find((obj) =>
    obj.districts.some((area) => area.id === districtId)
  )?.id;

const parkingUnitCategories = [
  { municipality: 'helsinki', serviceNode: '531' },
  { municipality: 'vantaa', serviceNode: '2204' },
  { municipality: 'vantaa', serviceNode: '2207' },
];

export const parkingUnitCategoryIds = parkingUnitCategories.map(
  (x) => `${x.municipality}-${x.serviceNode}`
);

export const groupDistrictData = (data) => {
  const groupedData = data.reduce((acc, cur) => {
    // Group data by district type and period
    const { start, end } = cur;
    if (start?.includes(2020)) {
      // FIXME: temporary solution to hide older school years
      return acc;
    }
    let period;

    if (cur.extra?.schoolyear) {
      period = cur.extra.schoolyear;
    } else {
      period =
        start && end
          ? `${new Date(start).getFullYear()}-${new Date(end).getFullYear()}`
          : null;
    }
    const currentType = period ? `${cur.type}${period}` : cur.type;
    const duplicate = acc.find((obj) => obj.id === currentType);

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
    (a, b) =>
      new Date(a.data[0].start).getFullYear() -
      new Date(b.data[0].start).getFullYear()
  );

  // Sort by data structure order
  const categoryOrder = dataStructure.flatMap((obj) =>
    obj.districts.map((area) => area.id)
  );
  groupedData.sort(
    (a, b) => categoryOrder.indexOf(a.name) - categoryOrder.indexOf(b.name)
  );

  return groupedData;
};

const compareBoundaries = (a, b) => {
  // This function checks if district b is within district a or districts are identical

  if (
    a.id === b.id ||
    a.start !== b.start ||
    a.end !== b.end ||
    a.extra?.schoolyear !== b.extra?.schoolyear
  ) {
    return false;
  }
  if (booleanEqual(a.boundary, b.boundary)) {
    return true;
  }
  // Calculate which area is larger
  const areaA = a.boundary.coordinates.reduce(
    (c, d) => c + area({ type: 'Polygon', coordinates: d }),
    0
  );
  const areaB = b.boundary.coordinates.reduce(
    (c, d) => c + area({ type: 'Polygon', coordinates: d }),
    0
  );
  if (areaA < areaB) {
    return false;
  }

  /* Check if a point on the smaller polygon is found within the larger polygon.
  Array.every and Array.some are used because multipolygons can contain several polygons */
  return b.boundary.coordinates.every((polygon) => {
    const polygonBPoint = pointOnFeature({
      type: 'Polygon',
      coordinates: polygon,
    });
    return a.boundary.coordinates.some((polygon) => {
      const polygonA = { type: 'Polygon', coordinates: polygon };
      return booleanWithin(polygonBPoint, polygonA);
    });
  });
};

export const parseDistrictGeometry = (results) => {
  const data = results.filter((i) => i.boundary && i.boundary.coordinates);
  let filteredData = [];
  data.forEach((district) => {
    if (!district.boundary) return;
    // Skip if district is already marked as overlapping with another district
    if (
      filteredData.some(
        (obj) =>
          obj.overlapping &&
          obj.overlapping.some((item) => item.id === district.id)
      )
    ) {
      return;
    }
    const returnItem = district;

    // Combine other districts that are duplicates or within this district
    const overlappingDistricts = data.filter((obj) =>
      compareBoundaries(district, obj)
    );

    if (overlappingDistricts.length) {
      returnItem.overlapping = overlappingDistricts;
      // Remove overlapping districts from filtered data if already added
      overlappingDistricts.forEach((obj) => {
        filteredData = filteredData.filter((item) => item.id !== obj.id);
      });
    }
    filteredData.push(returnItem);
  });

  return filteredData;
};
