import './CercleLoading.scss'

export default function CercleLoading({type , size, absolute}) {
    // type : btn
    // size : l
  return (
    <div className={`CercleLoading ${type ? type : ""} ${size ? size : ""} ${absolute ? "absolute" : ""}`}>
        <div className="cercle"></div>
    </div>
  )
}
