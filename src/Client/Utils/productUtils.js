import { BiSolidStar, BiSolidStarHalf, BiStar } from "react-icons/bi"

export const ratingStarsHandler = (rating) => {
    return Array.from({ length: 5 }).map((_,i) => {
        if(rating % 1 !== 0 && i === Math.floor(rating)) return <span key={"rating" + i}><BiSolidStarHalf/></span>
        if(i < rating) return <span key={"rating" + i}><BiSolidStar/></span>
        else return <span key={"rating" + i} className='empty'><BiStar/></span>
    })
}