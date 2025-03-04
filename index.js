const { createApp, mounted, watch, ref, reactive } = Vue

createApp({
  setup() {
    const pages = {
      homePage: 0,
      perfilPage: 1,
      historyPage: 2,
    }

    const character = reactive({
      name: '',
      race: '',
      mana: 0,
      actualMana: 0,
      life: 0,
      actualLife: 0,
      elements: [],
      spells: [],
    })

    const spellsHistory = ref([]);
    const spellsTurnHistory = ref([]);

    const actualPage = ref(pages.homePage)
    
    const manaAux = ref(0);
    const lifeAux = ref(0);

    const spellIdAux = ref(-1);
    const spellName = ref('');
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

    function getManaTotalCost(spellId, spellModifiers){
      let mods = undefined;

      if(spellModifiers != undefined){
        mods = spellModifiers;
      }
      else if(spellId != undefined){
        mods = character.spells[spellId].modifiers;
      }
      else if(modifiers != undefined){
        mods = modifiers.value;
      }
      else{
        return 0;
      }

      let totalCost = 0;
      for(let i = 0; i < mods.length; i++){
        let mod = mods[i]

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

    function getModifiersResume(spellId, spellModifiers){
      let mods = undefined;
      let resume = '';
      let totalBuff = 0;
      let totalDices = '';
      let area = '';

      if(spellModifiers != undefined){
        mods = spellModifiers;
      }
      else if(spellId != undefined){
        mods = character.spells[spellId].modifiers;
      }
      else if(modifiers.value != undefined){
        mods = modifiers.value;
      }
      else{
        return 0;
      }

      for(let i = 0; i < mods.length; i++){
        let mod = mods[i]

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

    function removeModifier(modifierId){
      modifiers.value.splice(modifierId, 1);
    }

    function spellFactory(spellName, modifiers){
      return {
        name: spellName,
        modifiers: modifiers.value.map(a => ({...a}))
      }
    }

    function saveSpell(){
      if(spellName.value == ''){
        return;
      }
      if(spellIdAux.value > -1){
        character.spells = character.spells.map((spell, id) => id == spellIdAux.value ? spellFactory(spellName.value, modifiers) : spell);
      }
      else{
        character.spells.push(spellFactory(spellName.value, modifiers))
      }
      document.getElementById('criarMagiasModalCloseBtn').click();
    }

    function loadSpellOnModal(spellId){
      let spell = character.spells[spellId];
      spellName.value = spell.name;
      modifiers.value = spell.modifiers;
      spellIdAux.value = spellId; 
    }

    function clearModal(){
      spellIdAux.value = -1; 
      spellName.value = '';
      modifiers.value = [];
    }

    function _internCastSpell(cost, spellId, spell){
      character.actualMana -= cost;

      if(spellId !== undefined){
        spellsHistory.value.unshift(JSON.parse(JSON.stringify(character.spells[spellId])));
        spellsTurnHistory.value.unshift(JSON.parse(JSON.stringify(character.spells[spellId])));
      }
      else if(spell !== undefined){
        spellsHistory.value.unshift(JSON.parse(JSON.stringify(spell)));
        spellsTurnHistory.value.unshift(JSON.parse(JSON.stringify(spell)));
      }
    }

    function castSpell(spellId){
      let cost = getManaTotalCost(spellId);
      _internCastSpell(cost, spellId);
    }

    function castSpellByRef(spell){
      let cost = getManaTotalCost(undefined, spell.modifiers);
      _internCastSpell(cost, undefined, spell);
    }

    function maxManaPerTurn(){
      return Math.ceil(character.mana / 4);
    }
    
    function getManaUsedInTurn(){
      return spellsTurnHistory.value.reduce((total, spell) => total + getManaTotalCost(undefined, spell.modifiers), 0);
    }

    function validadeCostMagic(cost){
      return (cost <= character.actualMana) && (cost <= maxManaPerTurn()) && ((getManaUsedInTurn() + cost) <= maxManaPerTurn())
    }

    function removeSpellFromTurn(spellId){
      let spell = spellsTurnHistory.value.splice(spellId, 1)[0];
      let cost = getManaTotalCost(undefined, spell.modifiers);
      character.actualMana += cost;
    }

    watch(character, async (newValue) => {
      localStorage.setItem('characterName', newValue.name)
      localStorage.setItem('characterRace', newValue.race)
      localStorage.setItem('characterMana', newValue.mana)
      localStorage.setItem('characterLife', newValue.life)
      localStorage.setItem('characterActualLife', newValue.actualLife)
      localStorage.setItem('characterActualMana', newValue.actualMana)
      localStorage.setItem('characterElements', JSON.stringify(newValue.elements))
      localStorage.setItem('characterSpells', JSON.stringify(newValue.spells))
    })
    
    watch(spellsHistory, async (newValue) => {
      localStorage.setItem('spellsHistory', JSON.stringify(newValue))
    }, { deep: true })
    
    watch(spellsTurnHistory, async (newValue) => {
      localStorage.setItem('spellsTurnHistory', JSON.stringify(newValue))
    }, { deep: true })

    return {
      // Refs
      actualPage,
      pages,
      character,
      elements,
      modifiers,
      effectTypes,
      spellName,
      spellsHistory,
      spellsTurnHistory,
      spellIdAux,
      
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
      removeModifier,
      saveSpell,
      loadSpellOnModal,
      clearModal,
      castSpell,
      maxManaPerTurn,
      castSpellByRef,
      getManaUsedInTurn,
      validadeCostMagic,
      removeSpellFromTurn
    }
  },
  mounted(){
    loadCharacterData(this);
  }
}).mount('#app')
