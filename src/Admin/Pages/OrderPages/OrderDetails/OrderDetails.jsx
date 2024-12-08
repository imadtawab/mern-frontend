import './OrderDetails.scss'
import { BsFillCaretLeftSquareFill, BsFillCaretRightSquareFill, BsFillPersonFill, BsFillPrinterFill, BsFillTelephoneFill, BsPinMapFill, BsX } from 'react-icons/bs'
import { BiMapAlt } from 'react-icons/bi'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { MdEmail } from 'react-icons/md'
import PageNotFound from '../../../Components/PageNotFound/PageNotFound'
import Loading from '../../../../MainComponent/Loading/Loading'
import { statusArray } from '../../../Utils/orderUtils'
import PageStructure from '../../../Components/PageStructure/PageStructure'
import Btnx from '../../../Components/Btnx/Btnx'
import SectionStructure from '../../../Components/SectionStructure/SectionStructure'
import { TextAreaBox } from '../../../../MainComponent/InputBox/InputBox'
import moment from 'moment'
import { changeOrderStatus, deleteOrderStatus, getOrderDetails, newPersonalNote } from '../../../../Store/Admin/orderSlice'
import { NavLink } from 'react-router-dom'
import { toast } from 'react-toastify'
import Invoice from '../../../Components/Invoice/Invoice'
import ShadowLoading from '../../../../MainComponent/ShadowLoading/ShadowLoading'

export default function OrderDetails() {
    const {id} = useParams()
    const dispatch = useDispatch()
    // const {isLoadingPage} = useSelector(s => s.order)
    const [order, setOrder] = useState(null)
    const [error, setError] = useState(null)
  
    useEffect(() => {
        dispatch(getOrderDetails(id)).unwrap()
        .then(docs => setOrder(docs.data))
        .catch(err => setError(err.message))
    },[])

    if(error) return <PageNotFound to={"/admin/orders"}/>
    

  return (
    <>
        {/* <Loading loading={isLoadingPage}> */}
            {order && <OrderDetailsHandle key="not-tracking-order" order={order} setOrder={setOrder}/>}
        {/* </Loading> */}
    </>
  )
}

export function OrderDetailsHandle({order, setOrder , key}) {
    // const [nextStatus , setNextStatus]  =useState("")
    // const [backStatus , setBackStatus]  =useState("")
    // const [nowStatus , setNowStatus] = useState("")
    const [status , setStatus] = useState([null, null, null])
    const {isLoadingPage, isLoading} = useSelector(s => s.order)

    const dispatch = useDispatch()

    const [printActive , setPrintActive] = useState(false)

    const dispatchChangeOrderStatus = (_id, status) => {
        dispatch(changeOrderStatus({_id, status})).unwrap()
        .then(docs => {
            setOrder(docs.data)
            toast.success(docs.message)
        }).catch(err => toast.error(err.message))
    }

    const changeOrderStatusHandle = (status , _id) => {
        dispatchChangeOrderStatus( _id, status)
    }
    const changeOrderStatusBySquare = (action,oldStatus,_id) => {
        if(action === "next"){
            if (oldStatus !== status[2] && statusArray.indexOf(status[2]) !== -1) {
                dispatchChangeOrderStatus(_id, status[2])
            }
            return false                
        }
        if(action === "back"){
            if (oldStatus !== status[0] && statusArray.indexOf(status[0]) !== -1) {
                dispatchChangeOrderStatus(_id, status[0])
            }
            return false                
        }
    }
    const deleteOrderStatusHandle = (_id, index) => {
        dispatch(deleteOrderStatus({_id, index})).unwrap()
        .then(docs => {
            setOrder(docs.data)
            toast.success(docs.message)
        }).catch(err => toast.error(err.message))
    }
    const [personal_notes , setPersonal_notes] = useState({
        value: "",
        error: false
    })
    const addNewPersonalNote = (_id) => {
        if(personal_notes.value === ""){
            setPersonal_notes(prev => {
                return {...prev, error: true}
            })
            return false
        }
        dispatch(newPersonalNote({personal_notes: personal_notes.value, _id})).unwrap()
        .then(docs => setOrder(prev => {
            toast.success(docs.message)
            setPersonal_notes({value: "", error: false})
            return {
                ...prev,
                personal_notes: docs.data
            }
        }))
        .catch(err => toast.error(err.message))
    }
        useEffect(() => {           // 000 
            let now = order?.current_status?.name
            let next = statusArray.indexOf(now) <= statusArray.length - 2 ? statusArray[statusArray.indexOf(now) + 1] : null
            let back = statusArray.indexOf(now) >= 1 ? statusArray[statusArray.indexOf(now) - 1] : null
            // setNowStatus(now)
            // setNextStatus(next)
            // setBackStatus(back)
            setStatus([back , now, next])
        },[order])
    return (
        <>
        
    <PageStructure loading={isLoadingPage} key={key} title={<>Order Details : {order?.ref} <span style={{marginTop: "10px",fontWeight: "normal",fontSize: "14px", display: "block"}}>Created at : {moment(order?.createdAt).format("YYYY-MM-DD  HH:mm")}</span></>} personelButton={<Btnx style={{display: "inline-block"}} onClick={() => {
        if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
            // setFullScreenForAfterPrint(true)
            // console.log(true , "on click in print btn");
        }
        setPrintActive(true)
        }} element="div" color="success" btnStyle="bg"><BsFillPrinterFill/> Print Invoice</Btnx>}>
            <div className='OrderDetails'>
                <div className="left-section">
                <SectionStructure pd="none">
                    <div className="order-variant-table table-container">
                        <table>
                            <thead>
                                <tr>
                                    <td>PRODUCT NAME</td>
                                    <td>PRICE</td>
                                    <td>QUANTITE</td>
                                    <td>TOTAL</td>
                                </tr>
                            </thead>
                            <tbody>
                                {/**************************/}
                                {order?.shoppingCart.map((prod , ind) => (
                                    <>
                                    {prod.variants[0]._id === prod._id ? (
                                        <tr>
                                        <td>
                                            <div className="product-name">
                                                <NavLink to={"/admin/products/edit/"+ prod._id} target='_blanc' className="img">
                                                    <img loading='lazy' src={`${process.env.REACT_APP_SERVER_DOMAINE}/media/${prod.image}`} alt="" />
                                                </NavLink>
                                                <div className="info">
                                                    <h4>{prod.name}</h4>
                                                    <div className='quantite'>{prod.category.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="price">
                                                {prod.variants[0].price}<span>mad</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="quantite ftw-n">
                                                {prod.total_quantity}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="total price">
                                                {prod.total_price}<span>mad</span>
                                            </div>
                                        </td>
                                    </tr>
                                    ) : (
                                        prod.variants.map((v , index) => (
                                            prod.variants.length === 1 ? (
                                                <tr>
                                                <td>
                                                    <div className="product-name">
                                                        <div className="img">
                                                            <img loading='lazy' src={`${process.env.REACT_APP_SERVER_DOMAINE}/media/${v.image}`} alt="" />
                                                        </div>
                                                        <div className="info">
                                                            <h4>{prod.name}</h4>
                                                            <div className='category'>{prod.category.name}</div>
                                                            <div className='variants'>{v.name}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="price">
                                                    {v.price}
                                                    <span>mad</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="qunatite ftw-n">
                                                        {v.quantity}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="total price">
                                                        {v.price}<span>mad</span> 
                                                        
                                                    </div>
                                                </td>
                                            </tr>
                                            ) : (
                                                index === 0 ? (
                                                    <>
                                                    <tr className="sub-product-head">
                                                    <td>
                                                        <div className="product-name">
                                                        <NavLink to={"/admin/products/edit/"+ prod._id} target='_blanc' className="img">
                                                    <img loading='lazy' src={`${process.env.REACT_APP_SERVER_DOMAINE}/media/${prod.image}`} alt="" />
                                                </NavLink>
                                                            <div className="info">
                                                                <h4>{prod.name}</h4>
                                                                <div className='category'>{prod.category.name}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                    </td>
                                                    <td>
                                                        <div className="qunatite ftw-n">
                                                            {prod.total_quantity}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="total price">
                                                       {prod.total_price}<span>mad</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                                        <tr className='sub-product'>
                                                    <td>
                                                        <div className="product-name">
                                                            <div className="sub-variants">
                                                                <div className="sub-image">
                                                                <img loading='lazy' src={`${process.env.REACT_APP_SERVER_DOMAINE}/media/${v.image}`} alt="" />
                                                                </div>
                                                                <div className='variants'>{v.name}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="price">
                                                        {v.price}<span>mad</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="qunatite ftw-n">
                                                            {v.quantity} 
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="total price">
                                                            {v.price}<span>mad</span>
                                                            
                                                        </div>
                                                    </td>
                                                </tr>
                                                </>
                                                ) : (
                                                    <tr  className='sub-product'>
                                                    <td>
                                                        <div className="product-name">
                                                            <div className="sub-variants">
                                                                <div className="sub-image">
                                                                <img loading='lazy' src={`${process.env.REACT_APP_SERVER_DOMAINE}/media/${v.image}`} alt="" />
                                                                </div>
                                                                <div className="variants">
                                                                {v.name}
                                                                </div>
                                                            </div>
                                                            
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="price">
                                                        {v.price}<span>mad</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="qunatite ftw-n">
                                                            {v.quantity}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="total price">
                                                            {v.price}<span>mad</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                                )
                                            )
                                        ))
                                    )}
                                    </>
                                ))}
                                
                            </tbody>
                        </table>
                    </div>
                </SectionStructure>
                <SectionStructure title="Payment Summary">
                    <div className="payment-summary">
                    <div className="box">
                            <div>Subtotal</div>
                            <b>
                                {order?.total_quantity} items</b>
                            <div className="price">
                                {order?.subtotal?.toFixed(2)}
                                <span>MAD</span></div>
                        </div>
                        <div className="box">
                            <div>Shipping</div>
                            <b>{order?.shippingMethod?.name}</b>
                            <div className="price">{order?.shippingCost ? <>{order.shippingCost.toFixed(2)}<span>MAD</span></> : "Free"}</div>
                        </div>
                        {order?.coupon && (
                        <div className="box">
                            <div>Discount</div>
                            <b>{order.coupon.code} [<span className='price'>-{order.coupon.discount}{order.coupon.type === "fixed" ? <span>MAD</span> : <span>%</span>}</span>]</b>
                            <div className="price">-{(order.coupon.type === "fixed" ? (order.coupon.discount) : (order?.subtotal - order?.subtotal*(1 - (+order.coupon.discount/100)))).toFixed(2)}<span>MAD</span></div>
                        </div>
                        )}
                        <div className="box last">
                            <div>Paid by customer</div>
                            <b></b>
                            <div className="price">
                                {order?.total_price.toFixed(2)}
                                <span>MAD</span></div>
                        </div>
                    </div>
                </SectionStructure>
                <SectionStructure title="personal notes">
                    <div className="personal-notes">
                    <div className="box-input">
                        <TextAreaBox error={personal_notes.error && "Please enter a value"} onChange={(e) => setPersonal_notes({value: e.target.value , error: false})} name="myNotes" id="myNotes" placeholder="Add personal note" value={personal_notes.value} />
                       
                            <Btnx onClick={() => addNewPersonalNote(order?._id)} style={{margin: 0, marginLeft: "auto"}} element="button" btnStyle="bg" color="primary" >Add Note</Btnx>
                        
                    </div>
                        <ul>
                            {order?.personal_notes.map(n => (
                                <li>{n}</li>
                            ))}
                        </ul>
                    </div>
                </SectionStructure>
                </div>
                <div className="right-section">
                    <SectionStructure title="Customer notes">
                        <div className="customer-notes">
                            <p>{order?.customer_notes ? order?.customer_notes : "No notes from customer"}</p>
                        </div>
                    </SectionStructure>
                <SectionStructure title="Customer Information">
                    <div className="customer-information">
                        <div className="box">
                            <BsFillPersonFill/>
                            <div>{order?.firstName} {order?.lastName}</div>
                        </div>
                        <div className="box">
                            <BsFillTelephoneFill/>
                            <a href={`tel: ${order?.phone}`}>{order?.phone}</a>
                        </div>
                        <div className="box">
                            <MdEmail/>
                            <a href={`mailto: ${order?.email}`} style={{textTransform:"lowercase"}}>{order?.email}</a>
                        </div>
                        <div className="box">
                            <BiMapAlt/>
                            <div>{order?.city}</div>
                        </div>
                        <div className="box">
                            <BsPinMapFill/>
                            <div>{order?.address}</div>
                        </div>
                    </div>
                
                </SectionStructure>
                <SectionStructure title="Status Timeline" controlls={
                    <div className="status-controlls">
                        <div data-status_name={status[0]} className={`back ${!status[0] ? "disabled" : ""}`}>
                            <BsFillCaretLeftSquareFill className={!status[0] ? "disabled" : ""} onClick={() => changeOrderStatusBySquare("back",status[1], order?._id)}/>
                        </div>
                        <div data-status_name={status[2]} className={`next ${!status[2] ? "disabled" : ""}`}>
                            <BsFillCaretRightSquareFill className={!status[2] ? "disabled" : ""} onClick={() => changeOrderStatusBySquare("next",status[1], order?._id)}/>
                        </div>
                    </div>
                }>
                    <div className="status-timeline">
                        <div className="timeline">
                            {order?.status.map((s , index) => (
                                <div className={"status "+s.name}>
                                    <h6>{s.name}</h6>
                                    <p>{moment(s.addedIn).format("YYYY-MM-DD HH:mm")}</p>
                                    {index !== 0 &&<div onClick={() => deleteOrderStatusHandle(order?._id , index)} className="delete"><BsX/></div>}
                                </div>

                            ))}
                        </div>
                    <div className="status-select">
                        <select value={status[1]} onChange={(e) => changeOrderStatusHandle(e.target.value , order?._id)} name="select" id="select">
                            {statusArray.map((item, index) => (
                                // selected={item === status[1]}
                                <option key={`status-${index}`} value={item}>{item}</option>
                                ))}
                        </select>
                    </div>
                    </div>
                </SectionStructure>
                </div>
            </div>
                <Invoice order={order} setPrintActive={setPrintActive} print={printActive}/>
                {isLoading && <ShadowLoading/>}
            </PageStructure>
    </>
  )
}

// {order?.shoppingCard.map((prod,i) => (
//     prod.variants.length === 1 ? (
//       <tr  key={Date.now()*i}>
//       <td>
//         <div className="product-details">
//           <div className="image">
//             <img loading='lazy' src={`${process.env.REACT_APP_SERVER_DOMAINE}/media/${prod.variants[0].image}`} alt="" />
//           </div>
//           <div className="info">
//             <div className="title">{prod.name}</div>
//             <div className="categorie">{prod.categorie}</div>
//             <div className="variants">{prod.variants[0].variantName}</div>
//           </div>
//         </div>
//       </td>
//       {/* <td>
//       <div className="quantite">
//           <div onClick={() => changeQuantiteHandle("minus",prod.variants[0].variantId)} className="minus">
//               <BiMinus/>
//           </div>
//           <input type="number" disabled value={prod.variants[0].quantiteUser} />
//           <div onClick={() => changeQuantiteHandle("plus",prod.variants[0].variantId)} className="plus">
//             <BiPlus/>
//           </div>
//         </div>
//       </td> */}
//       <td>
//         <div className="price">
//           {prod.variants[0].salePrice}<span>mad</span>
//         </div>
//       </td>
//       <td>
//         <div className="price">
//         {prod.variants[0].salePrice * prod.variants[0].quantiteUser}<span>mad</span>
//         </div>
//       </td>
//       {/* <td>
//         <div className="delete">
//           <BsTrash onClick={() => deleteProductFromHandle(prod.productId,prod.variants[0].variantId)} />
//         </div>
//       </td> */}
//     </tr>
//     ) : (
//       <>
//       <tr className='sub-product-head' key={Date.now()*i*2}>
//       <td>
//         <div className="product-details">
//           <div className="image">
//             <img loading='lazy' src={`${process.env.REACT_APP_SERVER_DOMAINE}/media/${prod.image}`} alt="" />
//           </div>
//           <div className="info">
//             <div className="title">{prod.name}</div>
//             <div className="categorie">{prod.categorie}</div>
//           </div>
//         </div>
//       </td>
//       <td>
//       {/* <div className="quantite">
//           <div className="minus">
//               <BiMinus/>
//           </div>
//           <input type="number" disabled value={shoppingCard[1].quantite} />
//           <div className="plus">
//             <BiPlus/>
//           </div>
//         </div> */}
 
//       </td>
//       <td>
//         {/* <div className="price">
//           {shoppingCard[1].variant.salePrice}<span>mad</span>
//         </div> */}
//       </td>
//       <td>
//       <div className="price">
//         {/*shoppingCard[1].variant.salePrice*shoppingCard[1].quantite*/}{prod.variants.map(p => p.quantiteUser * p.salePrice).reduce((a,b) => a+b)}<span>mad</span>
//         </div>
//       </td>
//     </tr>
   
    
//     <>
//        {   prod.variants.map(v => (
//             <tr className='sub-product' key={Date.now()*v.variantId}>
//             <td>
//               <div className="product-details">
//               <div className="info sub-variants">
//                     <div className="sub-image">
//                       <img loading='lazy' src={`${process.env.REACT_APP_SERVER_DOMAINE}/media/${v.image}`} alt="" />
//                     </div>
//                     <div className="variants">{v.variantName}</div>
//                   </div>
//               </div>
//             </td>
//             {/* <td>
//             <div className="quantite">
//                 <div onClick={() => changeQuantiteHandle("minus",v.variantId)} className="minus">
//                     <BiMinus/>
//                 </div>
//                 <input type="number" disabled value={v.quantiteUser} />
//                 <div onClick={() => changeQuantiteHandle("plus",v.variantId)} className="plus">
//                   <BiPlus/>
//                 </div>
//               </div>
 
//             </td> */}
//             <td>
//               <div className="price">
//                 {v.salePrice}<span>mad</span>
//               </div>
//             </td>
//             <td>
//             {/* <div className="price">
//               {shoppingCard[1].variant.salePrice*shoppingCard[1].quantite}<span>mad</span>
//               </div> */}
//             </td>
//             {/* <td>
//               <div className="delete">
//                 <BsTrash onClick={() => deleteProductFromHandle(prod.productId,v.variantId)} />
//               </div>
//             </td> */}
//           </tr>
//           ))
//           }
//     </>
//     </>
//     )
//   ))}
 