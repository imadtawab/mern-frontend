import './ShippingMethods.scss'
import SectionStructure from '../../../Components/SectionStructure/SectionStructure'
import BtnsFooter from '../../../Components/BtnsFooter/BtnsFooter'
import Btnx from '../../../Components/Btnx/Btnx'
import { FaRegSave } from "react-icons/fa";
import Switcher from '../../../Components/Switcher/Switcher';
import GridSections from '../../../Components/GridSections/GridSections';
import InputBox from '../../../../MainComponent/InputBox/InputBox';
import { BsTrash } from 'react-icons/bs'
import { BiEdit } from 'react-icons/bi'
import { FaLongArrowAltRight } from "react-icons/fa";

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { changeVisibility, deleteShippingMethod, getShippingMethods } from '../../../../Store/Admin/shippingSlice';
import { shippingMethodsObject } from '../../../Utils/shippingUtils';
import { NavLink } from 'react-router-dom';
import moment from 'moment';
import { toast } from 'react-toastify';
import { Modal } from '../../../Utils/modalUtils';


export default function ShippingMethods() {
  const {isLoadingPage} = useSelector(s => s.shipping)
  const [methods, setMethods] = useState([])
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getShippingMethods()).unwrap()
    .then(docs => setMethods(docs.data))
    .catch(err => setMethods(err.message))
  }, [])

  const changeVisibilityHandle = (_id, publish) => {
    if(methods.filter(a => a.publish).length === 1 && publish) return toast.info("You can't not private this method, the min number of methods has 1")
    let dispatchFunc = () => dispatch(changeVisibility({_id, publish})).unwrap()
    .then(docs => {
      toast.success(docs.message)
      Modal(false, null)
      setMethods(prev => prev.map(m => m._id === _id ? {...m, publish: !publish} : m))
    })
    .catch(err => toast.error(err.message))
    Modal(true, dispatchFunc, {
      title: "Change Visibility",
      message: "You want to change visibility ?",
      type: "info"
    })
  }
  const deleteShippingMethodHandler = (_id) => {
    if(methods.filter(a => a.publish).length === 1 && methods.filter(a => a.publish)[0]._id === _id) return toast.info("You can't not deleted, the min number of methods has 1")
    let dispatchFunc = () => dispatch(deleteShippingMethod({_id})).unwrap()
    .then(docs => {
      toast.success(docs.message)
      Modal(false, null)
      setMethods(prev => prev.filter(m => m._id !== _id))
    })
    .catch(err => toast.error(err.message))
    Modal(true, dispatchFunc, {
      title: "Delete Method",
      message: "You want to delete this method ?",
      type: "info"
    })
  }
  
  return (
    <div className='ShippingMethods'>
      <SectionStructure title="All Methods" loading={isLoadingPage}>
      <div className="methods-container table-container">
                        <table>
                            <thead>
                                <tr>
                                    <td>name</td>
                                    {/* <td>type</td> */}
                                    <td>min amount</td>
                                    <td>cost</td>
                                    <td>created at</td>
                                    <td>publish</td>
                                    <td>actions</td>
                                </tr>
                            </thead>
                            <tbody>
                                {methods.map((meth) => (
                                        <tr key={meth._id}>
                                            <td>
                                                <div className="category">
                                                    <h4>{meth.name}</h4>
                                                    <span className="category">{meth.estimated_delivery}</span>
                                                </div>
                                        </td>
                                        {/* <td>
                                                <div className="category">
                                                    {shippingMethodsObject[meth.type]}
                                                </div>
                                        </td> */}
                                        <td>
                                                <div className="price">
                                                    {meth?.rangeAmount?.min_amount ? <>{meth.rangeAmount.min_amount}<span>Mad</span></> : "--"}
                                                </div>
                                        </td>
                                        <td style={meth?.rangeAmount?.min_amount ? {display: "flex", alignItems: "center", justifyContent: "center", gap: "5px"} : {}}>
                                                <div className="price">
                                                {meth.cost ? <>{meth.cost}<span>Mad</span></> : "Free"}
                                                </div>
                                                {meth?.rangeAmount?.min_amount ? <>
                                                  <FaLongArrowAltRight/>
                                                  <div className="price">
                                                {(meth?.rangeAmount.cost ? <>{meth.rangeAmount.cost}<span>Mad</span></> : "Free")}
                                                </div>
                                                </> : null}
                                        </td>
                                        <td title={"Last updated: "+moment(meth.updatedAt).format("YYYY-MM-DD HH:mm")}>{moment(meth.createdAt).format("YYYY-MM-DD HH:mm")}</td>
                                        <td>
                                          <Switcher onClick={() => changeVisibilityHandle(meth._id, meth.publish)} active={meth.publish}/>
                                        </td>
                                        <td>
                      <div className="actions">
                        {/* <NavLink to={`edit/${meth._id}`} className="edit">
                          <BiEdit />
                        </NavLink> */}
                        <div className="delete">
                         <BsTrash onClick={() => deleteShippingMethodHandler(meth._id)}/>
                        </div>
                      </div>
                    </td>
                                        </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    </SectionStructure>
      {/* </SectionStructure>
        {methods.map(meth => (
          <SectionStructure title={meth.name} controlls={<Switcher active={meth.publish}/>}>
          <GridSections style={{ rowGap: "0px", margin: "0px" }}>
              <InputBox value={meth.display_name} type="text" name="display_name" id="display_name" placeholder="Display name" label="Display name" />
              {meth.min_amount && <InputBox value={meth.min_amount} type="number" name="min_amount" id="min_amount" placeholder="Min amount" label="Min amount" />}
              <InputBox value={meth.cost} type="number" name="cost" id="cost" placeholder="Cost" label="Cost" />
              </GridSections>
          </SectionStructure>
        ))}
        <SectionStructure title="Free Shipping" controlls={<Switcher/>}>
        <GridSections style={{ rowGap: "0px", margin: "0px" }}>
            <InputBox value="Free shipping" type="text" name="display_name" id="display_name" placeholder="Display name" label="Display name" />
            <InputBox disabled value="0" type="number" name="shipping_price" id="shipping_price" placeholder="Shipping price" label="Shipping price" />
            </GridSections>
        </SectionStructure>
        <SectionStructure title="Fixed Shipping" controlls={<Switcher/>}>
        <GridSections style={{ rowGap: "0px", margin: "0px" }}>
            <InputBox value="Fixed shipping" type="text" name="display_name" id="display_name" placeholder="Display name" label="Display name" />
            <InputBox value="0" type="number" name="shipping_price" id="shipping_price" placeholder="Shipping price" label="Shipping price" />
            </GridSections>
        </SectionStructure>
        <SectionStructure title="Range Shipping" controlls={<Switcher/>}>
        <GridSections style={{ rowGap: "0px", margin: "0px" }}>
            <InputBox value="Range shipping" type="text" name="display_name" id="display_name" placeholder="Display name" label="Display name" />
            <InputBox value="0" type="number" name="min_amount" id="min_amount" placeholder="Min amount" label="Min amount" />
            <InputBox value="0" type="number" name="shipping_price" id="shipping_price" placeholder="Shipping price" label="Shipping price" />
            </GridSections>
        </SectionStructure> */}
        {/* <BtnsFooter>
            <div></div>
            <div className="box">
              <Btnx
                btnStyle="bg"
                color="success"
                element="button"
                type="submit"
              >
               <FaRegSave/> Save
              </Btnx>
            </div>
          </BtnsFooter> */}
    </div>
  )
}
