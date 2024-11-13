import { Outlet } from 'react-router'
import './AdminLayout.scss'
import { useCallback, useState } from 'react'
import SideBar from './SideBar/SideBar'
import Header from './Header/Header'
import Footer from './Footer/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { addAuthToState, logoutAccount } from '../../../Store/Admin/accountSlice'
import { toast } from 'react-toastify'
import {useNavigate, Navigate} from 'react-router-dom'
import { clearCookies } from '../../Utils/cookieUtils'
import Loading from '../../../MainComponent/Loading/Loading'
import { changeThemeMode } from '../../Utils/storeSettingsUtils'


export default function AdminLayout() {
  const {isLoadingPage, user} = useSelector(s => s.account)
  const {darkMode} = useSelector(s => s.store_settings)
  const [sideBarShow , setSideBarShow ] = useState(sessionStorage.getItem("showSideBar") ? sessionStorage.getItem("showSideBar") === "true" ? true : false : true)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  let a = false

  const logoutHandle = () => {
    clearCookies()
    dispatch(logoutAccount())
    navigate("/admin/account/login", {replace: true})
  }
  useEffect(() => {
    if(a) return
    // eslint-disable-next-line react-hooks/exhaustive-deps
    a = true
    if(!user){
      dispatch(addAuthToState()).unwrap()
      .then(docs => toast.success(docs.message))
      .catch(err => {
        toast.error(err.message)
        logoutHandle()
      })
    }
    changeThemeMode(localStorage.getItem("THEME_MODE") === "darkmode")
  },[])
  useEffect(() => {
    if(darkMode) {
      document.body.classList.add('darkmode');
    } else {
      document.body.classList.remove('darkmode');
    }
}, [darkMode])

  return (
    <Loading loading={isLoadingPage}>
        <main className='AdminLayout'>
          <SideBar sideBarShow={sideBarShow}  setSideBarShow={setSideBarShow}/>
          <article className={"main-container" + (sideBarShow ? " sideBarShow" : "")}>
            <Header logoutHandle={logoutHandle} sideBarShow={sideBarShow} setSideBarShow={setSideBarShow}/>
            <Outlet/>
          <Footer/>
          </article>
        </main>
    </Loading>
  )
}
