import { NavLink, useNavigate } from 'react-router-dom'
import Btn from '../../Components/Btn/Btn'
import Input from '../../Components/Input/Input'
import './AccountPages.scss'
import { BiRightArrow, BiRightArrowAlt } from 'react-icons/bi'
import {useDispatch, useSelector} from 'react-redux'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { loginAccount } from '../../../Store/Admin/accountSlice'

export default function Login() {
  const {isLoading} = useSelector(s => s.account)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Form useState
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // Submit Form
  const submitHandle = (e) => {
    e.preventDefault()
    dispatch(loginAccount({email, password})).unwrap().then((docs) => {
      toast.success("Login has been successfully.")
      // window.cookieStore.set("_authh", "aaaaaaaaaaa")
      document.cookie = `_auth=${docs.token}; path=/; max-age=${24 * 60 * 60 * 1000}`; // 1 day in seconds
      navigate("/admin")
    }).catch(err => toast.error(err.message))
  }
  return (
    <div className='AccountPages'>
        <h2>Welcome !</h2>
        <h3>Log in to your account</h3>
        <form onSubmit={submitHandle}>
            <Input required onChange={e => setEmail(e.target.value)}name="email" id="email" label="Email" type="email"/>
            <Input required onChange={e => setPassword(e.target.value)}name="password" id="password" label="Password" type="password" link={["Forgot password ?", "/admin/account/forgot-password"]}/>
            <br />
            <Btn loading={isLoading} width="full">Login</Btn>
            <div className="footer-p">Create new account, <NavLink to="/admin/account/register">register <BiRightArrowAlt/></NavLink></div>
        </form>
    </div>
  )
}
