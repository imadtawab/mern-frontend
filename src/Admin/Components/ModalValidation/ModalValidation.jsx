import "./ModalValidation.scss";
import { useDispatch, useSelector } from "react-redux";
import { BsCheck, BsInfo, BsX } from "react-icons/bs";
import { useEffect, useState } from "react";
import { Modal } from "../../Utils/modalUtils";
import Btnx from "../Btnx/Btnx";

export default function ModalValidation() {
  const {active , nextFunc, modalInfo} = useSelector(s => s.modal)
  const {isLoading: attLoading} = useSelector(s => s.attribute)
  const {isLoading: catgLoading} = useSelector(s => s.category)
  const {isLoading: prodLoading} = useSelector(s => s.product)
  const {isLoading: orderLoading} = useSelector(s => s.order)
  const {isLoading: shippingLoading} = useSelector(s => s.shipping)
  const {isLoading: couponLoading} = useSelector(s => s.coupon)
  const {isLoading: accountLoading} = useSelector(s => s.account)
  const {isLoading: storeLoading} = useSelector(s => s.store_settings)
  
  let isLoading = attLoading || catgLoading || prodLoading || orderLoading || shippingLoading || couponLoading || accountLoading || storeLoading
  
  if(!active) return
  return (
        <div className="ModalValidation">
            <div className="modal-box">
            {modalInfo.closeX && 
                <div onClick={() => Modal(false, null)} className="close-x">
                  <BsX />
                </div>
            }
              <div className="modal-icon">
                <BsInfo />
              </div>
              <div className="modal-title">{modalInfo.title}</div>
              <div className="modal-info">{modalInfo.message}</div>
              <div className="modal-controllers">
                <Btnx
                  onClick={() => Modal(false, null)}
                  btnStyle="bg"
                  color="success"
                  element="button"
                >
                  No
                </Btnx>

                <Btnx
                loading={isLoading}
                onClick={nextFunc}
                  btnStyle="bg"
                  color="success"
                  element="button"
                >
                  Yes
                </Btnx>
              </div>
            </div>
        </div>
  );
}

// eslint-disable-next-line no-lone-blocks
{
  /* 
                  Modal Docs
----------------------------------------------------------------

import ModalValidation from '../../Components/ModalValidation/ModalValidation'

----------------------------------------------------------------

const showModal = (show , nextFunc) => {
  const action = {
    type : "modal/show" ,
    payload : {
        showModal: show,
        nextFunc: nextFunc,
        modalInfo: {
          title: "Change password",
          message: "Vous voulez valider le changement de password ?",
          type: "info"
        }
      }
    }
    dispatch(action)
}
  
----------------------------------------------------------------

<ModalValidation status={updatePassword_settings_Status}/>

----------------------------------------------------------------

showModal(true,() => {...})

----------------------------------------------------------------  
*/
}
