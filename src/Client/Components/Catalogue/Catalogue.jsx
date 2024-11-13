import './Catalogue.scss'
import { useEffect, useRef, useState } from "react";

export default function Catalogue({items, current}) {
  const panels = items || []
  const [activePanel, setActivePanel] = useState(0);

  let coursel = document.getElementById("coursel")

  // dragging
  let mouseDown = false
  let startX, startScrollLeft

  
  function startScrollFunc(pageX) {
    if(panels.length <= 1) return 
    mouseDown = true
    startX = pageX
        startScrollLeft = +coursel.dataset.scrollx
    coursel.style.transition = "transform 0s"
  }
  const mouseDownHandle = (e) => {
    startScrollFunc(e.pageX)
  }
  const touchStartHandle = (e) => {
    startScrollFunc(e.touches[0].pageX)
  }
  function endScrollFunc(pageX) {
    if(panels.length <= 1) return 
    mouseDown = false
    coursel.style.transition = null
    let widthItem = coursel.querySelector("#coursel span").offsetWidth
    let widthCoursel = coursel.offsetWidth

    let scroll = (startScrollLeft - (pageX - startX))
    
    let newScrollRound = Math.round(scroll / widthItem) * widthItem || 0

    let newScroll = newScrollRound / widthCoursel

    if(newScroll < 0) {
      coursel.setAttribute("data-scrollx" , 0)
      coursel.style.left = `${-0}px`
      return
    }
    if(newScroll > panels.length - 1) {
      coursel.setAttribute("data-scrollx" , widthCoursel * (panels.length -1))
      coursel.style.left = `-${widthCoursel * (panels.length -1)}px`
      return
    }
      coursel.setAttribute("data-scrollx" , newScrollRound)
      coursel.style.left = `${-newScrollRound}px`
      setActivePanel(newScroll)      
  }
  const mouseUpHandle = (e) => {
    coursel.style.cursor = "default"
    endScrollFunc(e.pageX)

  }
  const touchEndHandle = (e) => {
    endScrollFunc(e.changedTouches[0].pageX)
  }
  function moveScrollFunc(pageX) {
    if(panels.length <= 1) return 

    if(mouseDown) {
      let newScroll = (startScrollLeft - (pageX - startX))

      coursel.setAttribute("data-scrollx" , newScroll)
      coursel.style.left = `${-newScroll}px`
      coursel.style.cursor = "grabbing"
    }
  }
  const mouseMoveHandle = (e) => {
    moveScrollFunc(e.pageX)
  }
  const touchMoveHandle = (e) => {
    moveScrollFunc(e.touches[0].pageX)
  }
  const blurHandle = (e) => {
  mouseDown && mouseUpHandle(e)
  }

  const backwardHandler = (e) => {
    if(activePanel > 0) {
    let widthCoursel = coursel.offsetWidth
    let newPanel = activePanel - 1
    coursel.setAttribute("data-scrollx" , newPanel * widthCoursel)
    setActivePanel(newPanel)
    }
  }
  const forwardHandler = (e) => {
    if(activePanel < panels.length - 1) {
        let widthCoursel = coursel.offsetWidth

      let newPanel = activePanel + 1
          coursel.setAttribute("data-scrollx" , newPanel * widthCoursel)

      setActivePanel(newPanel)
    }
  }
  const indicatorsHandler = idx => {
          let widthCoursel = coursel.offsetWidth
          coursel.setAttribute("data-scrollx" , idx * widthCoursel)
    setActivePanel(idx)
  }

  useEffect(() => {
    let index = items.indexOf(current)
    setActivePanel(index === -1 ? 0 : index)
  }, [current])
  
  return (
    <div className='Catalogue'>
        <div className="coursel-container">
          <div className="parent-hedden">
            <div data-scrollx="0" id="coursel" onMouseLeave={blurHandle} onMouseMove={mouseMoveHandle} onTouchMove={touchMoveHandle} onMouseDown={mouseDownHandle} onTouchStart={touchStartHandle} onMouseUp={mouseUpHandle} onTouchEnd={touchEndHandle} 
            style={{left: `-${activePanel * 100}%`}} className="coursel-slider">
              {panels.map((val) => (
              <span key={"panels" + val} draggable="false">
                <img draggable="false" loading='lazy' src={`${process.env.REACT_APP_SERVER_DOMAINE}/media/${val}`} alt="" />
              </span>
            ))}
            </div>
          </div>
          {panels.length > 1 && (
            <div className="coursel-controll">
              <button disabled={activePanel <= 0} onClick={backwardHandler} className={'backward'}></button>
              <button disabled={activePanel >= panels.length - 1} onClick={forwardHandler} className={'forward'}></button>
            </div>
          )}
        </div>
        {panels.length > 1 && (
        <div className="coursel-indicators">
        {panels.map((_, idx) => (
            <span key={"panels_1" + idx} onClick={() => indicatorsHandler(idx)} key={`indicator-${idx}`} className={idx === activePanel ? "active" : ""}></span>
          ))}
        </div>      
        )}
    </div>
  )
}
