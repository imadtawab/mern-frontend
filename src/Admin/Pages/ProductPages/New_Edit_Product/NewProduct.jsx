import "./New_Edit_Product.scss";
import React, { useState, useRef, useEffect } from "react";
import JoditEditor from "jodit-react";
import { BiSolidCamera } from "react-icons/bi";
import { BsTrash, BsX, BsFillStarFill } from "react-icons/bs";
import { FaEye } from "react-icons/fa6";
import { GrRefresh } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import PageStructure from '../../../Components/PageStructure/PageStructure'
import SectionStructure from '../../../Components/SectionStructure/SectionStructure'
import InputBox, {TextAreaBox, SelectBox} from '../../../../MainComponent/InputBox/InputBox'
import GridSections from '../../../Components/GridSections/GridSections'
import BtnsFooter from '../../../Components/BtnsFooter/BtnsFooter'
import Btnx from "../../../Components/Btnx/Btnx";
import {toast} from 'react-toastify'
import { getCategories, getCategoriesForProduct } from "../../../../Store/Admin/categorySlice";
import { checkProductSlug, newProduct } from "../../../../Store/Admin/productSlice"
import Loading from "../../../../MainComponent/Loading/Loading";
import { Modal } from '../../../Utils/modalUtils'


export default function NewProduct() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

const { isLoadingPage: catgLoading } = useSelector(s => s.category) 
const { isLoadingSlug } = useSelector(s => s.product) 

  const editor = useRef(null);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({
    name:  "",
    sku:  "",
    category: "",
    originalPrice:  "",
    salePrice:  "",
    discount:  "",
    slug:  "",
    metaTitle:  "",
    metaKeywords:  "",
    metaDescription:  "",
    status: 1,
    publish: 1,
    quantity:  "",
  });
  const changeFormHandle = (eo) => {
    setForm({ ...form, [eo.target.name]: eo.target.value })
  };

  // This is for categories -- start
  const [categories, setCategories] = useState([])
  const getCategoriesHandle = () => {
    dispatch(getCategoriesForProduct()).unwrap()
    .then(docs => setCategories(docs.data))
    .catch(err => toast.error(err.message))
  }
  useEffect(() => {
    getCategoriesHandle()
  }, [])
  // This is for categories -- end

  // This is for slug -- start
  const [slugChecked, setSlugChecked] = useState({checked: true, message: null})
  const [pauseCheckingDuration, setPauseCheckingDuration] = useState(false)

  const checkSlugHandler = (e) => {
    changeFormHandle(e)
    setPauseCheckingDuration(true)
    if(!pauseCheckingDuration){
        if(!e.target.value) {
          setSlugChecked({checked: false, message: "Slug is required."})
          setPauseCheckingDuration(false)
          return
        }
        setPauseCheckingDuration(false)
        let setTimeOut = setTimeout(() => {
          dispatch(checkProductSlug({slug: e.target.value})).unwrap().then((docs) => {
            setSlugChecked(docs)
            clearTimeout(setTimeOut)
        }).catch(err => toast.error(err.message))
      }, 1000);
    }
  }
  // This is for slug -- end

  // This is for product -- start
  const [showImage, setShowImage] = useState(null)
  const newProductHandler = (e, vairantsSelect) => {
    e.preventDefault()
    if(!images.length) return toast.error("The main image is required")
    if(!slugChecked.checked) return
    let body = {...form, description, images: images.map(img => img.post)}
    function createFormData() {
      const formData = new FormData();
      Object.keys(body).forEach((key) => {
          if (key === 'images') {
              body[key].forEach((img) => {
                  formData.append(`images`, img);
              });
          } else {
              formData.append(key, body[key]);
          }
      });
      return formData;
  }
    let dispatchNewProduct = () => {
      dispatch(newProduct(createFormData()))
        .unwrap()
        .then((docs) => {
          toast.success(docs.message);
          Modal(false, null);
          vairantsSelect ? navigate(`/admin/products/variants/${docs._id}`) : navigate("/admin/products")
        })
        .catch((err) => {
          toast.error(err.message);
          Modal(false, null);
        });
    };
    Modal(true, dispatchNewProduct, {
      title: "Create Product",
      message: "You want to create this product ?",
      type: "info",
    });
  }
  const addImagesHandler = async (eo) => {
    let files = eo.target.files;
  
    const readFileAsDataURL = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    };
  
    let imagesFileHandler = async (array = []) => {
      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        let isFileAlreadyAdded = images.some(img => img.post.name === file.name && img.post.size === file.size);

        if (!isFileAlreadyAdded) {
          let imgObj = { id: Date.now(), post: file };
          try {
            imgObj.src = await readFileAsDataURL(file);
            array.push(imgObj);
          } catch (error) {
            console.error("Error reading file", error);
          }
        } 
        // else {
        //   toast.error(`File "${file.name}" already exists and will not be added.`);
        // }
      }
      return array;
    };
  
    let finalFiles = await imagesFileHandler();
    setImages(prev => [...prev, ...finalFiles]);
    eo.target.value = "";
  };
  const removeImageHandle = (id) => {
    setImages(prev => prev.filter(img => img.id !== id))
  }
  // This is for product -- end

  let startIndex = null
  let currentElement = null;

  const dragEnterHandler = (e) => {
    e.preventDefault();
    const element = e.target.closest(".img");
  
    // Check if we are entering a new item
    if (element && element !== currentElement) {
      if (currentElement) {
        currentElement.classList.remove("drag-enter");
      }
      currentElement = element;
  
      if (!element.classList.contains('drag-select')) {
        element.classList.add("drag-enter");
      }
    }
  }
  
  const dragLeaveHandler = (e) => {
    e.preventDefault();
    const element = e.target.closest(".img");
  
    // Check if we are leaving the current item completely
    if (element && element === currentElement && !element.contains(e.relatedTarget)) {
      element.classList.remove("drag-enter");
      currentElement = null;
    }
  }
  const dragStartHandler = (e) => {
    // dragSelect = e.target.closest("img")
    const element = e.target.closest(".img")
    startIndex = element.dataset.index
    element.classList.add("drag-select")
  }
  const dragEndHandler = (e) => {
    const element = e.target.closest(".img")
    element.classList.remove("drag-select")
  }
  const dropHandler = (e) => {
    const element = e.target.closest(".img")
    const endIndex = element.dataset.index
    element.classList.remove("drag-enter")

    if(startIndex !== endIndex) {
      const startElement = images[+startIndex]
      const endElement = images[+endIndex]

      setImages(prev => prev.map((img, ind) => {
        if(ind === +startIndex) return endElement 
        if(ind === +endIndex) return startElement
        return img
      }))
    }
  }
  const dragOverHandler = (e) => {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
  }
//   function swap(array, index1, index2) {
//     let temp = array[index1];
//     array[index1] = array[index2];
//     array[index2] = temp;
//     return array
// }
  return (
        <PageStructure
          title="create new product"
        >
          <form className="NewProduct">
            <div className="left-sections-parent">
              <div className="left-sections">
                <SectionStructure title="general">
                  <div className="general">
                    <InputBox
                      value={form.name}
                      required
                      onChange={changeFormHandle}
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Name"
                      label="Name"
                      autoComplete="off"
                    />
                    <InputBox
                      value={form.sku}
                      onChange={changeFormHandle}
                      type="text"
                      name="sku"
                      id="sku"
                      placeholder="SKU"
                      label="SKU"
                    />
                    
                    <Loading loading={catgLoading}>
                    <SelectBox
                      required
                      onChange={changeFormHandle}
                      name="category"
                      id="category"
                      placeholder="Category"
                      label="Category"
                      subLabel={
                        <div onClick={getCategoriesHandle} style={{cursor: "pointer"}} className="refresh-categories"><GrRefresh /></div>
                      }
                    >
                    <option value="">None</option>
                    {categories.map((opt) => <option key={opt._id} selected={opt?._id === form.category} value={opt._id}>{opt?.name}</option>)}
                    </SelectBox>
                    <a target="_blank" className="link" href={`${window.location.origin}/admin/categories`} rel="noreferrer">+ Add Categories</a>
                    </Loading>

                    <InputBox
                      value={description}
                      required
                      label="Description"
                      personelInput={
                        <span style={{color: "#000"}}>
                          <JoditEditor
                            required={true}
                            ref={editor}
                            value={description}
                            config={{
                              readonly: false,
                              placeholder: "Start typings...",
                              minHeight: 400,
                              maxHeight: 500
                            }}
                            tabIndex={1} // tabIndex of textarea
                            onBlur={(newDescription) => setDescription(newDescription)} // preferred to use only this option to update the description for performance reasons
                          />
                        </span>
                      }
                    />
                  </div>
                </SectionStructure>
                <SectionStructure title="prices">
                  <div className="prices">
                    <GridSections style={{ rowGap: "0px", margin: "0px" }}>
                      <InputBox
                        value={form.originalPrice}
                        onChange={changeFormHandle}
                        type="number"
                        name="originalPrice"
                        id="originalPrice"
                        placeholder="Original Price"
                        label="Original Price"
                        rightSlug="Mad"
                        borderSlug="none"
                      />
                      <InputBox
                        value={form.salePrice}
                        required
                        onChange={changeFormHandle}
                        type="number"
                        name="salePrice"
                        id="salePrice"
                        placeholder="Sale Price"
                        label="Sale Price"
                        rightSlug="Mad"
                        borderSlug="none"
                      />
                      <InputBox
                        value={form.discount}
                        onChange={changeFormHandle}
                        type="number"
                        name="discount"
                        id="discount"
                        placeholder="Discount"
                        label="Discount"
                        rightSlug="%"
                        borderSlug="none"
                      />
                    </GridSections>
                  </div>
                </SectionStructure>
                <SectionStructure title="media">
                  <div className="media">
                    <div className="catalogue">
                      {images.map((img, ind) => (
                        <div data-index={ind} id={img.id} key={ind} className="img"
                        draggable 
                        onDragEnter={dragEnterHandler}
                        onDragLeave={dragLeaveHandler}
                        onDragStart={dragStartHandler}
                        onDragEnd={dragEndHandler}
                        onDrop={dropHandler}
                        onDragOver={dragOverHandler}
                        >
                          {ind === 0 && <span className="star"><BsFillStarFill/></span>}
                          <img draggable="false" loading='lazy' src={img.src} alt="product img" />
                          <div className="controllers">
                            <BsX onClick={() => removeImageHandle(img.id)}/>  
                          </div>
                        </div>
                      ))}
                      <label className={`image-manager`}>
                      <input
                        multiple
                        accept="image/*"
                        onChange={addImagesHandler}
                        type="file"
                        name="image"
                        id="image"
                      />
                      <div className="icon">
                        <BiSolidCamera />
                      </div>
                      {images.length === 0 && <p>Click or drag your image here</p>}
                    </label>
                    </div>
                  </div>
                </SectionStructure>
                <SectionStructure title="Search engine optimize">
                  <div className="serch-engine-optimize">
                    <InputBox
                      value={form.slug}
                      onChange={checkSlugHandler}
                      type="text"
                      name="slug"
                      id="slug"
                      placeholder="Slug"
                      label="Slug"
                      leftSlug={`${process.env.REACT_APP_SERVER_DOMAINE}/products/`}
                      slugWrap={true}
                      required
                      autoComplete="off"
                      checkValueInDB={{
                        isLoadingSlug,
                        pauseCheckingDuration,
                        ...slugChecked
                      }}
                    />
                    <InputBox
                      value={form.metaTitle}
                      onChange={changeFormHandle}
                      type="text"
                      name="metaTitle"
                      id="metaTitle"
                      placeholder="Meta title"
                      label="Meta title"
                    />
                    <InputBox
                      value={form.metaKeywords}
                      onChange={changeFormHandle}
                      type="text"
                      name="metaKeywords"
                      id="metaKeywords"
                      placeholder="Meta keywords"
                      label="Meta keywords"
                    />
                    <TextAreaBox
                      value={form.metaDescription}
                      onChange={changeFormHandle}
                      type="text"
                      name="metaDescription"
                      id="metaDescription"
                      placeholder="Meta description"
                      label="Meta description"
                    />
                  </div>
                </SectionStructure>
              </div>
              <div className="right-sections">
                <SectionStructure bg="grey" title="Product status">
                  <div className="product-status right-styles">
                    <div className="min-section">
                      {/* <h6>Status</h6> */}
                      <SelectBox
                        onChange={changeFormHandle}
                        name="status"
                        id="statusProduct"
                        label="Status"
                        required
                      >
                        <option selected={+form.status} value="1">In Stock</option>
                        <option selected={!+form.status}value="0">Out Stock</option>
                      </SelectBox>
                    </div>
                    <div className="min-section">
                      <SelectBox
                        onChange={changeFormHandle}
                        name="visibility"
                        id="visibilityProduct"
                        label="Visibility"
                        required
                      >
                        <option selected={+form.publish}value="1">Publish</option>
                        <option selected={!+form.publish}value="0">Private</option>
                      </SelectBox>
                    </div>
                  </div>
                </SectionStructure>
                <SectionStructure bg="grey" title="Inventory">
                  <div className="inventory  right-styles">
                    <div className="min-section">
                      <h6>Manage stock?</h6>
                      <div className="box">
                        <input
                          type="radio"
                          name="manageStock"
                          value="manageStock_yes"
                          id="manageStock_yes"
                          checked
                        />
                        <label htmlFor="manageStock_yes">Yes</label>
                      </div>
                      <div className="box">
                        <input
                          type="radio"
                          name="manageStock"
                          value="manageStock_no"
                          id="manageStock_no"
                        />
                        <label htmlFor="manageStock_no">No</label>
                      </div>
                    </div>
                    <div className="min-section">
                      <h6>Stock availability</h6>
                      <div className="box">
                        <input
                          type="radio"
                          name="stockAvailability"
                          value="stockAvailability_yes"
                          id="stockAvailability_yes"
                          checked
                        />
                        <label htmlFor="stockAvailability_yes">Yes</label>
                      </div>
                      <div className="box">
                        <input
                          type="radio"
                          name="stockAvailability"
                          value="stockAvailability_no"
                          id="stockAvailability_no"
                        />
                        <label htmlFor="stockAvailability_no">No</label>
                      </div>
                    </div>
                    <div className="min-section">
                      <InputBox
                        required
                        value={form.quantity}
                        onChange={changeFormHandle}
                        type="number"
                        name="quantity"
                        id="quantity"
                        placeholder="Quantity"
                        label="Quantity"
                      />
                    </div>
                  </div>
                </SectionStructure>
              </div>
            </div>
            <BtnsFooter>
              <div className="box">
                <Btnx
                  btnStyle="outline"
                  color="danger"
                  element="a"
                  to={"/admin/products"}
                >
                  Cancel
                </Btnx>
              </div>
              <div className="box">
                <Btnx
                  onClick={(e) => newProductHandler(e, true)}
                  disabled={!slugChecked.checked || pauseCheckingDuration || isLoadingSlug}
                  btnStyle="bg"
                  color="primary"
                  element="button"
                >
                  Add Variants
                </Btnx>
                <Btnx
                  onClick={newProductHandler}
                  disabled={!slugChecked.checked || pauseCheckingDuration || isLoadingSlug}
                  btnStyle="bg"
                  color="success"
                  element="button"
                  type="submit"
                >
                  Save
                </Btnx>
              </div>
            </BtnsFooter>
          </form>
        </PageStructure>
      )}

