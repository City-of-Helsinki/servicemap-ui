import config from '../../../../config';


const fetchUnitEvents = async id => (
  fetch(`${config.events.api_url}event/?type=event&start=today&sort=start_time&location=tprek:${id}`)
    .then(response => response.json())
);

export default fetchUnitEvents;
