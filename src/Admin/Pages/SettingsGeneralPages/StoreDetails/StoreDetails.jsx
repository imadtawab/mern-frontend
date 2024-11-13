import React, { useEffect, useState } from 'react'
import SectionStructure from '../../../Components/SectionStructure/SectionStructure'
import GridSections from '../../../Components/GridSections/GridSections'
import InputBox, { TextAreaBox } from '../../../../MainComponent/InputBox/InputBox'
import BtnsFooter from '../../../Components/BtnsFooter/BtnsFooter'
import Btnx from '../../../Components/Btnx/Btnx'
import { FaRegSave } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux'
import { getStoreDetails, updateStoreDetails } from '../../../../Store/Admin/storeSettingsSlice'
import { toast } from 'react-toastify'
import Loading from '../../../../MainComponent/Loading/Loading'
import { Modal } from '../../../Utils/modalUtils'

export default function StoreDetails() {
  const {isLoadingPage} = useSelector(s => s.store_settings)
  const dispatch = useDispatch()

  const [name, setName] = useState(null)
  const [title, setTitle] = useState(null)
  const [email, setEmail] = useState(null)
  const [description, setDescription] = useState(null)

  const submitHandler = (e) => {
    e.preventDefault()
    let dispatchNewAttribute = () => {
      dispatch(updateStoreDetails({storeName: name, title, email, description}))
        .unwrap()
        .then((docs) => {
          toast.success(docs.message);
          Modal(false, null);
          let {storeName, title, email, description} = docs.data
          setName(storeName)
          setTitle(title)
          setEmail(email)
          setDescription(description)
        })
        .catch((err) => {
          toast.error(err.message);
          Modal(false, null);
        });
    };
    Modal(true, dispatchNewAttribute, {
      title: "Update Store Details",
      message: "You want to update store details ?",
      type: "info",
    });
  }

  useEffect(() => {
    dispatch(getStoreDetails()).unwrap()
    .then(docs => {
      let {name, title, email, description} = docs.data
      setName(name)
      setTitle(title)
      setEmail(email)
      setDescription(description)
    })
    .catch(error => toast.error(error.message))
  }, [])
  
  return (
    <Loading loading={isLoadingPage}>
      <form onSubmit={submitHandler} className='StoreDetails'>
          <SectionStructure title="Informations">
              <GridSections style={{ rowGap: "0px", margin: "0px" }}>
              <InputBox value={name} onChange={(e) => setName(e.target.value)} type="text" name="store_name" id="store_name" placeholder="Store name" label="Store name" />
              <InputBox value={title} onChange={(e) => setTitle(e.target.value)} type="text" name="store_title" id="store_title" placeholder="Store title" label="Store title" />
              <InputBox value={email} onChange={(e) => setEmail(e.target.value)} type="email" name="store_email" id="store_email" placeholder="Store email" label="Store email" />
              </GridSections>
              <TextAreaBox value={description} onChange={(e) => setDescription(e.target.value)} name="store_description" id="store_description" placeholder="Store description" label="Store description" />
          </SectionStructure>
          <SectionStructure title="Logo & Favicon">
              Logo & Favicon
          </SectionStructure>
          <SectionStructure title="Language">
              Language
          </SectionStructure>
          <SectionStructure title="Currency">
              Currency
          </SectionStructure>
          <BtnsFooter>
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
            </BtnsFooter>
      </form>
    </Loading>
  )
}
