/* eslint-disable camelcase */
const getPageDescriptions = (page, unit, addressAdminDistricts, getLocaleText, intl) => {
  switch (page) {
    case 'home': {
      return intl.formatMessage({ id: 'app.description' });
    }

    case 'area': {
      return intl.formatMessage({ id: 'home.buttons.area' });
    }

    case 'service': {
      return intl.formatMessage({ id: 'service.description' });
    }

    case 'address': {
      let description = '';
      // Add neighborhood and postcode to address description
      if (addressAdminDistricts?.length) {
        const neighborhood = addressAdminDistricts.find(obj => obj.type === 'neighborhood');
        const postcode = addressAdminDistricts.find(obj => obj.type === 'postcode_area');
        if (neighborhood) {
          description += `${intl.formatMessage({ id: 'area.list.neighborhood' })}: ${getLocaleText(neighborhood.name)}. `;
        }
        if (postcode) {
          description += `${intl.formatMessage({ id: 'area.list.postcode' })}: ${getLocaleText(postcode.name)}. `;
        }
      }
      description += intl.formatMessage({ id: 'address.description' });
      return description;
    }

    case 'unit': {
      if (!unit) return null;
      // Add unit contact information to description
      let description = '';
      if (unit.street_address) {
        description += `${intl.formatMessage({ id: 'address' })}: ${getLocaleText(unit.street_address)}. `;
      }
      if (unit.phone) {
        description += `${intl.formatMessage({ id: 'unit.phone' })}: ${unit.phone}. `;
      }
      const openingHoursData = unit.connections?.find(obj => obj.section_type === 'OPENING_HOURS');
      if (openingHoursData && openingHoursData.name) {
        const text = getLocaleText(openingHoursData.name);
        if (text?.length < 70) {
          description += `${intl.formatMessage({ id: 'unit.opening.hours' })}: ${text}. `;
        }
      }
      // Add basic description
      if (unit.accessibility_viewpoints) {
        description += intl.formatMessage({ id: 'unit.seo.description.accessibility' });
      } else {
        description += intl.formatMessage({ id: 'unit.seo.description' });
      }

      return description;
    }

    default:
      return intl.formatMessage({ id: 'app.description' });
  }
};


export default getPageDescriptions;
