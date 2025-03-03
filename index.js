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
      elements: []
    })

    const actualPage = ref(pages.homePage)
    
    const manaAux = ref(0);
    const lifeAux = ref(0);

    const modifiers = ref([]);
    
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
    function modifierFactory(){
      return {
        element: null,
        elementId: null,
        effectType: null,
        nivel: null,
      }
    }
    function addModifier(){
      modifiers.value.push(modifierFactory());
    }
    function characterElementFactory(id, nivel){
      return {
        id: id,
        nivel: nivel
      }
    }
    function updateElements(id, nivel){
      if(character.elements.find(elem => elem.id == id)){
        character.elements = character.elements.map(elem => elem.id == id ? characterElementFactory(id, nivel) : elem);
      }
      else{
        character.elements.push(characterElementFactory(id, nivel))
      }
    }

    function hasElement(elementId){
      return character.elements.find(elem => elem.id == elementId) != undefined && character.elements.find(elem => elem.id == elementId).nivel > 0;
    }
    function getElementNivel(elementId){
      return character.elements.find(elem => elem.id == elementId).nivel;
    }
    
    function getElement(elementId){
      return elements.find((elem, id) => id == elementId);
    }

    function updateModifiers(modifierId, effectType, elementId, nivel){
      modifiers.value[modifierId].element = getElement(elementId);
      modifiers.value[modifierId].elementId = elementId;
      modifiers.value[modifierId].effectType = effectType;
      modifiers.value[modifierId].nivel = nivel;
    }

    function modificadorIsDefined(modifier){
      return modifier.element != null && modifier.effectType != null && modifier.nivel != null;
    }

    function getElementEffect(elementId, nivel){
      let elem = getElement(elementId);
      if(elem != undefined){
        let effectData = undefined;

        switch (elem.type) {
          case elementTypes.basic:
            effectData = basicEffects.find(effect => effect.tier == nivel);
            break;
        
          case elementTypes.desviantSimple:
            effectData = desviantSimpleEffects.find(effect => effect.tier == nivel);
            break;

          case elementTypes.desviantComplex:
            effectData = desviantComplexEffects.find(effect => effect.tier == nivel);
            break;
        
          default:
            break;
        }

        return effectData;
      }
    }

    function clearModifiers(){
      modifiers.value = [];
    }

    function getManaTotalCost(){
      let totalCost = 0;
      for(let i = 0; i < modifiers.value.length; i++){
        let mod = modifiers.value[i]

        if(!modificadorIsDefined(mod)){
          continue;
        }
        
        let effect = getElementEffect(mod.elementId, mod.nivel)
        if(mod.effectType == effectTypes.dano){
          totalCost += effect.cost;
        }
        else{
          totalCost += effect.costSecondary;
        }
      }

      return totalCost;
    }

    function getModifiersResume(){
      let resume = '';
      let totalBuff = 0;
      let totalDices = '';
      let area = '';

      for(let i = 0; i < modifiers.value.length; i++){
        let mod = modifiers.value[i]

        if(!modificadorIsDefined(mod)){
          continue;
        }
        
        let effect = getElementEffect(mod.elementId, mod.nivel)
        if(mod.effectType == effectTypes.dano){
          if(totalDices.length != 0){
            totalDices += ' + '
          }
          totalDices += effect.dano;
        }
        else if(mod.effectType == effectTypes.buff){
          totalBuff += effect.buff;
        }
        else if(mod.effectType == effectTypes.danoSecondary){
          if(totalDices.length != 0){
            totalDices += ' + '
          }
          totalDices += effect.danoSecondary;
        }
        else if(mod.effectType == effectTypes.area){
          area += effect.area;
        }
      }
      
      resume += totalDices;

      if(totalBuff > 0){
        resume += ` + ${totalBuff}`;
      }

      if(area != ''){
        resume += ` | ${area}`;
      }

      return resume;
    }

    watch(character, async (newValue) => {
      localStorage.setItem('characterName', newValue.name)
      localStorage.setItem('characterRace', newValue.race)
      localStorage.setItem('characterMana', newValue.mana)
      localStorage.setItem('characterLife', newValue.life)
      localStorage.setItem('characterActualLife', newValue.actualLife)
      localStorage.setItem('characterActualMana', newValue.actualMana)
      localStorage.setItem('characterElements', JSON.stringify(newValue.elements))
    })

    return {
      // Refs
      actualPage,
      pages,
      character,
      elements,
      modifiers,
      effectTypes,
      
      // Functions
      setPageTab,
      lifePercentage,
      manaPercentage,
      computeManaChange,
      saveActualMana,
      saveActualLife,
      computeLifeChange,
      addModifier,
      updateElements,
      hasElement,
      updateModifiers,
      getElementNivel,
      modificadorIsDefined,
      getElementEffect,
      clearModifiers,
      getManaTotalCost,
      getModifiersResume,
    }
  },
  mounted(){
    loadCharacterData(this);
    // preparerMultilevelDropdown();
  }
}).mount('#app')
