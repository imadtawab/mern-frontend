import "./Products.scss";
import { BiEdit, BiFilterAlt, BiPlusCircle, BiZoomIn } from "react-icons/bi";
import { BsTrash } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal } from "../../../Utils/modalUtils";
import PageStructure from "../../../Components/PageStructure/PageStructure";
import Btnx from "../../../Components/Btnx/Btnx";
import SectionStructure from "../../../Components/SectionStructure/SectionStructure";
import CheckBox from "../../../Components/CheckBox/CheckBox";
import PaginationTable from "../../../Components/PaginationTable/PaginationTable";
import { changeVisibility, deleteManyProducts, deleteProduct, getProducts, updateManyProductsVisibility } from "../../../../Store/Admin/productSlice";
import moment from "moment";
import FlexSections from "../../../Components/FlexSections/FlexSections";
import InputBox, { SelectBox } from "../../../../MainComponent/InputBox/InputBox";
import { itemsSelectedHandler, selectAllActivingHandler, selectAllItemsHandler } from "../../../Utils/selectItemsUtils";
import { filterQuerysHandler } from '../../../../MainUtils/filtersUtils'
import { getCategories } from "../../../../Store/Admin/categorySlice";
import Switcher from "../../../Components/Switcher/Switcher";
import Status from "../../../Components/Status/Status";

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const {isLoadingPage} = useSelector(s => s.product)
  const [pagination, setPagination] = useState(null)
  const [itemsSelected, setItemsSelected] = useState([])

  const dispatch = useDispatch()

  const dispatchFunc = () => {
    dispatch(getProducts()).unwrap()
      .then(docs => {
        let {data, pagination, query} = docs
        setProducts(data)
        setPagination(pagination)
        setActiveFilter(false)
        let {search, category, status, publish, from, to} = query
        if(search) setSearchFilter(search)
        if(status) setStatusFilter(status)
        if(publish) setPublishFilter(publish)
        if(category) setCategoryFilter(category)
        if(from || to) setDateFilter({from, to})
          if(search || category || status || publish || from || to) {
            setNumberOfFilters(pagination.length)
          }else{
            setNumberOfFilters(null)
          }
    })
    .catch(err => toast.error(err.message))
  }
  const ChangePublishHandle = (id, publish) => {
    let dispatchChangePublish = () => dispatch(changeVisibility({id, publish})).unwrap()
    .then(docs => {
      toast.success(docs.message)
      setProducts(prev => prev.map(a => a._id === id ? {...a, publish: !a.publish} : a))
      Modal(false, null)
    })
    .catch(err => toast.error(err.message))
    Modal(true, dispatchChangePublish, {
      title: "Change Publish",
      message: "You want to change publish ?",
      type: "info"
    })
  }
  const deleteProductHandle = (id) => {
    let dispatchDeleteProduct = () => dispatch(deleteProduct({id})).unwrap()
    .then(docs => {
      toast.success(docs.message)
      if(products.length <= 1 && pagination.page > 1) {
        window.history.replaceState(null, null, "?page="+(pagination.page - 1)+"&step="+pagination.step);
        dispatchFunc()
        Modal(false, null)
        return
      }
      setProducts(prev => prev.filter(a => a._id !== id))
      Modal(false, null)
    })
    .catch(err => toast.error(err.message))

    Modal(true, dispatchDeleteProduct, {
      title: "Delete Product",
      message: "You want to delete this product ?",
      type: "info"
    })
  }

  useEffect(() => {
    selectAllActivingHandler(itemsSelected, products)
  }, [itemsSelected])

  const deleteManyProductsHandle = () => {
    if(!itemsSelected.length) return
    let dispatchDeleteManyProducts = () => dispatch(deleteManyProducts(itemsSelected)).unwrap()
    .then(docs => {
      toast.success(docs.message)
      if((products.length - itemsSelected.length) <= 1 && pagination.page > 1) {
        window.history.replaceState(null, null, "?page="+(pagination.page - 1)+"&step="+pagination.step);
        dispatchFunc()
        Modal(false, null)
        setItemsSelected([])
        return
      }
      setProducts(prev => prev.filter(a => {
        return itemsSelected.indexOf(a._id) === -1
      }))
      Modal(false, null)
    })
    .catch(err => toast.error(err.message))
    Modal(true, dispatchDeleteManyProducts, {
      title: "Delete Many Products",
      message: "You want to delete the products selected ?",
      type: "info"
    })
  }
  const updateManyProductsVisibilityHandle = (e) => {
    if(!itemsSelected.length) return
    let dispatchUpdateManyProducts = () => dispatch(updateManyProductsVisibility({itemsSelected , publish: Boolean(+e.target.value)})).unwrap()
    .then(docs => {
      toast.success(docs.message)
      setProducts(prev => prev.map(a => itemsSelected.indexOf(a._id) !== -1 ? {...a, publish: Boolean(+e.target.value)} : a))
      // selectOne Checkbox Handle
      let selectOneCheckboxs = document.querySelectorAll("[name=selectOne]")
      selectOneCheckboxs.forEach(i => i.checked = false);
      setItemsSelected([])
      Modal(false, null)
    })
    .catch(err => toast.error(err.message))
    Modal(true, dispatchUpdateManyProducts, {
      title: "Update Many Products Publish",
      message: "You want to update publish for the products selected ?",
      type: "info"
    })
  }
  useEffect(() => {
    dispatchFunc()
    dispatch(getCategories()).unwrap()
    .then(docs => setCategories(docs.data))
    .catch(err => toast.error(err.message))
  }, [])

  // ####################################################################################
      //  filtering

      const [numberOfFilters, setNumberOfFilters] = useState()
      const [activeFilter , setActiveFilter] = useState(false)
      const [dateFilter , setDateFilter] = useState({
        from: null,
        to: null
    })
    const [statusFilter , setStatusFilter] = useState(null)
    const [publishFilter , setPublishFilter] = useState(null)
    const [categoryFilter , setCategoryFilter] = useState(null)
    const [searchFilter , setSearchFilter] = useState(null)

    const filterHandler = (e) => {
      e.preventDefault(); 
      let filterObject = {}
        filterObject.search = searchFilter
        filterObject.status = statusFilter
        filterObject.publish = publishFilter
        filterObject.category = categoryFilter
        filterObject.from = dateFilter.from
        filterObject.to = dateFilter.to   
      filterQuerysHandler(filterObject, dispatchFunc, pagination.step)

  }
  const resetForm = (e) => {
    setDateFilter({from: null,to: null})
    setStatusFilter(null)
    setPublishFilter (null)
    setCategoryFilter(null)
    setSearchFilter(null)
    let filterObject = {}
    filterObject.search = null
    filterObject.status = null
    filterObject.publish = null
    filterObject.category = null
    filterObject.from = null
    filterObject.to = null  
    filterQuerysHandler(filterObject, dispatchFunc, pagination.step, true)
  }
  return (
  <PageStructure
    button={{ icon: <BiPlusCircle/> , href: "/admin/products/new", name: "New Product" }}
    title="Products"
  >
        <div className="actions-head">
        <Btnx disabled={!itemsSelected.length} style={{position:"relative"}} element="button" btnStyle="bg" color="primary">
        <div className="icon"><BiEdit /></div> Update Many
                <select onFocus={(e) => e.target.value = ""} onChange={updateManyProductsVisibilityHandle} disabled={!itemsSelected.length} name="selectManyBtn" id="selectManyBtn">
                    <option selected disabled value="">Status :</option>
                    <option value="1">Publish</option>
                    <option value="0">Private</option>
                </select>
        </Btnx>
        <Btnx disabled={!itemsSelected.length} onClick={deleteManyProductsHandle} element="button" btnStyle="bg" color="danger"><div className="icon"><BsTrash/></div> Delete Many</Btnx>
        <Btnx onClick={()=>setActiveFilter(e => !e)} element="button" btnStyle="bg" color="success"><div className="icon"><BiFilterAlt/></div>{numberOfFilters && `(${numberOfFilters})`}</Btnx>
        </div>
        {activeFilter && (
        <SectionStructure>
            <form onSubmit={filterHandler} method='GET' className="Filter">
            <FlexSections direction="column">
              <FlexSections wrap={true}>
                <InputBox value={searchFilter} onChange={(e) => {
                      setSearchFilter(e.target.value)
                      }} placeholder="Search ..." label="Search" pd="none" flex="1" type="search" 
                />
                <SelectBox flex="1" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} pd="none" name="category" id="CategorySelect" label="Category">
                      <option value="">all</option>
                      {categories.map(c => (
                        <option value={c._id}>{c.name}</option>
                      ))}
              </SelectBox>
              <SelectBox flex="1" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} pd="none" name="status" id="stautsSelect" label="Status">
                      <option value="">all</option>
                      <option value="1">In Stock</option>
                      <option value="0">Out Stock</option>
              </SelectBox>
              </FlexSections>
              <FlexSections wrap={true}>
                {/* <FlexSections flex="2" wrap={true}> */}
                  <InputBox flex="1" value={dateFilter.from} onChange={(e) => setDateFilter(prev => {return {...prev , from: e.target.value}})} pd="none" label="from" type="date" name="from"/>
                  <InputBox flex="1" value={dateFilter.to} onChange={(e) => setDateFilter(prev => {return {...prev , to: e.target.value}})} pd="none" label="to" type="date" name="to"/>
                {/* </FlexSections> */}
                <SelectBox flex="1" value={publishFilter} onChange={(e) => setPublishFilter(e.target.value)} pd="none" name="publish" id="publishSelect" label="Publish">
                      <option value="">all</option>
                      <option value="1">Publish</option>
                      <option value="0">Private</option>
                </SelectBox>
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
    <div className="Products">
      <SectionStructure loading={isLoadingPage} length={products.length} pd="none">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <td>
                  <CheckBox onChange={(e) => selectAllItemsHandler(e, setItemsSelected, products)} name={"selectAll"} id="selectAll" />
                </td>
                <td>product name</td>
                <td>category</td>
                <td>sale price</td>
                <td>stock</td>
                <td>status</td>
                <td>published</td>
                <td>created at</td>
                <td>actions</td>
              </tr>
            </thead>
            <tbody>
              {products.map((prod, ind) => (
                  <tr key={prod._id}>
                    <td>
                      <CheckBox
                        onChange={(e) => itemsSelectedHandler(e, setItemsSelected)}
                        name={"selectOne"}  
                        id={`${prod._id}`}
                      />
                    </td>
                    <td>
                      <div className="product-name">
                        <div className="img">
                          <img loading='lazy' src={`${process.env.REACT_APP_SERVER_DOMAINE}/media/${prod.media.images[0]}`} alt="" />
                        </div>
                        <h4>{prod.name}</h4>
                      </div>
                    </td>
                    <td>
                      <div className="category">{prod.categoryOwner.name}</div>
                    </td>
                    <td>
                      <div className="sale-price price">
                      {prod.prices.salePrice}<span>mad</span>
                      </div>
                    </td>
                    <td>
                      <div className="stock">{prod.quantity}</div>
                    </td>
                    <td>
                      <Status type="product" active={prod.status}/>
                    </td>
                    <td>
                      <Switcher onClick={() => ChangePublishHandle(prod._id, prod.publish)} key={"switcher"+prod._id} active={prod.publish}/>
                    </td>
                    <td title={"Last updated: "+moment(prod.updatedAt).format("YYYY-MM-DD HH:mm")}>{moment(prod.createdAt).format("YYYY-MM-DD HH:mm")}</td>
                    <td>
                      <div className="actions">
                      <div className="view">
                        <BiZoomIn />
                      </div>
                        <NavLink to={`/admin/products/edit/${prod._id}`} className="edit">
                          <BiEdit />
                        </NavLink>
                        <div className="delete">
                         <BsTrash onClick={() => deleteProductHandle(prod._id)} />
                        </div>
                      </div>
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
          <PaginationTable dispatchFunc={dispatchFunc} pagination={pagination}/>
        </div>
      </SectionStructure>
    </div>
  </PageStructure>
  );
}
