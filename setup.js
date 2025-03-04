const loadCharacterData = (app) => {
  if(localStorage.characterName) {
    app.character.name = localStorage.characterName;
  }
  if(localStorage.characterRace) {
    app.character.race = localStorage.characterRace;
  }
  if(localStorage.characterMana) {
    app.character.mana = localStorage.characterMana;
  }
  if(localStorage.characterLife) {
    app.character.life = localStorage.characterLife;
  }
 
  if(localStorage.characterActualLife) {
    app.character.actualLife = localStorage.characterActualLife;
  }
  else if(localStorage.characterLife){
    app.character.actualLife = localStorage.characterLife;
  }
 
  if(localStorage.characterActualMana) {
    app.character.actualMana = localStorage.characterActualMana;
  }
  else if(localStorage.characterMana){
    app.character.actualMana = localStorage.characterMana;
  }
 
  if(localStorage.characterElements) {
    app.character.elements = JSON.parse(localStorage.characterElements);
  }
 
  if(localStorage.characterSpells) {
    app.character.spells = JSON.parse(localStorage.characterSpells);
  }
  
  if(localStorage.spellsHistory) {
    app.spellsHistory = JSON.parse(localStorage.spellsHistory);
  }
  
  if(localStorage.spellsTurnHistory) {
    app.spellsTurnHistory = JSON.parse(localStorage.spellsTurnHistory);
  }
  
  if(localStorage.characterBonusNucleo) {
    app.character.bonusNucleo = JSON.parse(localStorage.characterBonusNucleo);
  }
  
  if(localStorage.characterBuffs) {
    app.character.buffs = JSON.parse(localStorage.characterBuffs);
  }
}