import { BsFillExclamationOctagonFill } from 'react-icons/bs'
import './InputBox.scss'
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

export default function InputBox({row, disabled, slugColor, slugBg,autoComplete, autoFocus, autoCapitalize, checkValueInDB, error, type, name, id, placeholder, label , value , personelInput,onChange,required , mx_width , flex , pd , leftSlug , rightSlug , borderSlug , slugWrap}) {    
  return (
      <div style={flex ? {flex: +flex} : {}} className={"InputBox" + (error ? " error" : "") + (mx_width ? " mx_width" : "") + (pd === "none" ? " pd-none" : "") + (row ? " row" :"")}>
          {label && (
            <>
                <label htmlFor={id}>{label}{required && <div className="required">*</div>}</label>
              
              </>
          )}
          {personelInput ? (
            personelInput
          ) : (
            (leftSlug || rightSlug) ? (
              <>
              <div style={{"--slug-bg": slugBg, "--slug-cl": slugColor}} className={`input-slug${borderSlug === "none" ? " border-none" : ""}${slugWrap ? " slug-wrap" : ""}`}>
                {leftSlug && <label className='left-slug' htmlFor={id}>{leftSlug}</label>}
                <input disabled={disabled} autoFocus={autoFocus} autoCapitalize={autoCapitalize} autoComplete={autoComplete} required={required} onChange={onChange} value={value} placeholder={placeholder} type={type ? type : "text"} name={name} id={id} />
                {rightSlug && <label className='right-slug' htmlFor={id}>{rightSlug}</label>}
              </div>
              {checkValueInDB && (
                <div className="checking-message">
                  {checkValueInDB.isLoadingSlug || checkValueInDB.pauseCheckingDuration ? <div className="loading">Checking availability...</div> : checkValueInDB.message && (
                    checkValueInDB.checked ? 
                    <div className="success"><FaCheckCircle/>{checkValueInDB.message}</div> :
                    <div className="error"><FaExclamationTriangle />{checkValueInDB.message}</div>
                  )}
                </div>
              )}
              {error ? (
                <span className='error-span'><BsFillExclamationOctagonFill/>{error}</span>
              ) : false}
              </>
            ) : (
            <>
            <input disabled={disabled} autoFocus={autoFocus} autoCapitalize={autoCapitalize} autoComplete={autoComplete} required={required} onChange={onChange} value={value} placeholder={placeholder} type={type ? type : "text"} name={name} id={id} />
            {error ? (
              <span className='error-span'><BsFillExclamationOctagonFill/>{error}</span>
            ) : false}
            </>
            )
          ) }
      </div>
    )
  }

  export function TextAreaBox({name, id, placeholder, label, value, onChange , required,error}) {
    return (
      <div className={"TextAreaBox" + (error ? " error" : "")}>
          {label && (
              <label htmlFor={id}>{label}{required && <div className="required">*</div>}</label>
          )}
          <textarea required={required} onChange={onChange} value={value} placeholder={placeholder} name={name} id={id} />
          {error ? (
              <span className='error-span'><BsFillExclamationOctagonFill/>{error}</span>
            ) : false}
      </div>
    )
  }
  export function SelectBox({disabled,name, id, placeholder, label, children, onChange , required, style , value , defaultValue,subLabel , pd ,flex}) {
    return (
      <div style={flex ? {flex: +flex , ...style} : style} className={"SelectBox" + (pd === "none" ? " pd-none" : "")}>
          {label && (
              subLabel ? (
              <div className="sub-label">
                <label htmlFor={id}>{label}{required && <div className="required">*</div>}</label>
                {subLabel}
              </div>
              ) : (
                <label htmlFor={id}>{label}{required && <div className="required">*</div>}</label>
              )
          )}
          <select disabled={disabled} defaultValue={defaultValue} value={value} required={required} onChange={onChange} placeholder={placeholder} name={name} id={id}>
            {children}
          </select>
      </div>
    )
  }
