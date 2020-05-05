import { districtFetch } from '../../../utils/fetch';

const SORTED_DIVISIONS = [
  'postcode_area',
  'neighborhood',
  'health_station_district',
  'maternity_clinic_district',
  'income_support_district',
  'lower_comprehensive_school_district_fi',
  'lower_comprehensive_school_district_sv',
  'upper_comprehensive_school_district_fi',
  'upper_comprehensive_school_district_sv',
  'rescue_area',
  'rescue_district',
  'rescue_sub_district',
  'preschool_education_fi',
  'preschool_education_sv',
];

/* eslint-disable global-require */
const fetchDistricts = async (lnglat) => {
  const districts = [
    'health_station_district',
    'postcode_area',
    'neighborhood',
    'maternity_clinic_district',
    // 'income_support_district', TODO: Is this used in any unit?
    'lower_comprehensive_school_district_fi',
    'lower_comprehensive_school_district_sv',
    'upper_comprehensive_school_district_fi',
    'upper_comprehensive_school_district_sv',
    'rescue_area',
    'rescue_district',
    'rescue_sub_district',
    'preschool_education_fi',
    'preschool_education_sv',
  ];
  const options = {
    lat: `${lnglat[1]}`,
    lon: `${lnglat[0]}`,
    page: 1,
    page_size: 80,
    type: `${districts.join(',')}`,
    geometry: true,
    unit_include: 'name,location',
  };
  const districtData = await districtFetch(options);

  // Find the districts with unit data and collect their id's for fetch
  const idList = [];
  districtData.results.forEach((district) => {
    if (district.service_point_id) {
      idList.push(district.service_point_id);
    }
  });


  // Organize district to lists depending on district type
  const health = [];
  const geographical = [];
  const protection = [];
  const education = [];

  districtData.results.forEach((district) => {
    switch (district.type) {
      case 'health_station_district': case 'maternity_clinic_district':
        health.push(district);
        break;
      case 'neighborhood': case 'postcode_area':
        geographical.push(district);
        break;
      case 'rescue_area': case 'rescue_district': case 'rescue_sub_district':
        protection.push(district);
        break;
      case 'lower_comprehensive_school_district_fi'
        : case 'lower_comprehensive_school_district_sv'
        : case 'upper_comprehensive_school_district_fi'
        : case 'upper_comprehensive_school_district_sv'
        : case 'preschool_education_fi'
        : case 'preschool_education_sv':
        education.push(district);
        break;
      default:
        break;
    }
  });

  const districtLists = {};
  if (health.length) {
    districtLists.health = health;
  } if (geographical.length) {
    districtLists.geographical = geographical;
  } if (protection.length) {
    districtLists.protection = protection;
  } if (education.length) {
    districtLists.education = education;
  }
  return districtLists;
};

export const fetchAdministrativeDistricts = async (lnglat) => {
  const districts = [
    'postcode_area',
    'neighborhood',
    'health_station_district',
    'maternity_clinic_district',
    'lower_comprehensive_school_district_fi',
    'lower_comprehensive_school_district_sv',
    'upper_comprehensive_school_district_fi',
    'upper_comprehensive_school_district_sv',
    'rescue_area',
    'rescue_district',
    'rescue_sub_district',
    'preschool_education_fi',
    'preschool_education_sv',
    'emergency_care_district',
  ];
  const options = {
    lat: `${lnglat[1]}`,
    lon: `${lnglat[0]}`,
    page: 1,
    page_size: 80,
    type: `${districts.join(',')}`,
    geometry: true,
    unit_include: 'name,root_service_nodes,location,street_address,accessibility_shortcoming_count',
  };
  const districtData = await districtFetch(options);
  const data = districtData.results.reduce((result, item) => {
    const newItem = item;
    const { unit } = newItem;
    if (unit) {
      unit.object_type = 'unit';
      newItem.unit = unit;
    }
    result.push(newItem);
    return result;
  }, []);

  // Sort data based on SORTED_DIVISION array's order
  data.sort((a, b) => {
    const indexA = SORTED_DIVISIONS.indexOf(a.type);
    const indexB = SORTED_DIVISIONS.indexOf(b.type);
    if (indexA < indexB) {
      return -1;
    }

    if (indexA > indexB) {
      return 1;
    }

    if (indexA === indexB) {
      const as = a.start;
      const ae = a.end;
      const bs = b.start;
      if (!as || !ae) {
        return 0;
      }

      if (as) {
        if (!bs) { return 1; }
        if (as < bs) { return -1; }
        return 1;
      }
      if (bs) {
        return -1;
      }
      return 0;
    }
    return 0;
  });

  return data;
};

export default fetchDistricts;
