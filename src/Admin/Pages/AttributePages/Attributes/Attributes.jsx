import { NavLink } from 'react-router-dom'
import './Attributes.scss'
import { BsTrash } from 'react-icons/bs'
import { BiCloset, BiEdit, BiX ,BiPlusCircle, BiFilterAlt} from 'react-icons/bi'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PageStructure from '../../../Components/PageStructure/PageStructure'
import Btnx from '../../../Components/Btnx/Btnx'
import SectionStructure from '../../../Components/SectionStructure/SectionStructure'
import CheckBox from '../../../Components/CheckBox/CheckBox'
import CercleLoading from '../../../../MainComponent/CercleLoading/CercleLoading'
import {toast} from 'react-toastify'
import { changeVisibility, deleteAttribute, deleteManyAttributes, getAttributes, updateManyAttributesVisibility } from '../../../../Store/Admin/attributeSlice'
import {Modal} from '../../../Utils/modalUtils'
import PaginationTable from '../../../Components/PaginationTable/PaginationTable'
import moment from 'moment'
import { itemsSelectedHandler, selectAllActivingHandler, selectAllItemsHandler } from '../../../Utils/selectItemsUtils'
import { filterQuerysHandler } from '../../../../MainUtils/filtersUtils'
import FlexSections from '../../../Components/FlexSections/FlexSections'
import InputBox, { SelectBox } from '../../../../MainComponent/InputBox/InputBox'
import { attributeTypes } from '../../../Utils/attributeUtils'
import Switcher from '../../../Components/Switcher/Switcher'

export default function Attributes() {
  const {isLoadingPage} = useSelector(s => s.attribute)
  const [attributes, setAttributes] = useState([])
  const [pagination, setPagination] = useState(null)
  const [itemsSelected, setItemsSelected] = useState([])
  const dispatch = useDispatch()

  const dispatchFunc = () => {
    dispatch(getAttributes()).unwrap()
      .then(docs => {
        let {data, pagination, query} = docs
        setAttributes(data)
        setPagination(pagination)
        setActiveFilter(false)
        let {search, type, publish, from, to} = query
        if(search) setSearchFilter(search)
        if(type) setTypeFilter(type)
        if(publish) setPublishFilter(publish)
        if(from || to) setDateFilter({from, to})
          if(search || type || publish || from || to) {
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
      setAttributes(prev => prev.map(a => a._id === id ? {...a, publish: !a.publish} : a))
      Modal(false, null)
    })
    .catch(err => toast.error(err.message))
    Modal(true, dispatchChangeVisibility, {
      title: "Change Visibility",
      message: "You want to change visibility ?",
      type: "info"
    })
  }
  const deleteAttributeHandle = (id) => {
    let dispatchDeleteAttribute = () => dispatch(deleteAttribute({id})).unwrap()
    .then(docs => {
      toast.success(docs.message)
      if(attributes.length <= 1 && pagination.page > 1) {
        window.history.replaceState(null, null, "?page="+(pagination.page - 1)+"&step="+pagination.step);
        dispatchFunc()
        Modal(false, null)
        return
      }
      setAttributes(prev => prev.filter(a => a._id !== id))
      Modal(false, null)
    })
    .catch(err => toast.error(err.message))

    Modal(true, dispatchDeleteAttribute, {
      title: "Delete Attribute",
      message: "You want to delete this attribute ?",
      type: "info"
    })
  }
  useEffect(() => {
    selectAllActivingHandler(itemsSelected, attributes)
  }, [itemsSelected])

  const deleteManyAttributesHandle = () => {
    if(!itemsSelected.length) return
    let dispatchDeleteManyAttributes = () => dispatch(deleteManyAttributes(itemsSelected)).unwrap()
    .then(docs => {
      toast.success(docs.message)
      if((attributes.length - itemsSelected.length) <= 1 && pagination.page > 1) {
        window.history.replaceState(null, null, "?page="+(pagination.page - 1)+"&step="+pagination.step);
        dispatchFunc()
        Modal(false, null)
        setItemsSelected([])
        return
      }
      setAttributes(prev => prev.filter(a => {
        return itemsSelected.indexOf(a._id) === -1
      }))
      Modal(false, null)
    })
    .catch(err => toast.error(err.message))
    Modal(true, dispatchDeleteManyAttributes, {
      title: "Delete Many Attributes",
      message: "You want to delete the attributes selected ?",
      type: "info"
    })
  }
  const updateManyAttributesVisibilityHandle = (e) => {
    if(!itemsSelected.length) return
    let dispatchUpdateManyAttributes = () => dispatch(updateManyAttributesVisibility({itemsSelected , publish: Boolean(+e.target.value)})).unwrap()
    .then(docs => {
      toast.success(docs.message)
      setAttributes(prev => prev.map(a => itemsSelected.indexOf(a._id) !== -1 ? {...a, publish: Boolean(+e.target.value)} : a))
      // selectOne Checkbox Handle
      let selectOneCheckboxs = document.querySelectorAll("[name=selectOne]")
      selectOneCheckboxs.forEach(i => i.checked = false);
      setItemsSelected([])
      Modal(false, null)
    })
    .catch(err => toast.error(err.message))
    Modal(true, dispatchUpdateManyAttributes, {
      title: "Update Many Attributes Visibility",
      message: "You want to update visibility for the attributes selected ?",
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
    const [typeFilter , setTypeFilter] = useState(null)
    const [publishFilter , setPublishFilter] = useState(null)
    const [searchFilter , setSearchFilter] = useState(null)

    const filterHandler = (e) => {
      e.preventDefault(); 
      let filterObject = {}
        filterObject.search = searchFilter
        filterObject.type = typeFilter
        filterObject.publish = publishFilter
        filterObject.from = dateFilter.from
        filterObject.to = dateFilter.to   
      filterQuerysHandler(filterObject, dispatchFunc, pagination.step)

  }
  const resetForm = (e) => {
    setDateFilter({from: null,to: null})
    setTypeFilter(null)
    setPublishFilter (null)
    setSearchFilter(null)
    let filterObject = {}
    filterObject.search = null
    filterObject.type = null
    filterObject.publish = null
    filterObject.from = null
    filterObject.to = null  
    filterQuerysHandler(null, dispatchFunc, pagination.step, true)
  }
  return (
    <PageStructure title={"Attributes"} 
    button={{href:"new",type:"a",name:"New Attribute", icon: <BiPlusCircle/> }}
    >
              <div className="actions-head">
        <Btnx disabled={!itemsSelected.length} style={{position:"relative"}} element="button" btnStyle="bg" color="primary">
        <div className="icon"><BiEdit /></div> Update Many
                <select onFocus={(e) => e.target.value = ""} onChange={updateManyAttributesVisibilityHandle} disabled={!itemsSelected.length} name="selectManyBtn" id="selectManyBtn">
                    <option selected disabled value="">Status :</option>
                    <option value="1">Publish</option>
                    <option value="0">Private</option>
                </select>
        </Btnx>
        <Btnx disabled={!itemsSelected.length} onClick={deleteManyAttributesHandle} element="button" btnStyle="bg" color="danger"><div className="icon"><BsTrash/></div> Delete Many</Btnx>
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
              <SelectBox flex="1" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} pd="none" name="type" id="typeSelect" label="Type">
                      <option value="">all</option>
                      {attributeTypes.map(type => (
                      <option value={type}>{type}</option>
                      ))}
              </SelectBox>
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
        <div className='Attributes'>
        <SectionStructure loading={isLoadingPage} length={attributes.length} pd="none">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <td>
                  <CheckBox onChange={(e) => selectAllItemsHandler(e, setItemsSelected, attributes)} name="selectAll" id="selectAll"/>
                </td>
                <td style={{textAlign: "initial"}}>unique name</td>
                <td>name</td>
                <td>type</td>
                <td>published</td>
                <td>created at</td>
                <td>actions</td>
              </tr>
            </thead>
            <tbody>
              {attributes.map((att, ind) => (
                  <tr key={att._id}>
                    <td>
                      <CheckBox
                              onChange={(e) => itemsSelectedHandler(e, setItemsSelected)}
                              name={"selectOne"}
                              id={`${att._id}`}
                            />
                    </td>
                    <td>
                      <div className="product-name">
                        <h4>{att.unique_name}</h4>
                      </div>
                    </td>
                    <td>
                      <div className="category">{att.public_name}</div>
                    </td>
                    <td>
                    <div className="category">{att.type}</div>
                    </td>
                    <td>
                      <Switcher onClick={() => ChangeVisibilityHandle(att._id, att.publish)} key={"switcher"+att._id} active={att.publish}/>
                    </td>
                    <td title={"Last updated: "+moment(att.updatedAt).format("YYYY-MM-DD HH:mm")}>{moment(att.createdAt).format("YYYY-MM-DD HH:mm")}</td>
                    <td>
                      <div className="actions">
                        <NavLink to={`edit/${att._id}`} 
                        className="edit">
                          <BiEdit />
                        </NavLink>
                        <div className="delete">
                          <BsTrash onClick={() => deleteAttributeHandle(att._id)}/>
                        </div>
                      </div>
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
          <PaginationTable dispatchFunc={dispatchFunc} pagination={pagination}/>
          {/* <PaginationTable paginationStep={5} dispatchFunc={getAttributes} pagination={getAttributesStatus.success.pagination}/> */}
        </div>
      </SectionStructure>
        </div>
    </PageStructure>
  )
}


