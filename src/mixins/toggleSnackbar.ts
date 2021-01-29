import Vue from 'vue'

export default Vue.extend({
  data: () => ({
    isSnackbarShowed: false as boolean,
    textSnackbar: '' as string,
    timeoutSnackbar: 5000 as number
  }),
  methods: {
    toggleSnackbar (status: boolean, text: string, timeout = 5000) {
      this.timeoutSnackbar = timeout
      if (status) {
        this.isSnackbarShowed = true
        this.textSnackbar = text
      } else {
        this.textSnackbar = ''
      }    
    }
  }
})