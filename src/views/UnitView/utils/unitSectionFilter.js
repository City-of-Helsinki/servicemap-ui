// Returns all data with the given section type from unit's connections data.
const unitSectionFilter = (list, section) => {
  const filteredList = [];
  list.forEach((item, i) => {
    if (item.section_type === section) {
      // Don't add duplicate elements
      if (item.name && !filteredList.some(e => e.value.name.fi === item.name.fi)) {
        filteredList.push({ type: section, value: item, id: i });
      }
    }
  });
  return filteredList;
};

export default unitSectionFilter;
