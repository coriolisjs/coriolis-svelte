// eslint-disable-next-line import/no-unresolved
import { getContext, setContext } from 'svelte'

const KEY_STORE_API = 'Coriolis store reference'

export const withProjection = (...args) =>
  getContext(KEY_STORE_API).withProjection(...args)

export const getDispatch = () => getContext(KEY_STORE_API).dispatch

export const createDispatch = (builder) => {
  const dispatch = getDispatch()
  return (...args) => dispatch(builder(...args))
}

export const createStoreAPIProvider = () => {
  let registeredStoreAPI
  let storeAPIListener
  let resolveRegisterPromise

  const whenStoreAPIShared = new Promise((resolve) => {
    resolveRegisterPromise = resolve
  })

  const proxyStoreAPI = {
    withProjection: () => {
      throw new Error('Store API withProjection has not been set yet')
    },
    dispatch: () => {
      throw new Error('Store API dispatch has not been set yet')
    },
  }

  const checkRegistered = () => {
    if (!registeredStoreAPI || !storeAPIListener) {
      return
    }

    storeAPIListener(registeredStoreAPI)
    resolveRegisterPromise()
  }

  const setStoreAPI = (storeAPI) => {
    registeredStoreAPI = storeAPI
    checkRegistered()
  }

  const shareStoreAPI = () => {
    setContext(KEY_STORE_API, proxyStoreAPI)

    storeAPIListener = ({ dispatch, withProjection }) => {
      proxyStoreAPI.withProjection = withProjection
      proxyStoreAPI.dispatch = dispatch
    }
    checkRegistered()

    return whenStoreAPIShared
  }

  return {
    setStoreAPI,
    shareStoreAPI,
    whenStoreAPIShared,
  }
}
