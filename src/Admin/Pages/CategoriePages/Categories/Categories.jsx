import { NavLink } from 'react-router-dom'
import './Categories.scss'
import { BsTrash } from 'react-icons/bs'
import { BiFilterAlt, BiEdit, BiX, BiPlusCircle } from 'react-icons/bi'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import default_catg from "../../../../Assets/default_category.png"
import PageStructure from '../../../Components/PageStructure/PageStructure'
import SectionStructure from '../../../Components/SectionStructure/SectionStructure'
import CheckBox from '../../../Components/CheckBox/CheckBox'
import PaginationTable from '../../../Components/PaginationTable/PaginationTable'
import { toast } from 'react-toastify'
import { Modal } from '../../../Utils/modalUtils'
import { changeVisibility, deleteCategory, deleteManyCategories, getCategories, updateManyCategoriesVisibility } from '../../../../Store/Admin/categorySlice'
import Btnx from '../../../Components/Btnx/Btnx'
import moment from 'moment'
import { itemsSelectedHandler, selectAllActivingHandler, selectAllItemsHandler } from '../../../Utils/selectItemsUtils'
import FlexSections from '../../../Components/FlexSections/FlexSections'
import InputBox, { SelectBox } from '../../../../MainComponent/InputBox/InputBox'
import { filterQuerysHandler } from '../../../../MainUtils/filtersUtils'
import Switcher from '../../../Components/Switcher/Switcher'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const {isLoadingPage} = useSelector(s => s.category)
  const [pagination, setPagination] = useState(null)
  const [itemsSelected, setItemsSelected] = useState([])
  const dispatch = useDispatch()

  const dispatchFunc = () => {
    dispatch(getCategories()).unwrap()
      .then(docs => {
        let {data, pagination, query} = docs
        setCategories(data)
        setPagination(pagination)
        setActiveFilter(false)
        let {search, publish, from, to} = query
        if(search) setSearchFilter(search)
        if(publish) setPublishFilter(publish)
        if(from || to) setDateFilter({from, to})
        if(search || publish || from || to) {
          setNumberOfFilters(pagination.length)
        }else{
          setNumberOfFilters(null)
        }
      })
      .catch(err => toast.error(err.message))
  }
  const ChangeVisibilityHandle = (id, publish) => {
    let dispatchChangeVisibility = () => dispatch(changeVisibility({id, publish})).unwrap()
    .then(docs => {
      toast.success(docs.message)
      setCategories(prev => prev.map(a => a._id === id ? {...a, publish: !a.publish} : a))
      Modal(false, null)
    })
    .catch(err => toast.error(err.message))
    Modal(true, dispatchChangeVisibility, {
      title: "Change Visibility",
      message: "You want to change visibility ?",
      type: "info"
    })
  }
  const deleteCategoryHandle = (id) => {
    let dispatchDeleteCategory = () => dispatch(deleteCategory({id})).unwrap()
    .then(docs => {
      toast.success(docs.message)
      if(categories.length <= 1 && pagination.page > 1) {
        window.history.replaceState(null, null, "?page="+(pagination.page - 1)+"&step="+pagination.step);
        dispatchFunc()
        Modal(false, null)
        return
      }
      setCategories(prev => prev.filter(a => a._id !== id))
      Modal(false, null)
    })
    .catch(err => toast.error(err.message))

    Modal(true, dispatchDeleteCategory, {
      title: "Delete Category",
      message: "You want to delete this category ?",
      type: "info"
    })
  }
  useEffect(() => {
    selectAllActivingHandler(itemsSelected, categories)
  }, [itemsSelected])

  const deleteManyCategoriesHandle = () => {
    if(!itemsSelected.length) return
    let dispatchDeleteManyCategories = () => dispatch(deleteManyCategories(itemsSelected)).unwrap()
    .then(docs => {
      toast.success(docs.message)
      if((categories.length - itemsSelected.length) <= 1 && pagination.page > 1) {
        window.history.replaceState(null, null, "?page="+(pagination.page - 1)+"&step="+pagination.step);
        dispatchFunc()
        Modal(false, null)
        setItemsSelected([])
        return
      }
      setCategories(prev => prev.filter(a => {
        return itemsSelected.indexOf(a._id) === -1
      }))
      Modal(false, null)
    })
    .catch(err => toast.error(err.message))
    Modal(true, dispatchDeleteManyCategories, {
      title: "Delete Many Categories",
      message: "You want to delete the categories selected ?",
      type: "info"
    })
  }
  const updateManyCategoriesVisibilityHandle = (e) => {
    if(!itemsSelected.length) return
    let dispatchUpdateManyCategories = () => dispatch(updateManyCategoriesVisibility({itemsSelected , publish: Boolean(+e.target.value)})).unwrap()
    .then(docs => {
      toast.success(docs.message)
      setCategories(prev => prev.map(a => itemsSelected.indexOf(a._id) !== -1 ? {...a, publish: Boolean(+e.target.value)} : a))
      // selectOne Checkbox Handle
      let selectOneCheckboxs = document.querySelectorAll("[name=selectOne]")
      selectOneCheckboxs.forEach(i => i.checked = false);
      setItemsSelected([])
      Modal(false, null)
    })
    .catch(err => toast.error(err.message))
    Modal(true, dispatchUpdateManyCategories, {
      title: "Update Many Categories Visibility",
      message: "You want to update visibility for the categories selected ?",
      type: "info"
    })
  }
  useEffect(() => {
    dispatchFunc()
  }, [])

  // ####################################################################################
      //  filtering

      const [numberOfFilters, setNumberOfFilters] = useState()
      const [activeFilter , setActiveFilter] = useState(false)
      const [dateFilter , setDateFilter] = useState({
        from: null,
        to: null
    })
    const [publishFilter , setPublishFilter] = useState(null)
    const [searchFilter , setSearchFilter] = useState(null)

    const filterHandler = (e) => {
      e.preventDefault(); 
      let filterObject = {}
        filterObject.search = searchFilter
        filterObject.publish = publishFilter
        filterObject.from = dateFilter.from
        filterObject.to = dateFilter.to   
      filterQuerysHandler(filterObject, dispatchFunc, pagination.step)

  }
  const resetForm = (e) => {
    setDateFilter({from: null,to: null})
    setPublishFilter (null)
    setSearchFilter(null)
    let filterObject = {}
    filterObject.search = null
    filterObject.publish = null
    filterObject.from = null
    filterObject.to = null  
    filterQuerysHandler(filterObject, dispatchFunc, pagination.step, true)
  }

  return (
    <PageStructure loading={isLoadingPage} length={categories.length} title={"Categories"} button={{type:"a",name:"New Category", href:"/admin/categories/new", icon: <BiPlusCircle/> }}>
        <div className="actions-head">
        <Btnx disabled={!itemsSelected.length} style={{position:"relative"}} element="button" btnStyle="bg" color="primary">
        <div className="icon"><BiEdit /></div> Update Many
                <select onFocus={(e) => e.target.value = ""} onChange={updateManyCategoriesVisibilityHandle} disabled={!itemsSelected.length} name="selectManyBtn" id="selectManyBtn">
                    <option selected disabled value="">Status :</option>
                    <option value="1">Publish</option>
                    <option value="0">Private</option>
                </select>
        </Btnx>
        <Btnx disabled={!itemsSelected.length} onClick={deleteManyCategoriesHandle} element="button" btnStyle="bg" color="danger"><div className="icon"><BsTrash/></div> Delete Many</Btnx>
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
                                <SelectBox flex="1" value={publishFilter} onChange={(e) => setPublishFilter(e.target.value)} pd="none" name="publish" id="publishSelect" label="Publish">
                      <option value="">all</option>
                      <option value="1">Publish</option>
                      <option value="0">Private</option>
                </SelectBox>
              </FlexSections>
              <FlexSections wrap={true}>
                  <InputBox flex="1" value={dateFilter.from} onChange={(e) => setDateFilter(prev => {return {...prev , from: e.target.value}})} pd="none" label="from" type="date" name="from"/>
                  <InputBox flex="1" value={dateFilter.to} onChange={(e) => setDateFilter(prev => {return {...prev , to: e.target.value}})} pd="none" label="to" type="date" name="to"/>

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
        <div className='Categories'>
        <SectionStructure loading={isLoadingPage} length={categories.length} pd="none">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <td>
                  <CheckBox onChange={(e) => selectAllItemsHandler(e, setItemsSelected, categories)} name={"selectAll"} id="selectAll"/>
                </td>
                <td>image/icon</td>
                <td>name</td>
                <td>published</td>
                <td>created at</td>
                <td>actions</td>
              </tr>
            </thead>
            <tbody>
              {categories.map((catg, ind) => (
                  <tr key={catg._id}>
                    <td>
                      <CheckBox
                              onChange={(e) => itemsSelectedHandler(e, setItemsSelected)}
                              name={"selectOne"}
                              id={`${catg._id}`}
                            />
                    </td>
                    <td>
                      <div style={{justifyContent: "center"}} className="product-name">
                        <div className="img">
                          <img loading='lazy' src={catg.image ?`${process.env.REACT_APP_SERVER_DOMAINE}/media/${catg.image}` : default_catg} alt="" />
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="category">{catg.name}</div>
                    </td>
                    <td>
                      <Switcher onClick={() => ChangeVisibilityHandle(catg._id, catg.publish)} key={"switcher"+catg._id} active={catg.publish}/>
                    </td>
                    <td title={"Last updated: "+moment(catg.updatedAt).format("YYYY-MM-DD HH:mm")}>{moment(catg.createdAt).format("YYYY-MM-DD HH:mm")}</td>
                    <td>
                      <div className="actions">
                        <NavLink to={`edit/${catg._id}`} className="edit">
                          <BiEdit />
                        </NavLink>
                        <div className="delete">
                          <BsTrash onClick={() => deleteCategoryHandle(catg._id)}/>
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
  )
}


