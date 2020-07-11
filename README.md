# Coriolis wrapper for Svelte

Svelte is a great UI tool. combined with coriolis it provides a powerfull set for building great apps

## Install

```sh
npm install --save @coriolis/coriolis-svelte
```

# Usage

In your UI entry point Entry.svelte:

```svelte
<script context="module">
  import { withProjection, createDispatch, createStoreAPIProvider } from '@coriolis/coriolis-svelte'

  const {
    setStoreAPI,
    shareStoreAPI
  } = createStoreAPIProvider()

  export { setStoreAPI }
</script>
<script>
  import { lastPayloadOfType } from '@coriolis/parametered-projection'
  import { message } from '../projections/message'

  shareStoreAPI()

  const message$ = withProjection(lastPayloadOfType('message'))
  const dispatchMessage = createDispatch((message) => ({ type: 'message', payload: message }))
</script>

<h1>{$message$}</h1>

<input type="text" on:change={(event) => dispatchMessage(event.target.value)}>

```

Then you can build your Coriolis event store:

```javascript
import { createStore } from '@coriolis/coriolis'
import Entry, { setStoreAPI } from 'Entry.svelte'

const uiEffect = ({ dispatchEvent, withProjection }) => {
  setStoreAPI({ dispatchEvent, withProjection })

  const app = new Entry({
    target: document.body,
  })

  return () => {
    app.$destroy()
  }
}

createStore(uiEffect)
```

This example is not the most useful code sample, but you should give a try to both Coriolis and Svelte projects
