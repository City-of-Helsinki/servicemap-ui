// Returns all data with the given section type from unit's connections data.
const unitSectionFilter = (list, section) => {
  const filteredList = [];
  let i = 0;
  list.forEach((item) => {
    if (!item.section_type) {
      // TODO: is this used?
      filteredList.push({ type: section, value: item, id: i });
    } else if (item.section_type === section) {
      // Don't add duplicate elements
      if (!filteredList.some(e => e.value.name.fi === item.name.fi)) {
        filteredList.push({ type: section, value: item, id: i });
        i += 1;
      }
    }
  });
  return filteredList;
};

export default unitSectionFilter;
