import isClient from '.';

const createAbortController = () => (isClient() ? new AbortController() : null);

export default createAbortController;
