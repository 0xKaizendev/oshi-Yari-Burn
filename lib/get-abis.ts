const abis={
    yari:()=>import('@yaris/lib/ERC20.json').then((modue)=>modue.abi),
    burner:()=>import('@yaris/lib/BurnYari.json').then((modue)=>modue.abi),
  }

  export const getAbi=async (type:'yari' |'burner') => abis[type]()