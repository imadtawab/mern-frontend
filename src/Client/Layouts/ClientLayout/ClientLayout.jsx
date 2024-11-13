import { FaFacebook, FaInstagram, FaTiktok, FaTwitter } from 'react-icons/fa'
import './ClientLayout.scss'
import { Outlet } from 'react-router'
import {NavLink} from 'react-router-dom'
import {  BiMenu } from 'react-icons/bi'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BsCart3, BsHeart } from 'react-icons/bs'
import {useCookies} from 'react-cookie'
import { clientAPI } from '../../../API/axios-global'
import SideCart, { SideCart1 } from '../../Components/SideCart/SideCart'
import { activeSideCart } from '../../Utils/sideCartUtils'
import { getShoppingCart } from '../../../Store/Client/shoppingCartSlice'
import { getStoreSettings } from '../../../Store/Client/storeSettingsSlice'


export default function ClientLayout() {
  const [showMenuBar, setShowMenuBar] = useState(false)
  const {length: shoppingCartNumber, wishListNumber} = useSelector(s => s.shoppingCart)
  const {social_media} = useSelector(s => s.client_settings)
  console.log(social_media)
  const dispatch = useDispatch()
  const [cookies , setCookies] = useCookies()

  let noRepeat = false
  
  useEffect(() => {
    if(noRepeat) return
    noRepeat = true
    dispatch(getShoppingCart())
    clientAPI.post("/customers/count-vistors", {
      xidvstrs: cookies.xidvstrs
    }).then((docs) => {
      const expirationDate = new Date();
      expirationDate.setTime(expirationDate.getTime() + 12 * 60 * 60 * 1000); // Set expiration date to 12 hours from now
      docs.data.cookie && setCookies('xidvstrs', docs.data.cookie, { path: '/', expires: expirationDate });
  }).catch(err => console.log(err))
  // get store settings
  dispatch(getStoreSettings()).unwrap()
  .then(docs => console.log(docs))
  .then(err => console.log(err.message))
  }, [])

  const menuIcons = (
    <div className="menu-icons">
        <NavLink to="/wishlist" className="menu-icon">
          <BsHeart/>
          {<span className="number">{wishListNumber}</span>}
        </NavLink>
        <span onClick={() => activeSideCart(true)} className='menu-icon'><BsCart3/>
      {<span className="number">{shoppingCartNumber}</span>}
        </span>
  </div>
  )
  return (
    <div className='ClientLayout'>
      <SideCart/>
      <div className="header">
      <div className="container">
            <div className="menu-icons">
              <span className="menu-icon lg">
              <BiMenu onClick={() => setShowMenuBar(!showMenuBar)} />
              </span>
            </div>
            <NavLink to="/" className="logo">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
              <h1>Evershop</h1>
            </NavLink>
            {menuIcons}
              <ul className={`navbar ${showMenuBar ? "activeMenuBar" : ""}`}>
                <li>
                  <NavLink to="/">Home</NavLink>
                </li>
                <li>
                  <NavLink to="/products">Products</NavLink>
                </li>
                <li>
                  <NavLink to="/about">About</NavLink>
                </li>
                <li>
                  <NavLink to="/contact">Contact</NavLink>
                </li>
              </ul>
              <div className="right-section">
              {menuIcons}
              </div>
        </div>
      </div>
      <div className="main-content">
        <Outlet/>
      </div>
        <div className="footer">
            <div className="links">
              <div className="box">
                  <div className="logo">
                  <img loading='lazy' src="../../../Assets/371ea0d5-6da8-45d8-a97b-0742ae669c82.jpg" alt="" />
                  <h1>Evershop</h1>
                </div>
                  </div>
            
              <div className="parent">
              <div className="box">
              <h6>Categories</h6>
              <ul>
                <li>
                  <NavLink>First Link</NavLink>
                </li>
                  <li>
                    <NavLink>Second Link</NavLink>
                  </li>
                  <li>
                    <NavLink>Third Link</NavLink>
                  </li>
                  <li>
                    <NavLink>Fourth Link</NavLink>
                  </li>
              </ul>
            </div> <div className="box">
              <h6>Categories</h6>
              <ul>
                <li>
                  <NavLink>First Link</NavLink>
                </li>
                  <li>
                    <NavLink>Second Link</NavLink>
                  </li>
                  <li>
                    <NavLink>Third Link</NavLink>
                  </li>
                  <li>
                    <NavLink>Fourth Link</NavLink>
                  </li>
              </ul>
            </div> <div className="box">
              <h6>Categories</h6>
              <ul>
                <li>
                  <NavLink>First Link</NavLink>
                </li>
                  <li>
                    <NavLink>Second Link</NavLink>
                  </li>
                  <li>
                    <NavLink>Third Link</NavLink>
                  </li>
                  <li>
                    <NavLink>Fourth Link</NavLink>
                  </li>
              </ul>
            </div>
            <div className="box">
              <h6>Categories</h6>
              <ul>
                <li>
                  <NavLink>First Link</NavLink>
                </li>
                  <li>
                    <NavLink>Second Link</NavLink>
                  </li>
                  <li>
                    <NavLink>Third Link</NavLink>
                  </li>
                  <li>
                    <NavLink>Fourth Link</NavLink>
                  </li>
              </ul>
            </div>
              </div>
              </div>
            <div className="bottom">
              <p>
                © 2023 Evershop ___ @Imad Tawab
              </p>
              <div className="social-media-links">
                {social_media?.facebook_url && <a rel="noreferrer" target='_blank' href={social_media.facebook_url}> <FaFacebook/> </a>}
                {social_media?.instagram_url && <a rel="noreferrer" target='_blank' href={social_media.instagram_url}> <FaInstagram/> </a>}
                {social_media?.tiktok_url && <a rel="noreferrer" target='_blank' href={social_media.tiktok_url}> <FaTiktok/> </a>}
                {social_media?.twitter_url && <a rel="noreferrer" target='_blank' href={social_media.twitter_url}> <FaTwitter/> </a>}
              </div>
            </div>
        </div>
    </div>
  )
}
