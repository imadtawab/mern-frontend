import { useEffect } from 'react'
import './Invoice.scss'
import moment from 'moment'

export default function Invoice({print,setPrintActive , order}) {
 
    const dayDate = new Date()
    let createdAt = new Date(order?.createdAt)
    const printHandle = async () => {
      await window.print()
      setPrintActive(false)
      console.log('print success');
      return
    }
    useEffect(() => {
      if(print){
        printHandle()
      }
    }, [print])
  return (
    <div id="print-content" className='Invoice'>
                    <div className="print-head">
                        <div className="logo">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                width="254"
                height="292"
                fill="none"
                viewBox="0 0 254 292"
            >
                <path
                fill="url(#paint0_linear_375_2)"
                d="M62.982 36.256L.333 72.512l-.2 72.913L0 218.403l63.048 36.39c34.657 19.994 63.249 36.389 63.582 36.389.333 0 17.595-9.863 38.456-21.86 20.794-12.063 49.185-28.392 63.048-36.389l25.126-14.53v-31.257l-1.466.8c-.867.466-29.258 16.795-63.115 36.389-33.924 19.594-61.982 35.456-62.382 35.39-.467-.133-22.86-12.93-49.852-28.525l-49.12-28.325V88.241L49.52 75.445c12.13-6.998 34.39-19.794 49.386-28.459 14.929-8.664 27.458-15.728 27.725-15.728.267 0 17.662 9.93 38.655 22.06l61.183 34.923 9.649-5.678 17.143-10.05-26.792-15.263C205.274 44.72 127.097-.067 126.43 0c-.4 0-28.992 16.329-63.448 36.256z"
                ></path>
                <path
                fill="url(#paint1_linear_375_2)"
                d="M190.611 108.702c-34.256 19.794-62.781 36.189-63.381 36.323-.667.2-17.395-9.131-39.189-21.661l-38.055-21.993v15.795l.066 15.729 36.99 21.327c20.327 11.73 37.655 21.594 38.522 21.927 1.333.467 10.663-4.665 64.114-35.523 34.39-19.928 62.782-36.389 63.115-36.656.267-.267.4-7.398.334-15.862l-.2-15.396-62.316 35.99z"
                ></path>
                <path
                fill="url(#paint2_linear_375_2)"
                d="M246.262 133.828c-3.666 2.066-31.924 18.395-62.848 36.256-30.925 17.862-56.451 32.457-56.784 32.457-.333 0-17.595-9.863-38.456-21.86l-37.855-21.86-.2 15.329c-.133 11.73.066 15.528.666 16.128 1.267 1.133 75.045 43.588 75.845 43.588.667 0 125.097-71.646 126.164-72.579.266-.267.399-7.398.333-15.929l-.2-15.396-6.665 3.866z"
                ></path>
                <defs>
                <linearGradient
                    id="paint0_linear_375_2"
                    x1="126.63"
                    x2="126.63"
                    y1="291.182"
                    y2="0"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stop-color="#00546B"></stop>
                    <stop offset="1" stop-color="#27BEA3"></stop>
                </linearGradient>
                <linearGradient
                    id="paint1_linear_375_2"
                    x1="151.565"
                    x2="151.565"
                    y1="176.177"
                    y2="72.712"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stop-color="#00546B"></stop>
                    <stop offset="1" stop-color="#27BEA3"></stop>
                </linearGradient>
                <linearGradient
                    id="paint2_linear_375_2"
                    x1="151.612"
                    x2="151.612"
                    y1="233.866"
                    y2="129.962"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stop-color="#00546B"></stop>
                    <stop offset="1" stop-color="#27BEA3"></stop>
                </linearGradient>
                </defs>
                </svg>
                <h1>evershop</h1>
                        </div>
                    </div>
                    <div className="print-content">
                      <div className="print-title">Invoice</div>
                      <div className="print-left-right-sections">
                        <table className="left-section">
                          {/* <div className="box">To       : <span>{order?.firstName} {order?.lastName}</span></div>
                          <div className="box">Tél      : <span>{order?.phone}</span></div>
                          <div className="box">Email    : <span>{order?.email}</span></div>
                          <div className="box">City     : <span>{order?.city}</span></div>
                          <div className="box">Address  : <span>{order?.address}</span></div> */}
                          <tr>
                            <th>To<span>:</span></th>
                            <td>{order?.firstName} {order?.lastName}</td>
                          </tr>
                          <tr>
                            <th>Tél<span>:</span></th>
                            <td>{order?.phone}</td>
                          </tr>
                          <tr>
                            <th>Email<span>:</span></th>
                            <td>{order?.email}</td>
                          </tr>
                          <tr>
                            <th>City<span>:</span></th>
                            <td>{order?.city}</td>
                          </tr>
                          <tr>
                            <th>Address<span>:</span></th>
                            <td>{order?.address}</td>
                          </tr>
                        </table>
                        {/* <div className="right-section">
                            <div className="box">Order Id       : <span>#{order?._id.slice(0 , 10)}</span></div>
                            <div className="box">Creation Date  : <span>{`${dayDate.getDate() < 10 ? '0'+dayDate.getDate() : dayDate.getDate()}/${(dayDate.getMonth() + 1) < 10 ? '0'+(dayDate.getMonth() + 1) : (dayDate.getMonth() + 1)}/${dayDate.getFullYear() < 10 ? '0'+dayDate.getFullYear() : dayDate.getFullYear()}`}</span></div>
                        </div> */}
                         <table className="right-section">
                         <tr>
                            <th>Order Id<span>:</span></th>
                            <td>{order?.ref}</td>
                          </tr>
                          <tr>
                            <th>Order Date<span>:</span></th>
                            <td>{moment(createdAt).format("YYYY-MM-DD")}</td>
                          </tr>
                          <tr>
                            <th>Invoice date<span>:</span></th>
                            <td>{moment(dayDate).format("YYYY-MM-DD")}</td>
                          </tr>
                        </table>
                      </div>
                      <div className="print-table">
                        <table>
                          <thead>
                            <tr>
                            <th>#</th>
                            <th>Products</th>
                            <th>Qty</th>
                            <th>Unit Price</th>
                            <th>Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order?.shoppingCart.map((prod , i) => {
                              return prod.variants.map(v => (
                                <tr key={v._id}>
                                <td>{i+1}</td>
                                <td className='txt-str'>{prod.name}{v.name ? ` (${v.name})` : ""}</td>
                                <td className='fxw'>{v.quantity}</td>
                                <td className='fxw'>{v.price}</td>
                                <td className='fxw'>{v.quantity * v.price}</td>
                              </tr>
                              ))
                            })}
                          </tbody>
                          <tbody className='row-separetor'><tr></tr> </tbody>
                          <tfoot>
                          <tr>
                            <td className='none'></td>
                            <td className='none'></td>
                            <td className='none'></td>
                            <th>Total</th>
                            <td>{order?.subtotal} Dhs</td>
                          </tr>
                          {order?.coupon && (
                          <tr>
                            <td className='none'></td>
                            <td className='none'></td>
                            <td className='none'></td>
                            <th>Discount ({order.coupon.type === "fixed" ? null : <>-{order.coupon.discount}<span>%</span></>})</th>
                            <td>-{(order.coupon.type === "fixed" ? (order.coupon.discount) : (order?.subtotal - order?.subtotal*(1 - (+order.coupon.discount/100)))).toFixed(2)}Dhs</td>
                          </tr>
                        )}
                          <tr>
                            <td className='none'></td>
                            <td className='none'></td>
                            <td className='none'></td>
                            <th>Shipping</th>
                            <td>{order?.shippingMethod?.cost} Dhs</td>
                          </tr>
                          <tr>
                            <td className='none'></td>
                            <td className='none'></td>
                            <td className='none'></td>
                            <th>Amount</th>
                            <td>{order?.total_price} Dhs</td>
                          </tr>
                          </tfoot>
                        </table>
                      </div>
                      <div className="print-footer">Thank you for your purchase</div>
                    </div>
              </div>
  )
}
