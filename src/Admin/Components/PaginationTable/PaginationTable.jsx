import React, { useEffect, useState } from 'react'
import "./PaginationTable.scss"
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { filterQuerysHandler } from '../../../MainUtils/filtersUtils'


export default function PaginationTable({pagination , dispatchFunc}) {
  const {page, pages, length, step} = pagination
  const [pagers, setPagers] = useState([])
  const [currentStep , setCurrentStep] = useState(null)
  
  useEffect(() => {
    let initPagers = []
    for (let i = 0; i < pages; i++) {
        initPagers.push(i + 1)
    }
    let currentIndex = page - 1
    if(pages <= 5) {
      setPagers(initPagers)
    }else{
      if(page > pages - 2) setPagers(initPagers.slice(pages-5,pages+1))
      else setPagers(initPagers.splice(currentIndex - 2 < 0 ? 0 : currentIndex - 2 , 5))
    }
    setCurrentStep(pagination.step)
  }, [pagination])

  const stepHandler = (stp) => {
    setCurrentStep(stp.target.value)
    let obj = {step: stp.target.value}
    filterQuerysHandler(obj,dispatchFunc)
  }
  const pagerNumberHanlder = (p) => {
    if(page === +p) return
    let obj = {page: p, step: currentStep}
    filterQuerysHandler(obj,dispatchFunc)
  }
  const previousPagerHandler = () => {
    if(page === 1) return
    let obj = {page: page - 1, step: currentStep}
    filterQuerysHandler(obj,dispatchFunc)
  }
  const nextPagerHandler = () => {
    if(page === pages) return
    let obj = {page: page + 1, step: currentStep}
    filterQuerysHandler(obj,dispatchFunc)
  }
  
  return (
    <div className="PaginationTable">
    <div className="result">
        <select name='selectStep' value={`${step}`} onChange={stepHandler}>
          {[5,10,15,20,"all"].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {length} Résultats - {page} sur {pages}</div>
        {pages <= 1 ? null : (
            <div className="pagination">
                <div onClick={(previousPagerHandler)} className={`pager previous${page === 1 ? " disabled" : ""}`}><BiChevronLeft/></div>
                {pagers.map(p => (
                  <div onClick={() => pagerNumberHanlder(p)} className={`pager ${p === page ? "active" : ""}`}>{p}</div>
                ))}
                <div onClick={nextPagerHandler} className={`pager next${page === pages ? " disabled" : ""}`}><BiChevronRight/></div>
            </div>
        )}
</div>
  )
}
