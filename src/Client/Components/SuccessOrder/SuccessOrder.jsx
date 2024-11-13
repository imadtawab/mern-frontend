import './SuccessOrder.scss'
import moment from "moment";
import { BsCheck, BsInfo, BsX } from "react-icons/bs";

export default function SuccessOrder({order}) {
  console.log(order)
  return (
    <div className='SuccessOrder'>
        <div className="thanks-message">Merci. Votre commande a été reçue.</div>
        <div className="success-order-head">
            <div className="box">
                <span className="title">Numéro de commande :</span>
                <span className="content">{order?.ref}</span>
            </div>
            <div className="box">
                <span className="title">Date :</span>
                <span className="content">{moment(order?.createdAt).format("DD/MM/YYYY")}</span>
            </div>
            <div className="box">
                <span className="title">Total :</span>
                <span className="content">{order?.total_price.toFixed(2)} Mad</span>
            </div>
            <div className="box">
                <span className="title">Moyen de paiement :</span>
                <span className="content">Paiement à la livraison</span>
            </div>
        </div>
        <div className="order-details">
            <h2>Détails de la commande</h2>
            <table>
                <tr>
                    <th>Produit</th>
                    <th>Total</th>
                </tr>
                {order?.shoppingCart.map(prod => (
                    <tr>
                        <td>{prod.name} x {prod.total_quantity}</td>
                        <td>{prod.total_price.toFixed(2)} Mad</td>
                    </tr>
                ))}
                <tr>
                    <td>Sous-total :</td>
                    <td>{order?.subtotal.toFixed(2)} Mad</td>
                </tr>
                {order?.coupon && 
                <tr>
                    <td>Promotion {order.coupon.type !== "fixed" ? `(-${order.coupon.discount}%)` : ""} :</td>
                    <td>-{(order.coupon.type === "fixed" ? (order.coupon.discount) : (order?.subtotal - order?.subtotal*(1 - (+order.coupon.discount/100)))).toFixed(2)} Mad</td>
                </tr>
                }
                <tr>
                    <td>Expédition :</td>
                    <td>{order?.shippingCost.toFixed(2)} Mad</td>
                </tr>
                <tr>
                    <td>Moyen de paiement :</td>
                    <td className='text'>Paiment à livraison</td>
                </tr>
                <tr>
                    <td>Total :</td>
                    <td>{order.total_price.toFixed(2)} Mad</td>
                </tr>
            </table>
        </div>
    </div>
  )
}
