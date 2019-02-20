// import { fetchHasErrored, fetchIsLoading, unitsFetchDataSuccess } from '../redux/actions'

// TODO: put these to constants folder
const url = 'https://api.hel.fi/servicemap/v2/unit/'
const query = '&page_size=1000&service_node=986&only=root_service_nodes,services,location,name,street_address,contract_type,municipality&include=service_nodes,services,accessibility_properties&geometry=true'
let page = 1

const fetchUnits = (dispatch, allData, actions) => {
  dispatch(actions.fetchIsLoading(true))
  fetch(`${url}?page=${page}${query}`)
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText)
      }
      return response
    })
    .then(response => response.json())
    .then((data) => {
      const newData = [...allData, ...data.results]
      if (data.next) {
        // Fetch the next page if response has more than one page of results
        page += 1
        fetchUnits(dispatch, newData, actions)
      } else {
        page = 1
        dispatch(actions.fetchIsLoading(false))
        dispatch(actions.unitsFetchDataSuccess(newData))
      }
    })
    .catch(() => dispatch(actions.fetchHasErrored(true)))
}

export default fetchUnits
