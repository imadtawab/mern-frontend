import { NavLink } from 'react-router-dom'
import './ProductsSection.scss'
import { BsCart3, BsFilter, BsSearch, BsX } from 'react-icons/bs'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RiHeartAddLine } from "react-icons/ri";
import { TbEyeHeart } from "react-icons/tb";
import CercleLoading from '../../../MainComponent/CercleLoading/CercleLoading'
import ClientSectionStructure from '../ClientSectionStructure/ClientSectionStructure'
import { getProductDetails, getProducts } from '../../../Store/Client/productSlice'
import { SelectBox } from '../../../MainComponent/InputBox/InputBox'
import { addToCart, addToWishList, deleteFromWishList } from '../../../Store/Client/shoppingCartSlice'
import { activeSideCart } from '../../Utils/sideCartUtils'
import FilterProductsSection from '../FilterProductsSection/FilterProductsSection'
import Loading from '../../../MainComponent/Loading/Loading'
import { ratingStarsHandler } from '../../Utils/productUtils'
import RatingStars from '../RatingStars/RatingStars'

export default function ProductsSection({filter, wishList, title, subTitle, products, setProducts, emptyMessage}) {
    const dispatch = useDispatch()
    const [openFilter , setOpenFilter] = useState(false)
    const {isLoadingPage, isLoadingProduct, isLoadingFilter} = useSelector(s => s.client_product)
    const [choices, setChoices] = useState(null)
    const [optionSelected, setOptionSelected] = useState({})
    const [prices, setPrices] = useState(null)
    const [itemsInWishList, setItemsWishList] = useState([])


  const addToCartHandle = (e,choice , prod) => {
    e.preventDefault()
    if(choice) return dispatch(getProductDetails(prod.slug)).unwrap().then(docs => {
      let options = {}
      docs.data.options.forEach(option => {
        options[option._id] = option.values[0]._id
      })
      setOptionSelected(options)
      setPrices(docs.data.prices)
      setChoices(docs.data)
    }).catch(err => console.log(err.message))
    
    let variant
    if(!choice && !prod) {
      let {name, image, prices, quantity, _id} = findOptionHandler()
      variant = {
        name, image, ...prices, quantity, _id,
        quantityUser: 1
      }
    } else {
      variant = {
        image: prod.media.images[0],
        originalPrice: +prod.prices.originalPrice,
        salePrice: +prod.prices.salePrice,
        quantity: +prod.quantity,
        _id: prod._id,
        quantityUser: 1
      }
    }
    let p = (!choice && !prod) ? choices : prod
    let product = {
      _id: p._id,
      image: p.media.images[0],
      name: p.name,
      slug: p.slug,
      category: p.categoryOwner.name,
    }
    dispatch(addToCart({product, variant})).unwrap()
    .then(docs => {
      activeSideCart(true)
      setChoices(null)
      setOptionSelected({})
      setPrices(null)

    }).catch(err => console.log(err.message))
  }

  const closeChoices = (e) => {
    if(e.target.classList.contains("choices-section")) setChoices(null)
  }

  const changeOptionHandler = (att_id, v_id) => {
    setOptionSelected(prev => {
      return {
        ...prev,
        [att_id]: v_id
      }
    })
  }
  const findOptionHandler = () => {
    let option = choices?.variantsOwner.find(option => {
      let isTrue = option.option_array.every(opt => {
        let key = opt[0]
        let value = opt[1]
        return optionSelected[key] === value
      })
      return isTrue && option
    })
    return option
  }
  const addToWishListHnadler = (_id) => {
    dispatch(addToWishList(_id)).unwrap()
    .then(docs => setItemsWishList(prev => [...prev , _id]))
    .catch(err => console.log(err))
  }
  const deleteFromWishListHandler = (_id) => {
    dispatch(deleteFromWishList(_id)).unwrap()
    .then(docs => setProducts(prev => prev.filter(prod => prod._id !== _id)))
  }
  useEffect(() => {
    if(!choices?.variantsOwner.length) return
    setPrices(findOptionHandler().prices)
  }, [optionSelected])

    
  return (
    <div className="ProductsSection">
      {choices && (
      <div onClick={closeChoices} className="choices-section">
                    <div className="choices-container">
          <div className="top-choices">
              <h2>Choix des options</h2>
              <div onClick={() => setChoices(null)} className="close-btn"><BsX/></div>
          </div>
          <div className="content-choices">
          
          {choices?.options.map(option => (
          <div key={option._id } className={"variant " + option.type}>
          <div className="name">{option.public_name} :</div>
          <div className="parent-variants">
            {option.type === "colorSpans" ? (
              option.values.map((v, index )=> (
                <span key={index*1} onClick={() => changeOptionHandler(option._id, v._id)} className={v._id === optionSelected[option._id] ? "active" : ""} style={{background: v.color}}>
                </span>
              ))
            ) :option.type === "checkBox" ? (
              option.values.map((v, index )=> (
                <span key={index*2} onClick={() => changeOptionHandler(option._id, v._id)} className={v._id === optionSelected[option._id] ? "active" : ""} >{v.name}</span>
              ))
            ) :option.type === "dropDown" ? (
              <SelectBox  onChange={(e) => changeOptionHandler(option._id, e.target.value)}>
                {option.values.map((v, index )=> (
                  <option key={index*3} selected={v._id === optionSelected[option._id]} value={v._id}>{v.name}</option>
                ))}
              </SelectBox>
            ) : false}
          </div>
        </div>
          ))}
      
          </div>
          <div className="prices">
            Price: <span>{prices?.salePrice} MAD</span>
          </div>
          <div className="buttom-choices">
              <div onClick={(e) => addToCartHandle(e, false, null)}>Ajouter au panier</div>
              <NavLink to={`/products/${choices.slug}`}>Voir les détails</NavLink>
          </div>
          </div>
      </div>
        )}
    <ClientSectionStructure loading={!filter && isLoadingPage} length={!filter && products.length} subTitle={subTitle} title={title} emptyMessage={emptyMessage}>
        <div className="products-container">
        {filter && <FilterProductsSection openFilter={openFilter} setOpenFilter={setOpenFilter} setProducts={setProducts}/>}
        <div className="products-section">
        {filter && <div onClick={() => setOpenFilter(true)} className='top-products-section'><BsFilter/> Show Filter</div>}
            <Loading loading={isLoadingFilter}>
              <div className='products-grid'>
                  {products.map(prod => (
                      <NavLink key={prod._id} to={`/products/${prod.slug}`} className="box-product">
                          {prod.prices.discount ? (
                              <>
                                                  <span className='kanba'></span>
                          <div className="promo">-{prod.prices.discount}%</div>
                          </>
                          ) : null}
                          <div onClick={(e) => e.preventDefault()} className="more-controlles">
                              <span data-content="Apérçu rapide"><BsSearch/></span>
                              {wishList ? (
                              <span onClick={() => deleteFromWishListHandler(prod._id)} className='delete' data-content="Supprimer">
                              <BsX/>
                              </span>
                              ) : (
                                !wishList && !itemsInWishList.find(i => i === prod._id) ? (
                                  <span onClick={() => addToWishListHnadler(prod._id)} data-content="Ajouter aux favories">
                                  <RiHeartAddLine/>
                                  </span>
                                  ) : (
                                <NavLink to="/wishlist" className='fill' data-content="Parcourir mes favories">
                                    <TbEyeHeart/>
                                  </NavLink>
                                  )

                              )}
                          </div>
                          <div className="image">
                              <img loading='lazy' src={`${process.env.REACT_APP_SERVER_DOMAINE}/media/${prod.media.images[0]}`} alt={prod.name} />
                              {/* <img loading='lazy' src={prod.image} alt={prod.name} /> */}
                              <div onClick={e => addToCartHandle(e , prod.variantsOwner.length, prod)} className="buy">
                                <span>{prod.variantsOwner.length > 0 ? "Choix des options" : "Ajouter au panier"}</span>
                                <span>{isLoadingProduct ? <CercleLoading type="btn"/> : <BsCart3/>}</span>
                                </div>
                          </div>
                          <p>{prod.categoryOwner.name}</p>
                          <h2>{prod.name}</h2>
                          {prod?.reviewsOwner.length ? (<div className="rating-stars">
          {ratingStarsHandler(prod?.reviewsOwner.map(r => r.rating).reduce((a,b) => a+b, 0) / prod?.reviewsOwner.length)}
        </div>) : null}
        
                          <div className="prices">
                          {prod.prices.originalPrice ? <div className="originalPrice">{prod.prices.originalPrice}<span>mad</span></div> : null}
                            <div className="salePrice">{prod.prices.salePrice}<span>mad</span></div>
                          </div>
                      </NavLink>
                  ))}
              </div>
            </Loading>
        </div>
        </div>
    </ClientSectionStructure>
    </div>
  )
}
