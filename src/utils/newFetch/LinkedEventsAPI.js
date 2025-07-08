import config from '../../../config';
import HttpClient, { APIFetchError, LinkedEventsAPIName } from './HTTPClient';

export default class LinkedEventsAPI extends HttpClient {
  constructor() {
    if (
      typeof config?.eventsAPI?.root === 'string' &&
      config.eventsAPI.root.indexOf('undefined') !== -1
    ) {
      throw new APIFetchError('LindkedEventsAPIName baseURL missing');
    }
    super(config.eventsAPI.root, LinkedEventsAPIName);
  }

  eventsByKeyword = async (keyword) => {
    if (typeof keyword !== 'string') {
      throw new APIFetchError(
        'LinkedEventsAPI: Invalid keyword provided to events fetch method'
      );
    }
    const options = {
      keyword,
      type: 'event',
      page_size: 300,
      include: 'location,location.id',
      start: 'today',
      sort: 'end_time',
    };

    return this.getConcurrent('event', options);
  };
}
