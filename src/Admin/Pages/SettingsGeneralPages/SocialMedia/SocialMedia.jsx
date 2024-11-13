import SectionStructure from '../../../Components/SectionStructure/SectionStructure'
import GridSections from '../../../Components/GridSections/GridSections'
import InputBox, { TextAreaBox } from '../../../../MainComponent/InputBox/InputBox'
import BtnsFooter from '../../../Components/BtnsFooter/BtnsFooter'
import Btnx from '../../../Components/Btnx/Btnx'
import { FaRegSave } from "react-icons/fa";
import { FaFacebookF, FaInstagram, FaTwitter, FaTiktok } from "react-icons/fa6";
import Loading from '../../../../MainComponent/Loading/Loading'
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { getSocialMedia, updateSocialMedia } from '../../../../Store/Admin/storeSettingsSlice'
import { toast } from 'react-toastify'
import { Modal } from '../../../Utils/modalUtils'



export default function SocialMedia() {
  const {isLoadingPage} = useSelector(s => s.store_settings)
  const dispatch = useDispatch()

  const [facebook_url, setFacebook_url] = useState(null)
  const [instagram_url, setInstagram_url] = useState(null)
  const [tiktok_url, setTiktok_url] = useState(null)
  const [twitter_url, setTwitter_url] = useState(null)

  const submitHandler = (e) => {
    e.preventDefault()
    let dispatchNewAttribute = () => {
      dispatch(updateSocialMedia({facebook_url, instagram_url, tiktok_url, twitter_url}))
        .unwrap()
        .then((docs) => {
          toast.success(docs.message);
          Modal(false, null);
          let {facebook_url, instagram_url, tiktok_url, twitter_url} = docs.data
          setFacebook_url(facebook_url)
          setInstagram_url(instagram_url)
          setTiktok_url(tiktok_url)
          setTwitter_url(twitter_url)
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
    dispatch(getSocialMedia()).unwrap()
    .then(docs => {
      let {facebook_url, instagram_url, tiktok_url, twitter_url} = docs.data
      setFacebook_url(facebook_url)
      setInstagram_url(instagram_url)
      setTiktok_url(tiktok_url)
      setTwitter_url(twitter_url)
    })
    .catch(error => toast.error(error.message))
  }, [])
  
  return (
    <Loading loading={isLoadingPage}>
    <form onSubmit={submitHandler} className='SocialMedia'>
        <SectionStructure title="Social media URL's">
        <GridSections style={{ rowGap: "0px", margin: "0px" }}>
            <InputBox leftSlug={<FaFacebookF/>} slugColor="#fff" slugBg={"#1877F2"} borderSlug="none" value={facebook_url} onChange={(e) => setFacebook_url(e.target.value)} type="url" name="facebook_url" id="facebook_url" placeholder="Facebook URL" label="Facebook URL" />
            <InputBox leftSlug={<FaInstagram/>} slugColor="#fff" slugBg={"#E4405F"} borderSlug="none" value={instagram_url} onChange={(e) => setInstagram_url(e.target.value)} type="url" name="instagram_url" id="instagram_url" placeholder="Instagram URL" label="Instagram URL" />
            </GridSections>
            <GridSections style={{ rowGap: "0px", margin: "0px" }}>
            <InputBox leftSlug={<FaTiktok/>} slugColor="#fff" slugBg={"#000000"} borderSlug="none" value={tiktok_url} onChange={(e) => setTiktok_url(e.target.value)} type="url" name="tiktok_url" id="tiktok_url" placeholder="Tiktok URL" label="Tiktok URL" />
            <InputBox leftSlug={<FaTwitter/>} slugColor="#fff" slugBg={"#1DA1F2"} borderSlug="none" value={twitter_url} onChange={(e) => setTwitter_url(e.target.value)} type="url" name="twitter_url" id="twitter_url" placeholder="Twitter URL" label="Twitter URL" />
            </GridSections>
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
