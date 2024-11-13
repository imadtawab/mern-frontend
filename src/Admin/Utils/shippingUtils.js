export const shippingMethodsObject = {
    fixed: "Fixed Cost",
    range: "Range Amount",
}
export const shippingCostHandler = (methodSeleted, totalPrice) => {
    return methodSeleted?.rangeAmount?.min_amount ? (
        totalPrice >= methodSeleted.rangeAmount?.min_amount ? methodSeleted.rangeAmount?.cost : methodSeleted.cost
    ) : (
        methodSeleted?.cost || 0
    )
  }
