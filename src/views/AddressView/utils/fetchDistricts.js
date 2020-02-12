import { districtFetch } from '../../../utils/fetch';

/* eslint-disable global-require */
const fetchDistricts = async (lnglat) => {
  const districts = [
    'postcode_area',
    'neighborhood',
    'health_station_district',
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
  const geographical = [];
  const protection = [];
  const health = [];
  const education = [];

  districtData.results.forEach((district) => {
    switch (district.type) {
      case 'neighborhood': case 'postcode_area':
        geographical.push(district);
        break;
      case 'rescue_area': case 'rescue_district': case 'rescue_sub_district':
        protection.push(district);
        break;
      case 'health_station_district': case 'maternity_clinic_district':
        health.push(district);
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

  if (geographical.length) {
    districtLists.geographical = geographical;
  } if (protection.length) {
    districtLists.protection = protection;
  } if (health.length) {
    districtLists.health = health;
  } if (education.length) {
    districtLists.education = education;
  }
  return districtLists;
};

export default fetchDistricts;
