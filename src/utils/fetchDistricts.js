const fetchDistricts = async (position) => {
  const url = 'https://api.hel.fi/servicemap/v2/administrative_division/?geometry=true&';
  const districts = [
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
  const districtData = await fetch(`${url}lat=${position.lat}&lon=${position.lng}&page=1&page_size=80&type=${districts.join(',')}name,root_service_nodes,location,street_address`)
    .then(response => response.json());

  // Find the districts with unit data and collect their id's for fetch
  const idList = [];
  districtData.results.forEach((district) => {
    if (district.service_point_id) {
      idList.push(district.service_point_id);
    }
  });

  // Fetch the unit data with the received id's
  if (idList.length > 0) {
    const unitData = await fetch(`https://api.hel.fi/servicemap/v2/unit/?id=${idList.join(',')}&only=name,location,&page_size=50`)
      .then(response => response.json());

    districtData.results.forEach((district) => {
      unitData.results.forEach((unit) => {
        if (unit.id === parseInt(district.service_point_id, 10)) {
        // Combine the unit data to the correct district
          district.unit = unit; // eslint-disable-line no-param-reassign
        }
      });
    });
  }
  return districtData.results;
};

export default fetchDistricts;
