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
}