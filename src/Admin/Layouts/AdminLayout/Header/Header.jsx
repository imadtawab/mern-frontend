import "./Header.scss";
import { BiMenu , BiBell, BiSolidCog } from 'react-icons/bi'
import { IoStorefront } from "react-icons/io5";
import { FaArrowRightToBracket, FaUserLarge } from 'react-icons/fa6'
import { NavLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { changeThemeMode } from "../../../Utils/storeSettingsUtils";


export default function Header({setSideBarShow,sideBarShow, logoutHandle}) {
  
  const {user} = useSelector(s => s.account)
  const {darkMode} = useSelector(s => s.store_settings)
  const [profileMenu, setProfileMenu] = useState(false)
  
  const dropdownRef = useRef(null);
          // Event listener for click outside the dropdown
          const handleOutsideClick = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
              setProfileMenu(false);
            }
          };
      useEffect(() => {
          // Attach the event listener when the component mounts
          document.addEventListener('click', handleOutsideClick);
      
          // Clean up the event listener when the component unmounts
          return () => {
            document.removeEventListener('click', handleOutsideClick);
          };
        }, []); // Empty dependency array ensures the effect runs only once


        
  return (
    <header className="Header">
        <div onClick={()=>{
          setSideBarShow(!sideBarShow)
          sessionStorage.setItem("showSideBar",!sideBarShow)
          }} className="menu-icon">
          <BiMenu/>
        </div>
        <div className="bar">
          <div className="mode">
            {darkMode ? <MdLightMode onClick={() => changeThemeMode(false)}/> : <MdDarkMode onClick={() => changeThemeMode(true)}/>}
          </div>
          <div className="notification">
            <BiBell/>
          </div>
          <div   className="profile">
            <div  onClick={()=> setProfileMenu(!profileMenu)} ref={dropdownRef} style={{backgroundImage: `url(${user?.avatar})`}} className="img">
            </div>
            <div className="info">
              <h6>{user?.userName || "admin"}</h6>
              {/* @@@@@@ */}
              {/* {user?.storeOwner?.name && <NavLink target="_blanc" className="storeName" to={`${window.location.protocol}//${user?.storeOwner?.name}.${window.location.host}`}><IoStorefront />{user?.storeOwner?.name}</NavLink>} */}
              {user?.storeOwner?.name && <NavLink target="_blanc" className="storeName" to={window.location.origin}><IoStorefront />{user?.storeOwner?.name}</NavLink>}
            </div>
            <ul className={`menu ${profileMenu ? " active" : ""}`}>
              <li>  
                <NavLink to="/admin/account/profile">
                <FaUserLarge/>
                  Profile
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/settings">
                <BiSolidCog/>
                  Settings
                </NavLink>
              </li>
              <li onClick={logoutHandle}>
                <div>
                <FaArrowRightToBracket/>
                  Logout
                </div>
              </li>
            </ul>
          </div>
        </div>
    </header>
  );
}
