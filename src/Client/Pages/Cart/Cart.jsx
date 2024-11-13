import { useEffect, useState } from 'react';
import './Cart.scss'
import {BiMinus , BiPlus} from 'react-icons/bi'
import {useDispatch , useSelector } from "react-redux";
import { BsX } from 'react-icons/bs';
import { changeQuantite, deleteItemFromCart, getShoppingCart } from '../../../Store/Client/shoppingCartSlice';
import { countShoppingCartItems, countProductTotalPrice, countShoppingCartTotalPrice } from '../../Utils/sideCartUtils';
import {NavLink} from 'react-router-dom'
import Checkout from '../Checkout/Checkout';
import { getShippingMethods } from '../../../Store/Client/shippingSlice';
import { shippingCostHandler } from '../../../Admin/Utils/shippingUtils';
import { toast } from 'react-toastify';
import { checkPromoCode } from '../../../Store/Client/couponSlice';
import Loading from '../../../MainComponent/Loading/Loading'
import CercleLoading from '../../../MainComponent/CercleLoading/CercleLoading';
import { FaCheck } from "react-icons/fa";
import SuccessOrder from '../../Components/SuccessOrder/SuccessOrder';

export default function Cart() {
  const dispatch = useDispatch()
  
  const {isLoading: shippingLoading} = useSelector(s => s.client_shipping)
  const {isLoading: couponLoading} = useSelector(s => s.client_coupon)
  const [shoppingCart, setShoppingCart] = useState([])
  const [checkout, setCheckout] = useState(null)
  const [shippingMethods, setShippingMethods] = useState([])
  const [methodSeleted, setMethodSeleted] = useState(null)

  const [promoCode, setPromoCode] = useState(null)
  const [checkCode, setCheckCode] = useState({checked: false, message: null})
  const [coupon, setCoupon] = useState(null)

  const changeQuantityHandler = (action, v_id) => {
    dispatch(changeQuantite({action, v_id})).unwrap()
    .then(docs => setShoppingCart(docs))
    .catch(err => console.log(err))
  }
  const deleteItemfromCartHnadler = (prod_id, v_id) => {
    dispatch(deleteItemFromCart({prod_id, v_id})).unwrap()
    .then(docs => setShoppingCart(docs))
    .catch(err => console.log(err))
  }

  let subTotal = countShoppingCartTotalPrice(shoppingCart)
  let shipping = shippingCostHandler(methodSeleted, subTotal)
  let totalPrice = shipping + +(coupon?.discount ? coupon.type === "fixed" ? subTotal - coupon.discount : +subTotal*(1 - (+coupon.discount/100)) : subTotal)
  let numberOfItems = countShoppingCartItems(shoppingCart)

  let percentage = subTotal/methodSeleted?.rangeAmount?.min_amount*100

  const checkPromoCodeHandler = (e) => {
    e.preventDefault()
    setCheckCode({checked: false, message: null})
    dispatch(checkPromoCode({promoCode})).unwrap()
    .then(docs => {
        setCheckCode(docs)
        setCoupon(docs.coupon)
    })
    .catch(err => toast.error(err.message))
  }

  useEffect(() => {
    dispatch(getShoppingCart()).unwrap()
    .then(shopCart => {
        dispatch(getShippingMethods()).unwrap()
        .then(docs => {
            setShoppingCart(shopCart)
            setShippingMethods(docs.data)
            setMethodSeleted(docs.data[0])
        console.log(docs)
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
  }, [])


  if(!shoppingCart.length) return (
    <div className="Cart empty-cart">
        <h1 className="title">Oops,</h1>
        <p className="message">Your shopping card is empty.</p>
        <NavLink to="/">Continue Shopping</NavLink>
    </div>
)

if(checkout) return <Checkout coupon={coupon} shoppingCart={checkout} setCheckout={setCheckout} shipping={shipping} subTotal={subTotal} totalPrice={totalPrice} numberOfItems={numberOfItems} shippingMethod={methodSeleted}/>
  
  return (
    <div className='Cart'>
 <div className='cart-container'>
            <div className="shopping-cart">
            <div className="head">
            <div className='title'>Shopping Cart</div>
            <div className="items">{numberOfItems} items</div>
            </div>
            <div className="content table-container">
            <table>
            <tr>
                <th>Product details</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
                <th>Delete</th>
            </tr>
            {shoppingCart.map((prod,i) => (
                prod.variants.length === 1 ? (
                <tr key={Date.now()*i}>
                <td>
                    <div className="product-details">
                    <div className="image">
                        <img loading='lazy' src={`${process.env.REACT_APP_SERVER_DOMAINE}/media/${prod.variants[0].image}`} alt="" />
                    </div>
                    <div className="info">
                        <div className="title">{prod.name}</div>
                        <div className="categorie">{prod.category}</div>
                        <div className="variants">{prod.variants[0].name}</div>
                    </div>
                    </div>
                </td>
                <td>
                <div className="quantite">
                    <button disabled={prod.variants[0].quantityUser === 1} onClick={() => changeQuantityHandler("minus",prod.variants[0]._id)} className="minus">
                        <BiMinus/>
                    </button>
                    <input disabled value={prod.variants[0].quantityUser} />
                    <button disabled={prod.variants[0].quantityUser === 10} onClick={() => changeQuantityHandler("plus",prod.variants[0]._id)} className="plus">
                        <BiPlus/>
                    </button>
                    </div>
                </td>
                <td>
                    <div className="price">
                    {(+prod.variants[0].salePrice).toFixed(2)}<span>mad</span>
                    </div>
                </td>
                <td>
                    <div className="price">
                    {countProductTotalPrice(prod.variants)}<span>mad</span>
                    </div>
                </td>
                <td>
                    <div className="delete">
                    <BsX onClick={() => deleteItemfromCartHnadler(prod._id,prod.variants[0]._id)} />
                    </div>
                </td>
                </tr>
                ) : (
                <>
                <tr className='sub-product-head' key={Date.now()*i*2}>
                <td>
                    <div className="product-details">
                    <div className="image">
                        <img loading='lazy' src={`${process.env.REACT_APP_SERVER_DOMAINE}/media/${prod.image}`} alt="" />
                    </div>
                    <div className="info">
                        <div className="title">{prod.name}</div>
                        <div className="categorie">{prod.category}</div>
                    </div>
                    </div>
                </td>
                <td>       
                </td>
                <td>
                </td>
                <td>
                <div className="price">
                    {countProductTotalPrice(prod.variants)}<span>mad</span>
                    </div>
                </td>
                </tr>
            
                
                <>
                {   prod.variants.map(v => (
                        <tr className='sub-product' key={Date.now()*v._id}>
                        <td>
                        <div className="product-details">
                        <div className="info sub-variants">
                                <div className="sub-image">
                                <img loading='lazy' src={`${process.env.REACT_APP_SERVER_DOMAINE}/media/${v.image}`} alt="" />
                                </div>
                                <div className="variants">{v.name}</div>
                            </div>
                        </div>
                        </td>
                        <td>
                        <div className="quantite">
                            <button  disabled={v.quantityUser === 1} onClick={() => changeQuantityHandler("minus",v._id)} className="minus">
                                <BiMinus/>
                            </button>
                            <input disabled value={v.quantityUser} />
                            <button  disabled={v.quantityUser === 10} onClick={() => changeQuantityHandler("plus",v._id)} className="plus">
                            <BiPlus/>
                            </button>
                        </div>
            
                        </td>
                        <td>
                        <div className="price">
                            {v.salePrice.toFixed(2)}<span>mad</span>
                        </div>
                        </td>
                        <td>
                        </td>
                        <td>
                        <div className="delete">
                            <BsX onClick={() => deleteItemfromCartHnadler(prod._id,v._id)} />
                        </div>
                        </td>
                    </tr>
                    ))
                    }
                </>
                </>
                )
            ))}
            
            
            </table>
            </div>
            <form onSubmit={checkPromoCodeHandler} className="promo-container">
                <div className="promo-input">
                    <input onChange={e => setPromoCode(e.target.value.toUpperCase())} value={promoCode} type="text" placeholder='Promo code' />
                    <button disabled={couponLoading} className="apply-btn">Appliquer le code promo{couponLoading &&<CercleLoading absolute type="btn"/>}</button>
                </div>
                {checkCode.message && <div className={"message"+(checkCode.checked ? " success" : "")}>{checkCode.message}</div>}
            </form>
            </div>
            <div className="order-summary">
            <div className="head">
                <div className='title'>Order Summary</div>
            </div>
            <div className="content">
            <div className="box head">
            <div className="title">{countShoppingCartItems(shoppingCart)} items</div>
            <div className="total">{subTotal}<span>mad</span></div>
            </div>
            <Loading loading={shippingLoading}>
            <div className="box shipping">
            <div className="title">Shipping</div>
            <select onChange={(e) => setMethodSeleted(shippingMethods.find(s => s._id === e.target.value))} name="shipping" id="shipping">
                {shippingMethods.map(shipp => (
                    <option selected={methodSeleted._id === shipp._id} value={shipp._id}>{shipp.name +" -- "+ (+shipp.cost ? shipp.cost.toFixed(2) + " Mad" : "Free")}</option>
                ))}
            </select>
            <span><b>Estimated delivery:</b> {methodSeleted?.estimated_delivery}</span>
            {methodSeleted?.rangeAmount?.min_amount && <>
                <span><b>{methodSeleted.rangeAmount?.cost ? `Shipping ${methodSeleted.rangeAmount?.cost.toFixed(2)} MAD:` : "Free shipping:"}</b> from {methodSeleted.rangeAmount?.min_amount.toFixed(2)} MAD</span>
                {/* {subTotal < methodSeleted.rangeAmount?.min_amount && ( */}
                    <span style={{
                        "--percentage": `${percentage < 100 ? percentage : 100}%`,
                        }} className="amount-progress"><span>{subTotal < methodSeleted.rangeAmount?.min_amount ? subTotal : <FaCheck/>}</span></span>
                {/* )} */}
            </>}
            </div>
            </Loading>
            {/* <div className="box promo">
            <div className="title">Promo Code</div>
            <input onChange={e => setPromoCode(e.target.value.toUpperCase())} value={promoCode} type="text" placeholder='Enter your code' />
            {checkCode.message && <div className={"message"+(checkCode.checked ? " success" : "")}>{checkCode.message}</div>}
            <button disabled={couponLoading} onClick={checkPromoCodeHandler} className="apply">Apply{couponLoading &&<CercleLoading type="btn"/>}</button>
            </div> */}
            <div className="total-footer">
            <div className="box-footer">
              <div className="title">Sub total</div>
              <div className="total">{subTotal}<span>mad</span></div>
            </div>
            {coupon?.discount && (
            <div className="box-footer">
                <div className="title">Discount</div>
                <div className="total">-{coupon.discount.toFixed(2)}{coupon.type === "fixed" ? <span>MAD</span> : <span>%</span>}</div>
            </div>
            )}
            <div className="box-footer">
              <div className="title">Shipping</div>
              <div className="total">{shipping ? <>{shipping.toFixed(2)}<span>mad</span></> : "Free"}</div>
            </div>
            <div className="box-footer">
              <div className="title">Total</div>
              <div className="total">{totalPrice.toFixed(2)}<span>mad</span></div>
            </div>
          </div>
            <div onClick={() => setCheckout(shoppingCart)} className="checkout">Checkout</div>
            </div>
            </div>
        </div>
    </div>
  )
}
