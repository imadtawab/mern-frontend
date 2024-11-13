import store from '../../Store'

export function activeSideCart(show) {
    store.dispatch({
      type : "sideCart/show" ,
      payload : show
      })
}

export const countShoppingCartTotalPrice = (array) => {
  if(!array.length) return 0
  return array.map(p => p.variants.map(v => v.quantityUser * v.salePrice)).flat().reduce((a,b) => a + b)?.toFixed(2)
}
export const countShoppingCartQuantity = (array) => {
  if(!array.length) return 0
  return array.map(p => p.variants.map(v => v.quantityUser)).flat().reduce((a,b) => a + b)
}
export const countShoppingCartItems = (array) => {
  if(!array.length) return 0 
  return array.map(p => p.variants.length).flat().reduce((a,b) => a + b)
}
export const countProductTotalPrice = (variants) => {
  if(!variants.length) return 0
  return variants.map(p => p.quantityUser * p.salePrice).reduce((a,b) => a+b)?.toFixed(2)
}
export const countProductQuantity = (variants) => {
  if(!variants.length) return 0
  return variants.map(p => p.quantityUser).reduce((a,b) => a+b)
}