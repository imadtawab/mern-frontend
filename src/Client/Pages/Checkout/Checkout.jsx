import "./Checkout.scss";
import { BsArrowLeft, BsCheck } from "react-icons/bs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputBox, { TextAreaBox } from "../../../MainComponent/InputBox/InputBox";
import CercleLoading from "../../../MainComponent/CercleLoading/CercleLoading";
import { countProductQuantity, countProductTotalPrice } from "../../Utils/sideCartUtils";
import { placeOrder } from "../../../Store/Client/shoppingCartSlice";
import { toast } from 'react-toastify'
import { NavLink } from "react-router-dom";
import SuccessOrder from "../../Components/SuccessOrder/SuccessOrder";
export default function Checkout({coupon,shoppingCart,numberOfItems,shipping,setCheckout,totalPrice, subTotal, shippingMethod}) {
  const {isLoading} = useSelector(s => s.shoppingCart)
  const dispatch = useDispatch()
  const [firstName , setFirstName] = useState("")
  const [lastName , setLastName] = useState("")
  const [phone , setPhone] = useState({
    value: "",
    error: false
  })
  const [email , setEmail] = useState("")
  const [city , setCity] = useState("")
  const [address , setAddress] = useState("")
  const [customer_notes , setCustomer_notes] = useState("")
  const [successOrder, setSuccessOrder] = useState(null)

  const placeOrderHandle = () => {
    let customer = {
      firstName,
      lastName,
      phone: phone.value,
      email,
      city,
      address,
      customer_notes
    }
    let shoppingProducts = shoppingCart.map((prod, ind) => {
      return {
        _id: prod._id,
        variants: prod.variants.map(v => {
          return {
            _id:v._id,
            quantityUser: v.quantityUser
          }
        })
      }
    })
    console.log(shippingMethod)
    let shippingMethodHandler = {
      _id: shippingMethod._id,
      name: shippingMethod.name,
      cost: shippingMethod.cost,
      estimated_delivery: shippingMethod.estimated_delivery,
    }
  
    // console.log(customer, shoppingProducts);
    dispatch(placeOrder({customer,shoppingCart: shoppingProducts, shippingMethod: shippingMethodHandler, coupon})).unwrap()
    .then(docs => {
      setSuccessOrder(docs.data)
    })
    .catch(err => toast.error(err.message))
  }

  if(successOrder) return (
    // <div className="success-order">
    //     <div className="title">Successfully Order</div>
    //     <div className="icon"><BsCheck/></div>
    //     <div className="message">Your request has been successfully.</div>
    //     <NavLink to="/">Continue Shopping</NavLink>
    // </div>
    <SuccessOrder order={successOrder}/>
  )
  return (
    <>
    <div className="Checkout">
      <div onClick={() => setCheckout(false)} className="go-to-back"><BsArrowLeft/>Go To Back</div>
      <div className="shopping-cart">
        <div className="head">
          <div className="title">Checkout</div>
        </div>
        <div className="content">
          <div className="information-user">
            <div className="box">
              <InputBox
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
                error=""
                type="text"
                name="firstName"
                id="firstName"
                placeholder="First Name"
                label="First Name"
              />
              <InputBox
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
                error=""
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Last Name"
                label="Last Name"
              />
            </div>
            <div className="box">
              <InputBox
                error={phone.error ? "Please Enter Your Phone" : false}
                value={phone.value}
                onChange={e => setPhone(prev => {
                  return {error: false , value: e.target.value}
                })}
                required
                type="text"
                name="phone"
                id="phone"
                placeholder="Phone"
                label="Phone"
              />
              <InputBox
                value={email}
                onChange={e => setEmail(e.target.value)}
                error=""
                type="text"
                name="email"
                id="email"
                placeholder="Email"
                label="Email"
              />
            </div>
            <div className="box">
              <InputBox
                value={city}
                onChange={e => setCity(e.target.value)}
                required
                error=""
                type="text"
                name="city"
                id="city"
                placeholder="City"
                label="City"
              />
              <InputBox
                value={address}
                onChange={e => setAddress(e.target.value)}
                required
                error=""
                type="text"
                name="address"
                id="address"
                placeholder="Address"
                label="Address"
              />
            </div>
            <div className="box">
              <TextAreaBox  
                value={customer_notes}
                onChange={e => setCustomer_notes(e.target.value)}
                required
                error=""
                type="text"
                name="customer_notes"
                id="customer_notes"
                placeholder="Customer Notes"
                label="Customer Notes"/>
            </div>
            <div onClick={placeOrderHandle} className="buyOrder">{isLoading ? (
              <span className="loadingBtn"><CercleLoading type="btn" size="l"/>Loading</span>
            ) : "Place Order" }</div>
          </div>
          </div>
      </div>
      <div className="order-summary">
        <div className="head">
          <div className="title">Order Summary</div>
        </div>
        <div className="content">
        {shoppingCart.map(prod => (
            <div className="product-box">
                <div className="product-info">
                  <div className="info-image">
                    <img loading='lazy' src={`${process.env.REACT_APP_SERVER_DOMAINE}/media/${prod.image}`}  alt="" />
                    <div className="quantite">{countProductQuantity(prod.variants)}</div>
                  </div>
                  <div className="info-text">
                    <h3>{prod.name}</h3>
                    <p>{prod.category}</p>
                  </div>
                </div>
                <div className="total-price">
                  <div className="price">{countProductTotalPrice(prod.variants)}<span>mad</span></div>
                </div>
            </div>
          ))}
          <div className="content-head">
          <div className="box-head">
              <div className="title">Sub total ({numberOfItems} items)</div>
              <div className="total">{subTotal}<span>mad</span></div>
            </div>
            {coupon?.discount && (
            <div className="box-head">
                <div className="title">Discount</div>
                <div className="total">-{coupon.discount.toFixed(2)}{coupon.type === "fixed" ? <span>MAD</span> : <span>%</span>}</div>
            </div>
            )}
            <div className="box-head">
              <div className="title">Shipping</div>
              <div className="total">{shipping ? <>{shipping.toFixed(2)}<span>mad</span></> : "Free"}</div>
            </div>
            <div className="box-head">
              <div className="title">Total</div>
              <div className="total">{totalPrice.toFixed(2)}<span>mad</span></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </>
  );
  }
