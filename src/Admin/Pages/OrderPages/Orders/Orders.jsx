import { BsTelephoneFill, BsTrash, BsZoomIn } from 'react-icons/bs'
import './Orders.scss'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import PageStructure from '../../../Components/PageStructure/PageStructure'
import SectionStructure from '../../../Components/SectionStructure/SectionStructure'
import CheckBox from '../../../Components/CheckBox/CheckBox'
import InputBox, { SelectBox } from '../../../../MainComponent/InputBox/InputBox'
import { toast } from 'react-toastify'
import PaginationTable from '../../../Components/PaginationTable/PaginationTable'
import { changeOrderStatus, deleteManyOrders, deleteOrder, getOrders, updateManyOrdersStatus } from '../../../../Store/Admin/orderSlice'
import moment from "moment";
import { Modal } from '../../../Utils/modalUtils'
import { statusArray } from '../../../Utils/orderUtils'
import Btnx from '../../../Components/Btnx/Btnx'
import { BiEdit, BiFilterAlt, BiPlusCircle, BiZoomIn } from "react-icons/bi";
import { itemsSelectedHandler, selectAllActivingHandler, selectAllItemsHandler } from '../../../Utils/selectItemsUtils'
import { filterQuerysHandler } from '../../../../MainUtils/filtersUtils'
import FlexSections from '../../../Components/FlexSections/FlexSections'



export default function Orders() {
    const {isLoadingPage} = useSelector(s => s.order)
    const dispatch = useDispatch()
    const [orders, setOrders] = useState([])
    const [pagination, setPagination] = useState(null)
    const [itemsSelected, setItemsSelected] = useState([])

      useEffect(() => {
        selectAllActivingHandler(itemsSelected, orders)
      }, [itemsSelected])

      const dispatchFunc = () => {
        dispatch(getOrders()).unwrap()
          .then(docs => {
            let {data, pagination, query} = docs
            setOrders(data)
            setPagination(pagination)
            setActiveFilter(false)
            let {search_product,search_ref, search_customer, status, from, to} = query
            if(search_product) setSearchProduct(search_product)
              if(search_ref) setSearchRef(search_ref)
              if(search_customer) setSearchCustomer(search_customer)
            if(status) setStatusFilter(status)
            if(from || to) setDateFilter({from, to})
              if(search_product || search_ref || search_customer || status || from || to) {
                setNumberOfFilters(pagination.length)
              }else{
                setNumberOfFilters(null)
              }
        })
        .catch(err => toast.error(err.message))
      }

      useEffect(() => {
        dispatchFunc()
      }, [])

      const changeOrderStatusHandle = (e, _id) => {
        const status = e.target.value
        let dispatchChangeStatus = () => dispatch(changeOrderStatus({status , _id})).unwrap()
        .then(docs => {
            setOrders(prev => prev.map(order => {
                if(order._id === _id) {
                    return {...order, current_status: {name: status}}
                }
                return order
            }))
            console.log(orders);
            // dispatchFunc()
            toast.success(docs.message)
            Modal(false, null)
        }).catch(err => toast.error(err.message))
        // 
        Modal(true, dispatchChangeStatus, {
            title: "Change Order Status",
            message: "You want to change status of the order ?",
            type: "info"
          })
      }
      const deleteOrderHandle = (id) => {
        let dispatchDeleteOrder = () => dispatch(deleteOrder({id})).unwrap()
        .then(docs => {
          toast.success(docs.message)
          if(orders.length <= 1 && pagination.page > 1) {
            window.history.replaceState(null, null, "?page="+(pagination.page - 1)+"&step="+pagination.step);
            dispatchFunc()
            Modal(false, null)
            return
          }
          setOrders(prev => prev.filter(a => a._id !== id))
          setPagination(prev => {
            return {
                ...prev,
                length: prev.length - 1
            }
          })
          Modal(false, null)
        })
        .catch(err => toast.error(err.message))
    
        Modal(true, dispatchDeleteOrder, {
          title: "Delete Order",
          message: "You want to delete this order ?",
          type: "info"
        })
      }
      const updateManyOrdersStatusHandle = (e) => {
        if(!itemsSelected.length) return
        let dispatchUpdateManyOrders = () => dispatch(updateManyOrdersStatus({itemsSelected , status: e.target.value})).unwrap()
        .then(docs => {
          toast.success(docs.message)
          setOrders(prev => prev.map(a => itemsSelected.indexOf(a._id) !== -1 ? {...a, current_status: {name: e.target.value}} : a))
          // selectOne Checkbox Handle
          let selectOneCheckboxs = document.querySelectorAll("[name=selectOne]")
          selectOneCheckboxs.forEach(i => i.checked = false);
          setItemsSelected([])
          Modal(false, null)
        })
        .catch(err => toast.error(err.message))
        Modal(true, dispatchUpdateManyOrders, {
          title: "Update Many Orders Status",
          message: "You want to update status for the orders selected ?",
          type: "info"
        })
      }
      const deleteManyOrdersHandle = () => {
        if(!itemsSelected.length) return
        let dispatchDeleteManyOrders = () => dispatch(deleteManyOrders(itemsSelected)).unwrap()
        .then(docs => {
          toast.success(docs.message)
          if((orders.length - itemsSelected.length) <= 1 && pagination.page > 1) {
            window.history.replaceState(null, null, "?page="+(pagination.page - 1)+"&step="+pagination.step);
            dispatchFunc()
            Modal(false, null)
            setItemsSelected([])
            return
          }
          setOrders(prev => prev.filter(a => {
            return itemsSelected.indexOf(a._id) === -1
          }))
          setPagination(prev => {
            return {
              ...prev,
              length: prev.length - itemsSelected.length
            }
          })
          Modal(false, null)
          setItemsSelected([])
        })
        .catch(err => toast.error(err.message))
        Modal(true, dispatchDeleteManyOrders, {
          title: "Delete Many Orders",
          message: "You want to delete the orders selected ?",
          type: "info"
        })
      }

  // ####################################################################################
      //  filtering

      const [numberOfFilters, setNumberOfFilters] = useState()
      const [activeFilter , setActiveFilter] = useState(false)
      const [dateFilter , setDateFilter] = useState({
        from: null,
        to: null
    })
    const [statusFilter , setStatusFilter] = useState(null)
    const [searchProduct , setSearchProduct] = useState(null)
    const [searchRef , setSearchRef] = useState(null)
    const [searchCustomer , setSearchCustomer] = useState(null)

    const filterHandler = (e) => {
      e.preventDefault(); 
      let filterObject = {}
        filterObject.search_customer = searchCustomer
        filterObject.search_product = searchProduct
        filterObject.search_ref = searchRef
        filterObject.status = statusFilter
        filterObject.from = dateFilter.from
        filterObject.to = dateFilter.to   
      filterQuerysHandler(filterObject, dispatchFunc, pagination.step)

  }
  const resetForm = (e) => {
    setDateFilter({from: null,to: null})
    setStatusFilter(null)
    setSearchCustomer(null)
    setSearchProduct(null)
    setSearchRef(null)
    let filterObject = {}
    filterObject.search_customer = null
    filterObject.search_product = null
    filterObject.search_ref = null
    filterObject.status = null
    filterObject.from = null
    filterObject.to = null
    filterQuerysHandler(filterObject, dispatchFunc, pagination.step, true)
  }
  return (
    <PageStructure title="Orders" >
                <div className="actions-head">
        <Btnx disabled={!itemsSelected.length} style={{position:"relative"}} element="button" btnStyle="bg" color="primary">
        <div className="icon"><BiEdit /></div> Update Many
                <select onFocus={(e) => e.target.value = ""} onChange={updateManyOrdersStatusHandle} disabled={!itemsSelected.length} name="selectManyBtn" id="selectManyBtn">
                    <option selected disabled value="">Status :</option>
                    {statusArray.map((opt , i) => (
                            <option key={i+opt} value={opt}>{opt}</option>
                                    ))}
                </select>
        </Btnx>
        <Btnx disabled={!itemsSelected.length} onClick={deleteManyOrdersHandle} element="button" btnStyle="bg" color="danger"><div className="icon"><BsTrash/></div> Delete Many</Btnx>
        <Btnx onClick={()=>setActiveFilter(e => !e)} element="button" btnStyle="bg" color="success"><div className="icon"><BiFilterAlt/></div>{numberOfFilters && `(${numberOfFilters})`}</Btnx>
        </div>
        {activeFilter && (
        <SectionStructure>
            <form onSubmit={filterHandler} method='GET' className="Filter">
            <FlexSections direction="column">
              <FlexSections wrap={true}>
                <InputBox value={searchRef} onChange={(e) => {
        setSearchRef(e.target.value)
        }} placeholder="Search ..." label="Search Reference" pd="none" flex="1" type="search" 
  />
              <InputBox value={searchProduct} onChange={(e) => {
                      setSearchProduct(e.target.value)
                      }} placeholder="Search ..." label="Search Product" pd="none" flex="1" type="search" 
                />
                                <InputBox value={searchCustomer} onChange={(e) => {
                      setSearchCustomer(e.target.value)
                      }} placeholder="Search ..." label="Search Customer" pd="none" flex="1" type="search" 
                />
              </FlexSections>
              <FlexSections wrap={true}>
                {/* <FlexSections flex="2" wrap={true}> */}
              <SelectBox flex="1" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} pd="none" name="status" id="stautsSelect" label="Status">
                      <option value="">all</option>
                      {statusArray.map(status => (
                      <option value={status}>{status}</option>
                      ))}
              </SelectBox>
                  <InputBox flex="1" value={dateFilter.from} onChange={(e) => setDateFilter(prev => {return {...prev , from: e.target.value}})} pd="none" label="from" type="date" name="from"/>
                  <InputBox flex="1" value={dateFilter.to} onChange={(e) => setDateFilter(prev => {return {...prev , to: e.target.value}})} pd="none" label="to" type="date" name="to"/>
                {/* </FlexSections> */} 
              </FlexSections>
              <FlexSections style={{marginTop: "20px"}} justify="end" wrap={true}>
                <Btnx onClick={resetForm} disabled={isLoadingPage} flex={.33} width="full" btnStyle="outline" color="danger" element="button" type="reset">Reset</Btnx>
              <Btnx loading={isLoadingPage} flex={.33} type="submit" width="full" btnStyle= "bg" color= "success" element="button">Filter
                </Btnx>
              </FlexSections>
            </FlexSections>
            </form>
        </SectionStructure>
        )}
    <div className='Orders'>
    <SectionStructure loading={isLoadingPage} length={orders.length} pd="none">
    <div className="table-container">
        <table>
            <thead>
                <tr>
                    <td>
                        <CheckBox onChange={(e) => selectAllItemsHandler(e, setItemsSelected, orders)}  name={"selectAll"} id="selectAll"/>
                    </td>
                    <td>ref</td>
                    <td>order</td>
                    <td>customer</td>
                    <td>quantity</td>
                    <td>total</td>
                    <td>date</td>
                    <td>status</td>
                    <td>actions</td>
                </tr>
            </thead>
            
            <tbody>
                {orders.map((order,ind) => (
                    <>
                <tr key={order._id+ind+"test2"}>
                    <td>
                        <CheckBox 
                            onChange={(e) => itemsSelectedHandler(e, setItemsSelected)}
                            name={"selectOne"}
                            id={`${order._id}`}
                        />
                    </td>
                    <td>
                      <NavLink to={'/admin/orders/'+order._id} style={{color: "cornflowerblue"}}>{order?.ref}</NavLink>
                      </td>
                    <td>
                        <div className="product-name">
                            <div style={{    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(25px, 1fr))",
    gap: "3px",
    width: "53px",}} className="images">
                                {order.shoppingCart.map((p,indexx) => (
                            <div  key={order._id+p._id+"_test3"+indexx} style={{width: order.shoppingCart.length > 1 ? "25px" : "50px",
                                height: order.shoppingCart.length > 1 ? "25px" : "50px",
                                display: "grid",
                                placeContent: "center",}} className="img">
                                    <img loading='lazy' style={{    maxWidth: "100%",
                                    maxHeight: order.shoppingCart.length > 1 ? "25px" : "50px",}} src={`${process.env.REACT_APP_SERVER_DOMAINE}/media/${p.variants[0].image}`} alt="" />
                            </div>
                                ))}
                            </div>
                            {order.shoppingCart.length > 1 ? 
                            <h4 style={{    textAlign: "initial"}}>{order.shoppingCart[0].name} <div style={{fontWeight: "normal",fontSize: "15px",textTransform: "initial"}}>+{order.shoppingCart.length - 1} oder items</div></h4> :
                             <h4>{order.shoppingCart[0].name}</h4>}
                        </div>
                    </td>
                    <td>
                        <div className="custumor">
                            <div className="custumor-name">{order.firstName} {order.lastName}</div>
                            <div style={{    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "5px",
    color: "cornflowerblue"}} className="tel"><BsTelephoneFill/>{order.phone}</div>
                        </div>

                    </td>
                    <td>
                        <div className="qunatite ftw-n">
                            {order.total_quantity}
                        </div>
                    </td>
                    <td>
                        <div className="total price">
                        {order.total_price}<span>mad</span>
                        </div>
                    </td>
                    <td title={"Last updated: "+moment(order.updatedAt).format("YYYY-MM-DD HH:mm")}>{moment(order.createdAt).format("YYYY-MM-DD HH:mm")}</td>            
                    <td>    
                            <div className={"select " + order.current_status.name}>
                                
                                <SelectBox value={order.current_status.name} onChange={(e) => changeOrderStatusHandle(e, order._id)} style={{margin:"0"}} name="status" id="status" >
                                    {statusArray.map((opt , i) => (
                                        <option key={order._id+i+opt} value={opt}>{opt}</option>
                                    ))}
                                </SelectBox>
                        </div>

                    </td>
                    <td>
                        <div className="actions">
                        <NavLink to={'/admin/orders/'+order._id} className="views">
                                <BsZoomIn/>
                            </NavLink>
                            <div className="delete">
                                <BsTrash onClick={() => deleteOrderHandle(order._id)}/>
                            </div>
                        </div>
                    </td>
                </tr>
                    </>
                ))}
            </tbody>

        </table>
        <PaginationTable dispatchFunc={dispatchFunc} pagination={pagination}/>
    </div>
    </SectionStructure>
    </div>
</PageStructure>
  )
}

