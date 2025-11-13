import config from '../../../config';
import HttpClient, { APIFetchError } from './HTTPClient';

export default class LinkedEventsAPI extends HttpClient {
  constructor() {
    if (
      typeof config?.eventsAPI?.root === 'string' &&
      config.eventsAPI.root.indexOf('undefined') !== -1
    ) {
      throw new APIFetchError('LinkedEventsAPI baseURL missing');
    }
    super(config.eventsAPI.root);
  }

  // LinkedEvents-specific result handling
  handleResults = async (response, type) => {
    if (type && type === 'count') {
      return response.meta.count;
    }
    if (this.onProgressUpdate) {
      this.onProgressUpdate(response.data.length, response.meta.count);
    }
    if (type && type === 'single') {
      return response.data;
    }
    if (response.meta && response.meta.next) {
      return this.fetchNext(response.meta.next, response.data);
    }
    return response.data;
  };

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
