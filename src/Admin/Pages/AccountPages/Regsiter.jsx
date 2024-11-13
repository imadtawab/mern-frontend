import { NavLink, useLocation } from 'react-router-dom'
import Btn from '../../Components/Btn/Btn'
import Input from '../../Components/Input/Input'
import './AccountPages.scss'
import { BiRightArrowAlt, BiX } from 'react-icons/bi'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { registerAccount, resendEmail } from '../../../Store/Admin/accountSlice'
import { toast } from 'react-toastify'

export default function Regsiter() {
  const {isLoading} = useSelector(s => s.account)
  const dispatch = useDispatch()
  const [showActivation, setShowActivation] = useState(false)
  const location = useLocation()

  // Form useState
  const [storeName, setStoreName] = useState("")
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm_password, setConfirm_password] = useState("")
  
  // Submit Form
  const submitHandle = (e) => {
    e.preventDefault()
    dispatch(registerAccount({storeName, userName, email, password, confirm_password})).unwrap().then((docs) => {
      setShowActivation(docs.data.email)
      window.history.replaceState(null, "/", "register/activation")
      setStoreName("")
      setUserName("")
      setEmail("")
      setPassword("")
      setConfirm_password("")
    }).catch(err => toast.error(err.message))
  }

  // Handle showing activation page
  useEffect(() => {
    if(window.location.pathname === "/admin/account/register") setShowActivation(false)
  }, [location.pathname])

  return (
    
    showActivation ? <ActivationAccount email={showActivation}/> : (
      <div className='AccountPages'>
      <h2>Welcome !</h2>
      <h3>Create an account</h3>
      <form onSubmit={submitHandle}>
          <Input required onChange={(e) => setStoreName(e.target.value)} value={storeName} name="storeName" id="storeName" label="Store Name"/>
          <Input required onChange={(e) => setUserName(e.target.value)} value={userName} name="userName" id="userName" label="User Name"/>
          <Input required onChange={(e) => setEmail(e.target.value)} value={email} name="email" id="email" label="Email" type="email"/>
          <Input required onChange={(e) => setPassword(e.target.value)} value={password} name="password" id="password" label="Password" type="password"/>
          <Input required onChange={(e) => setConfirm_password(e.target.value)} value={confirm_password} name="confirm_password" id="confirm_password" label="Confirm Password" type="password"/>
          <br />
          <Btn width="full" loading={isLoading}>Create Account</Btn>
          <div className="footer-p">you already have an account, <NavLink to="/admin/account/login">login <BiRightArrowAlt/></NavLink></div>
      </form>
  </div>
    )
  )
}

export function ActivationAccount({email}) {
  const defaultCounter = 60
  const {isLoading} = useSelector(s => s.account)
  const [resendActive , setResendActive] = useState(false)
  const [counter, setCounter] = useState(defaultCounter);
  const dispatch = useDispatch()

  // resend Handle
  const resendEmailHandle = () => {
    dispatch(resendEmail(email)).unwrap().then((docs) => {
    toast.success(docs.message)
      setResendActive(false)
    }).catch(err => toast.error(err.message))
  }

  // Handle conter down
  useEffect(() => {
    if(!resendActive){
      const intervalId = setInterval(() => {
        if (counter > 0) {
          setCounter((prevCounter) => prevCounter - 1);
        } else {
          clearInterval(intervalId);
          setResendActive(true)
          setCounter(defaultCounter)
        }
      }, 1000);
    return () => clearInterval(intervalId);
    }
  }, [counter , resendActive]);
  return (
    <div className='AccountPages'>
        <h2>Activation account !</h2>
        <h3>Please check your mailbox</h3>
            <div className="icon-account danger"><BiX/></div>
            <h4>{email}</h4>
            <div className="footer-p">You will be able to send a new email in {`${Math.floor(counter / 60) >= 10 ? Math.floor(counter / 60) : "0" + Math.floor(counter / 60)}:${Math.floor(counter % 60) >= 10 ? Math.floor(counter % 60) : "0" + Math.floor(counter % 60)}`}</div>
            <br />
            <Btn width="full" loading={isLoading} onClick={resendEmailHandle} disabled={!resendActive}>Resend Email</Btn>
    </div>
  )
}
