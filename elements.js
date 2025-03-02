const elementTypes = {
  basic: 0,
  desviantSimple: 1,
  desviantComplex: 2
}

const effectTypes = {
  dano: 'Dano',
  danoSecondary: 'Modificador de dano',
  buff: 'Buff',
  area: 'Area',
}

const effectFactory = (tier, cost, costSecondary, dano, danoSecondary, buff, area) => {
  return{
    tier: tier,
    cost: cost,
    costSecondary: costSecondary,
    dano: dano,
    buff: buff,
    area: area,
    danoSecondary: danoSecondary 
  };
}

const basicEffects = [
  // Truque
  {
    tier: 0,
    cost: 0,
    dano: '1d4'
  },
  //Magics
  effectFactory(1, 1, 1, '1d6', '1d4/2', 1, 'Um Alvo Adjacente'),
  effectFactory(2, 3, 2, '1d8', '1d4', 2, '4 metros'),
  effectFactory(3, 5, 4, '1d10', '1d6', 3, '9 metros'),
  effectFactory(4, 9, 6, '1d12', '1d8', 4, '18 metros'),
  effectFactory(5, 16, 8, '2d8', '1d10', 5, '24 metros'),
  effectFactory(6, 24, 10, '2d10', '1d12', 6, '90 metros'),  
]

const desviantSimpleEffects = [
  // Truque
  {
    tier: 0,
    cost: 0,
    dano: '1d6'
  },
  //Magics
  effectFactory(1, 2, 2, '2d4', '1d4', 2, 'Um Alvo Adjacente'),
  effectFactory(2, 4, 3, '2d6', '1d6', 3, '4 metros'),
  effectFactory(3, 9, 5, '2d8', '2d4', 4, '9 metros'),
  effectFactory(4, 12, 7, '2d10', '1d10', 5, '18 metros'),
  effectFactory(5, 18, 9, '2d12', '2d6', 6, '24 metros'),
  effectFactory(6, 28, 12, '3d12', '2d8', 7, '90 metros'),  
]

const desviantComplexEffects = [
  // Truque
  {
    tier: 0,
    cost: 0,
    dano: '1d8'
  },
  //Magics
  effectFactory(1, 2, 2, '2d6', '1d6', 3, 'Um Alvo Adjacente'),
  effectFactory(2, 4, 3, '2d8', '2d4', 4, '4 metros'),
  effectFactory(3, 9, 5, '2d10', '1d10', 5, '9 metros'),
  effectFactory(4, 12, 7, '2d12', '2d6', 6, '18 metros'),
  effectFactory(5, 18, 9, '3d12', '2d8', 7, '24 metros'),
  effectFactory(6, 28, 12, '4d10', '5d4', 8, '90 metros'),  
]

const elementFactory = (elementName, elementType) => {
  return {
    name: elementName,
    type: elementType
  }
}

const elements = [
  elementFactory('Fogo', elementTypes.basic),
  elementFactory('Água', elementTypes.basic),
  elementFactory('Terra', elementTypes.basic),
  elementFactory('Vento', elementTypes.basic),

  elementFactory('Raio', elementTypes.desviantSimple),
  elementFactory('Gelo', elementTypes.desviantSimple),
  elementFactory('Gravidade', elementTypes.desviantSimple),
  elementFactory('Metal', elementTypes.desviantSimple),
  elementFactory('Som', elementTypes.desviantSimple),

  elementFactory('Magma', elementTypes.desviantComplex),
  elementFactory('Planta', elementTypes.desviantComplex),
]