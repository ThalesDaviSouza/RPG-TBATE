const { createApp, ref } = Vue


createApp({
  setup() {
    const pages = {
      homePage: 0,
      perfilPage: 1,
    }

    const message = ref('Hello vue!')
    const actualPage = ref(pages.homePage)
    
    function setPageTab(page){
      actualPage.value = page;
    }

    return {
      // Refs
      message,
      actualPage,
      pages,

      // Functions
      setPageTab,
    }
  }
}).mount('#app')
