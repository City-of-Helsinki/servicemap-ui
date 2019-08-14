const suggestUnits = async (query, autosuggest) => {
  const type = autosuggest ? 'input' : 'q';
  const suggestions = await fetch(`https://api.hel.fi/servicemap/v2/search/?${type}=${query}&only=unit.location,unit.name,unit.municipality,unit.accessibility_shortcoming_count&page_size=5&type=unit`)
    .then(response => response.json())
    .then((data) => {
      data.results.forEach((unit) => {
        unit.object_type = 'unit';
      });
      return data;
    });
  console.log(query, 'returning: ', suggestions);
  return suggestions;
};

export default suggestUnits;
