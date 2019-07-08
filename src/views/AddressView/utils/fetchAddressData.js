const fetchAddressData = async match => fetch(`https://api.hel.fi/servicemap/v2/search/?type=address&municipality=${match.params.municipality}&q=${match.params.street} ${match.params.number}`)
  .then(response => response.json())
  .then((data) => {
    let address = null;
    data.results.forEach((result) => {
      if (result.street.municipality === match.params.municipality) {
        address = result;
      }
    });
    return address;
  });
export default fetchAddressData;
