const { createApp, mounted, watch, ref, reactive } = Vue

createApp({
  setup() {
    const pages = {
      homePage: 0,
      perfilPage: 1,
    }

    const character = reactive({
      name: '',
      race: '',
      mana: 0,
      actualMana: 0,
      life: 0,
      actualLife: 0,
    })

    const actualPage = ref(pages.homePage)
    
    const manaAux = ref(0);
    const lifeAux = ref(0);
    
    function setPageTab(page){
      actualPage.value = page;
    }
    function lifePercentage() {
      return Math.round(character.actualLife / character.life * 100);
    }
    function manaPercentage() {
      return Math.round(character.actualMana / character.mana * 100);
    }
    function saveActualMana(){
      manaAux.value = character.actualMana;
    }
    function computeManaChange(){
      character.actualMana = (parseInt(manaAux.value) + parseInt(character.actualMana));
      manaAux.value = character.actualMana;
    }
    function saveActualLife(){
      lifeAux.value = character.actualLife;
    }
    function computeLifeChange(){
      character.actualLife = (parseInt(lifeAux.value) + parseInt(character.actualLife));
      lifeAux.value = character.actualLife;
    }

    watch(character, async (newValue) => {
      localStorage.setItem('characterName', newValue.name)
      localStorage.setItem('characterRace', newValue.race)
      localStorage.setItem('characterMana', newValue.mana)
      localStorage.setItem('characterLife', newValue.life)
      localStorage.setItem('characterActualLife', newValue.actualLife)
      localStorage.setItem('characterActualMana', newValue.actualMana)
    })

    return {
      // Refs
      actualPage,
      pages,
      character,
      
      // Functions
      setPageTab,
      lifePercentage,
      manaPercentage,
      computeManaChange,
      saveActualMana,
      saveActualLife,
      computeLifeChange
    }
  },
  mounted(){
    loadCharacterData(this);
  }
}).mount('#app')
