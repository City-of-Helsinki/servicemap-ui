import * as Sentry from '@sentry/react';
import { districtFetch } from '../../../utils/fetch';

const SORTED_DIVISIONS = [
  'postcode_area',
  'neighborhood',
  'major_district',
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

const fetchAdministrativeDistricts = async (lnglat) => {
  const districts = [
    'postcode_area',
    'neighborhood',
    'major_district',
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
    unit_include:
      'name,root_service_nodes,location,street_address,accessibility_shortcoming_count,municipality,address_zip',
  };
  const districtData = await districtFetch(options);
  const data = districtData.results.reduce((result, item) => {
    if (item.unit) {
      item.unit.object_type = 'unit';
    }
    item.units?.forEach(u => {
      // Ensure that each unit is a valid object
      if (typeof u === 'object' && u !== null) {
        u.object_type = 'unit';
      } else {
        console.warn(
          `Faulty data. Type of unit should be an object, but got ${typeof u} instead.`
        );

        // Report to Sentry with context
        Sentry.captureMessage(
          `Invalid unit data in administrative districts`,
          {
            level: 'warning',
            tags: {
              component: 'fetchAdministrativeDistricts',
              data_validation: 'unit_type_check'
            },
            extra: {
              unitType: typeof u,
              unitValue: u,
              itemType: item.type,
              coordinates: lnglat
            }
          }
        );
      }
    });
    result.push(item);
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
        if (!bs) {
          return 1;
        }
        if (as < bs) {
          return -1;
        }
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

export default fetchAdministrativeDistricts;
