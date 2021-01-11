
declare module 'vue/types/vue' {
	interface Vue {
    $_multipass_login(): any;    
  }
  interface VueConstructor<V extends Vue = Vue> {    
    $_multipass_login(): any;
  }
}
export { }
