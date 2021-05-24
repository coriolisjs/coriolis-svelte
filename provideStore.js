// eslint-disable-next-line import/no-unresolved
import { getContext, setContext } from 'svelte'

const KEY_GET_SOURCE = 'Coriolis store reference: withProjection'
const KEY_DISPATCH = 'Coriolis store reference: dispatch'

export const withProjection = (...args) => getContext(KEY_GET_SOURCE)(...args)

export const createDispatch = (builder) => {
  const dispatch = getContext(KEY_DISPATCH)
  return (...args) => dispatch(builder(...args))
}

export const createStoreAPIProvider = () => {
  let receivedStoreAPI
  const setStoreAPI = (storeAPI) => {
    receivedStoreAPI = storeAPI
  }

  const shareStoreAPI = () => {
    if (!receivedStoreAPI) {
      throw new Error('Store API has not been set.')
    }

    const { dispatch, withProjection } = receivedStoreAPI

    setContext(KEY_GET_SOURCE, withProjection)
    setContext(KEY_DISPATCH, dispatch)
  }

  return {
    setStoreAPI,
    shareStoreAPI,
  }
}
