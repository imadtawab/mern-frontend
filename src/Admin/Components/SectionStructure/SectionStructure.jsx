import EmptyErrorSection from '../../../MainComponent/EmptyErrorSection/EmptyErrorSection'
import Loading from '../../../MainComponent/Loading/Loading'
import './SectionStructure.scss'

export default function SectionStructure({children , title ,bg ,pd,controlls , flex,style,sub_p , alone , key, loading, length}) {
    // children = content
    // title
    // bg = grey
    // pd = "none"
  return (
    <div key={key} style={{flex : flex ? flex : "",...style}} className={`SectionStructure${bg==="grey" ? " grey" : ""}${pd==="none" ? " pd-none" : ""}${alone ? " alone" : ""}`}>
        {(title && !controlls) && 
            <>
            <h3>{title}</h3>
            {sub_p && (
              <p>{sub_p}</p>
            )}
            </>
        }
        {controlls &&
            <><div className='Controlls-sett'>
              {title && (
            <h3>{title}</h3>
              )}
              {controlls}
            </div>
             {sub_p && (
              <p>{sub_p}</p>
            )}
            </>
        }
        {loading ? <Loading loading={true}/> : (typeof(length) === "number" ? (length > 0 ? children : <EmptyErrorSection/>) : children)}
    </div>
  )
}
