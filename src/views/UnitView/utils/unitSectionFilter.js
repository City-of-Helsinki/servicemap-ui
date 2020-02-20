// Returns all data with the given section type from unit's connections data.
const unitSectionFilter = (list, section) => {
  const filteredList = [];
  list.forEach((item, i) => {
    if (item.section_type === section) {
      if (item.name) {
        filteredList.push({ type: section, value: item, id: i });
      }
    }
  });
  return filteredList;
};

export default unitSectionFilter;
