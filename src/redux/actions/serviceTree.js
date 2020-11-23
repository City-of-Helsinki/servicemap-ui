import config from '../../../config';
import { unitsFetch } from '../../utils/fetch';
import { serviceTreeUnits } from './fetchDataActions';

const {
  isFetching, fetchMoreSuccess, fetchError, fetchProgressUpdate,
} = serviceTreeUnits;

const setTreeSerivces = services => ({
  type: 'SET_TREE_SERVICES',
  services,
});

export const setTreeSelected = selected => ({
  type: 'SET_TREE_SELECTED',
  selected,
});

export const addOpenedNode = node => ({
  type: 'ADD_OPENED_NODE',
  node,
});

export const removeOpenedNode = node => ({
  type: 'REMOVE_OPENED_NODE',
  node,
});

const startNodeFetch = nodeID => ({
  type: 'START_NODE_FETCH',
  nodeID,
});

const endNodeFetch = data => ({
  type: 'END_NODE_FETCH',
  data,
});

const setFetchedNode = node => ({
  type: 'SET_TREE_FETCHED',
  node,
});


// Service node Fetch handling

const fetchNodes = param => (
  fetch(`${config.serviceMapAPI.root}/service_node/?${param}&page=1&page_size=100`)
    .then(response => response.json())
    .then(data => data.results)
);

const getRecursiveChildNodes = async (node) => {
  // Repeat this function recursively on child nodes
  if (!node.children.length) return [];
  return fetchNodes(`parent=${node.id}`)
    .then(children => Promise.all(children.map(node => getRecursiveChildNodes(node)))
      .then((results) => {
        const combindedResults = [].concat(...results);
        return [...children, ...combindedResults];
      }));
};

export const fetchRootNodes = () => (
  // Fetch all level 0 nodes (root nodes)
  async (dispatch) => {
    const data = await fetchNodes('level=0');
    dispatch(setTreeSerivces(data));
  }
);

export const fetchBranchNodes = node => (
  // Fetch all branch child nodes recursively until all levels are fetched
  async (dispatch) => {
    dispatch(startNodeFetch(node.id));
    try {
      const data = await getRecursiveChildNodes(node);
      dispatch(endNodeFetch({ nodeID: node.id, nodes: data }));
      dispatch(addOpenedNode(node.id));
    } catch (e) {
      console.warn(e);
      dispatch(endNodeFetch({ nodeID: node.id, nodes: [] }));
    }
  }
);


// Node units fetch

export const fetchServiceTreeUnits = (
  options = null,
  abortController = null,
) => async (dispatch)
=> {
  const onStart = () => dispatch(isFetching());

  const onNodeSuccess = (results) => {
    results.forEach((unit) => {
      unit.object_type = 'unit';
    });
    dispatch(fetchMoreSuccess(results));
    dispatch(setFetchedNode(options.service_node));
  };

  const onError = e => dispatch(fetchError(e.message));
  const onNext = (resultTotal, response) => dispatch(
    fetchProgressUpdate(resultTotal.length, response.count),
  );

  // Fetch data
  const data = options;
  unitsFetch(
    data,
    onStart,
    onNodeSuccess,
    onError,
    onNext,
    null,
    abortController,
  );
};
