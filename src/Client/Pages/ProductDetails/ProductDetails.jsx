import { BsHeart, BsHeartFill } from "react-icons/bs";
import "./ProductDetails.scss";
import { BiMinus, BiPlus } from "react-icons/bi";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import Loading from '../../../MainComponent/Loading/Loading'
import { SelectBox } from '../../../MainComponent/InputBox/InputBox'
import { getProductDetails } from "../../../Store/Client/productSlice";
import PageNotFound from "../../../Admin/Components/PageNotFound/PageNotFound";
import { addToCart, addToWishList, deleteFromWishList } from "../../../Store/Client/shoppingCartSlice";
import { activeSideCart } from "../../Utils/sideCartUtils";
import Catalogue from "../../Components/Catalogue/Catalogue";
import CustomerReviews from "../../Components/CustomerReviews/CustomerReviews";
import { ratingStarsHandler } from "../../Utils/productUtils";

export default function ProductDetails() {
    const dispatch = useDispatch()
    const {slug} = useParams()

    const {isLoadingProduct} = useSelector(s => s.client_product)
    
    const [product, setProduct] = useState(null)
    const [currentImage, setCurrentImage] = useState(null)
    const [quantite, setQuantite] = useState(1)
    const [optionSelected, setOptionSelected] = useState({})
    const [prices, setPrices] = useState(null)
    const [variantId, setVariantId] = useState(null)

    const [isInWishList, setIsInWishList] = useState(false)

    const changeOptionHandler = (att_id, v_id) => {
      setOptionSelected(prev => {
        return {
          ...prev,
          [att_id]: v_id
        }
      })
    }
    const findOptionHandler = () => {
      let option = product?.variantsOwner.find(option => {
        let isTrue = option.option_array.every(opt => {
          let key = opt[0]
          let value = opt[1]
          return optionSelected[key] === value
        })
        return isTrue && option
      })
      return option
    }
    const addToCartHandle = () => {
   
      let variant
      if(product.variantsOwner.length) {
        let {name, image, prices, quantity, _id} = findOptionHandler()
        variant = {
          name, image, ...prices, quantity, _id,
          quantityUser: quantite
        }
      } else {
        variant = {
          image: product.media.images[0],
          originalPrice: +product.prices.originalPrice,
          salePrice: +product.prices.salePrice,
          quantity: +product.quantity,
          _id: product._id,
          quantityUser: quantite
        }
      }
      let prod = {
        _id: product._id,
        image: product.media.images[0],
        name: product.name,
        slug: product.slug,
        category: product.categoryOwner.name,
      }
      dispatch(addToCart({product: prod, variant})).unwrap()
      .then(docs => {
        activeSideCart(true)
        setQuantite(1)
      }).catch(err => console.log(err.message))
    }

    useEffect(() => {
      if(!product?.variantsOwner.length) return
      let option = findOptionHandler()
      setCurrentImage(option?.image)
      setPrices(option?.prices)
      setVariantId(option?._id)
    }, [optionSelected])

    
    useEffect(() => {
      activeSideCart(false)
      dispatch(getProductDetails(slug)).unwrap()
      .then(docs => {
        setProduct(docs.data)
        let options = {}
        docs.data.options.forEach(option => {
        options[option._id] = option.values[0]._id
        })
        setOptionSelected(options)
        setCurrentImage(docs.data.media.images[0])
        setPrices(docs.data.prices)
      console.log(docs.data)
      })
      .catch(err => console.log(err))
    }, [window.location.pathname])
    
    const addToWishListHnadler = () => {
      dispatch(addToWishList(product._id)).unwrap()
      .then(docs => setIsInWishList(true))
    }
    const deleteFromWishListHandler = () => {
      dispatch(deleteFromWishList(product._id)).unwrap()
      .then(docs => setIsInWishList(false))
    }

    const rating = product?.reviewsOwner.map(r => r.rating).reduce((a,b) => a+b, 0) / product?.reviewsOwner.length

    if(!product && !isLoadingProduct) return <PageNotFound to="/products"/>
  return (
    <div className="ProductDetails">
      <Loading loading={isLoadingProduct}>
      <div className="parent">
    {/* <div className="catalogue">
      <div className="main-image">
        {prices?.discount ? (
          <>
          <span className='kanba'></span>
          <div className="promo">-{prices.discount}%</div>
          </>
        ) : null}
        {product?.media.images.map(img => (
          <img key={img} loading='lazy' className={img === currentImage ? "active" : ""} src={`${process.env.REACT_APP_SERVER_DOMAINE}/media/${img}`} alt="" />
        ))}
      </div>
      <div className="all-images">
      {product?.media.images.map(img => (
        <div key={img} className={`box ${img === currentImage ? "active" : ""}`}>
          <img loading='lazy' onClick={() => setCurrentImage(img)} src={`${process.env.REACT_APP_SERVER_DOMAINE}/media/${img}`} alt="" />
        </div>
      ))}

      </div>
    </div> */}
    <Catalogue items={product?.media.images} current={currentImage}/>
    <div className="info">
      <div className="category">
        {product?.categoryOwner.name}
      </div>
      <h1>{product?.name}</h1>
      <div className="price">
        {prices?.originalPrice ? (
          <div className="originalPrice">
              {prices.originalPrice} <span>mad</span>
            </div>
        ) : null}
        <div className="salePrice">
          {prices?.salePrice} <span>mad</span>
        </div>
        {product?.reviewsOwner.length ? (<div className="rating-stars">
          {ratingStarsHandler(rating)}
          <a href="#reviews" className="rating-length">({product?.reviewsOwner.length} avis client)</a>
        </div>) : null}
      </div>
      <div className="variants">
        {product?.options.map(att => (
          <div key={att._id } className={"variant " + att.type}>
            <div className="name">{att.public_name} :</div>
            <div className="parent-variants">
              {att.type === "colorSpans" ? (
                att.values.map((v, index )=> (
                  <span key={index*1} onClick={() => changeOptionHandler(att._id, v._id)} className={v._id === optionSelected[att._id] ? "active" : ""} style={{background: v.color}}>
                  </span>
                ))
              ) :att.type === "checkBox" ? (
                att.values.map((v, index )=> (
                  <span key={index*2} onClick={() => changeOptionHandler(att._id, v._id)} className={v._id === optionSelected[att._id] ? "active" : ""} >{v.name}</span>
                ))
              ) :att.type === "dropDown" ? (
                <SelectBox  onChange={(e) => changeOptionHandler(att._id, e.target.value)}>
                  {att.values.map((v, index )=> (
                    <option key={index*3} selected={v._id === optionSelected[att._id]} value={v._id}>{v.name}</option>
                  ))}
                </SelectBox>
              ) : false}
            </div>
          </div>
        ))}
        <div className="variant">
          <div className="name">Quantite :</div>
            <div className="controller">
              <button disabled={quantite === 1} onClick={() => setQuantite(prev => prev > 1 ? --prev : prev)} className="minus"> <BiMinus/> </button>
              <input type="text" disabled value={quantite} />
              <button disabled={quantite === 10} onClick={() => setQuantite(prev => prev < 10 ? ++prev : prev)} className="plus"> <BiPlus/> </button>
            </div>
        </div>
      </div>
      <div className="footer">
        <div className="btns">
          {/* <div className="buy">Commander Maintenant</div> */}
          <div className="btns-container">
            <div onClick={addToCartHandle} className="add-to-card">Ajouter au panier</div>
            <div className={`favorate`}>
              {isInWishList ?
              <BsHeartFill className="active" onClick={deleteFromWishListHandler}/> :
              <BsHeart onClick={addToWishListHnadler}/>
              }
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className="product-details-section">
        <h5>Description :</h5>
        <div dangerouslySetInnerHTML={{ __html: product?.description }}/>
      </div>
      <div id='reviews' className="product-details-section">
        <h5>Customer Reviews :</h5>
        <CustomerReviews _id={product?._id} productName={product?.name} reviews={product?.reviewsOwner}/>
      </div>
      </Loading>
  </div>
  );
}

