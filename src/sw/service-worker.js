self.addEventListener('message', (messageEvent) => {
  if (messageEvent.data.action === 'skipWaiting') {
    self.skipWaiting()
  }
})