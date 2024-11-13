import { BiSolidStar, BiSolidStarHalf, BiStar, BiStoreAlt } from 'react-icons/bi'
import './CustomerReviews.scss'
import avatar from '../../../Assets/undefined_avatar.png'
import InputBox, { TextAreaBox } from '../../../MainComponent/InputBox/InputBox'
import CercleLoading from '../../../MainComponent/CercleLoading/CercleLoading'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addCustomerReview } from '../../../Store/Client/productSlice'
import { toast } from 'react-toastify'
import moment from 'moment'
import { ratingStarsHandler } from '../../Utils/productUtils'


export default function CustomerReviews({_id, productName , reviews=[]}) {
    const {isLoading} = useSelector(s => s.client_product)
    const dispatch = useDispatch()

    const [rating, setRating] = useState({e: null, v: null})
    const [comment, setComment] = useState(null)
    const [name, setName] = useState(null)
    const [email, setEmail] = useState(null)

const submitHandler = e => {
    e.preventDefault()
    if(!rating.v) return setRating(prev => {return {...prev, e: "Please select a rating."}})
    let body = {rating: rating.v,comment,name,email}
    console.log(body)
    dispatch(addCustomerReview({_id, body})).unwrap()
    .then(docs => {
        setRating({e: null, v: null})
        setComment("")
        setName("")
        setEmail("")
        reviews.push(docs.data)
        console.log(reviews)
        toast.success(docs.message)
    })
    .catch(err => toast.error(err.message))
}
  return (
    <article className='CustomerReviews'>
        <section className="reviews">
            <h6>{reviews.length ? `${reviews.length} avis pour ${productName}` : "Avis"}</h6>
            {!reviews.length ? <div className="empty-reviews">Il n'y a pas encore d'avis.</div> : reviews.map(rev => (
                            <div key={rev._id} className="review-box">
                            <div className="customer">
                                <div className="avatar"><img src={avatar} alt="" /></div>
                                <div className="info">
                                    <div className="name">
                                        {rev.name} <span>– {moment(rev.createdAt).format("DD/MM/YYYY")}</span>
                                    </div>
                                    <p>{rev.comment}</p>
                                </div>
                            </div>
                            <div className="rating-stars">
                                {ratingStarsHandler(rev.rating)}
                            </div>
                    </div>
            ))}
        </section>
        <section className="add-review">
            <h6>Ajouter un Avis</h6>
            <form onSubmit={submitHandler}>
                <InputBox row required label="Votre note" personelInput={<div className='rating-stars'>
                    {[5,4,3,2,1].map(rat => (
                        <span key={rat} onClick={() => setRating({e: null, v: rat})} className={rating.v === rat ? "active" : ""}><BiSolidStar/><BiStar className='empty'/></span>
                    ))}
                    
                </div>}/>
                {rating.e && <div className="rating-error">{rating.e}</div>}

                <TextAreaBox value={comment} onChange={e => setComment(e.target.value)} required type="text" name="comment" id="comment" placeholder="Votre avis" label="Votre avis"/>
                <InputBox value={name} onChange={e => setName(e.target.value)} required type="text" name="name" id="name" placeholder="Nom" label="Nom"/>
                <InputBox value={email} onChange={e => setEmail(e.target.value)} required type="text" name="email" id="email" placeholder="Email" label="Email"/>
                <button disabled={isLoading} type='submit'>{isLoading ? "... loading" : "Soumettre"}</button>
            </form>
        </section>
    </article>
  )
}
