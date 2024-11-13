import './New_Edit_Category.scss'
import default_prod from '../../../../Assets/product-default.png'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams , useNavigate} from "react-router";
import PageStructure from '../../../Components/PageStructure/PageStructure';
import SectionStructure from '../../../Components/SectionStructure/SectionStructure';
import InputBox, { SelectBox, TextAreaBox } from '../../../../MainComponent/InputBox/InputBox';
import Btnx from '../../../Components/Btnx/Btnx';
import BtnsFooter from '../../../Components/BtnsFooter/BtnsFooter';
import { toast } from 'react-toastify'
import { checkCategorySlug, newCategory } from '../../../../Store/Admin/categorySlice';
import { Modal } from '../../../Utils/modalUtils'

export default function NewCategory() {
  const { isLoadingSlug } = useSelector(s => s.category)
      const dispatch = useDispatch()
      const navigate = useNavigate()
      const [description , setDescription] = useState("")
      const [name , setName] = useState("")
      const [slug , setSlug] = useState("")
      const [publish , setPublish] = useState(true)
      const [image,setImage] = useState({src: "", post: ""})

      const setImageHandle = (eo) => {
        let imgObj = {}
        const file = eo.target.files[0];
        const reader = new FileReader();

        // you have to declare the file loading
        reader.readAsDataURL(file);
        imgObj.post = file

        reader.onload = function (e) {
          imgObj.src = e.target.result
          setImage(imgObj)
        };
      };
      const newCategoryHandler = (e) => {
        e.preventDefault()
        if(!slugChecked.checked) return

        let form = {description, name, slug, publish: Boolean(+publish), image: image.post}
        function createFormData() {
          const formData = new FormData();
          Object.keys(form).forEach((key) => {
            formData.append(key, form[key]);
          });
          return formData;
        }
        let dispatchNewCategory = () => {
          dispatch(newCategory(createFormData()))
            .unwrap()
            .then((docs) => {
              toast.success(docs.message);
              Modal(false, null);
              navigate("/admin/categories");
            })
            .catch((err) => {
              toast.error(err.message);
              Modal(false, null);
            });
        };
        Modal(true, dispatchNewCategory, {
          title: "Create Category",
          message: "You want to create this category ?",
          type: "info",
        });
      }
      const [slugChecked, setSlugChecked] = useState({checked: false, message: null})
      const [pauseCheckingDuration, setPauseCheckingDuration] = useState(false)

      const checkSlugHandler = (e) => {
        setPauseCheckingDuration(true)
        if(!pauseCheckingDuration){
            if(!e.target.value) {
              setSlugChecked({checked: false, message: "Slug is required."})
              setPauseCheckingDuration(false)
              return
            }
            setTimeout(() => {
            setPauseCheckingDuration(false)
            dispatch(checkCategorySlug({slug: e.target.value})).unwrap().then((docs) => {
              setSlugChecked(docs)
            }).catch(err => toast.error(err.message))
          }, 1000);
        }
      }
      
    return (
  <PageStructure>
  <form onSubmit={newCategoryHandler} className="AddNewCategories">
              <div className="parent">
              <SectionStructure title="New Category">
              <div className="form">
                  <InputBox onChange={(e) => setName(e.target.value)} value={name} type="text" name="name" id="name" placeholder="Name" label="Name" />
                  <InputBox
                        value={slug}
                        onChange={e => {
                          setSlug(e.target.value)
                          checkSlugHandler(e)
                        }}
                        type="text"
                        name="Slug"
                        id="categorySlug"
                        placeholder="Slug"
                        label="Slug"
                        leftSlug={`${process.env.REACT_APP_SERVER_DOMAINE}/categories/`}
                        slugWrap={true}
                        checkValueInDB={{
                          isLoadingSlug,
                          pauseCheckingDuration,
                          ...slugChecked
                        }}
                      />
                  <TextAreaBox onChange={(e) => setDescription(e.target.value)} value={description} type="text" name="description" id="description" placeholder="Description" label="Description" />

                  <SelectBox onChange={(e) => setPublish(e.target.value)} name="publish" id="publish" label="Visbility">
                    <option selected={Boolean(+publish)} value="1">Publish</option>
                    <option selected={!Boolean(+publish)} value="0">Private</option>
                  </SelectBox>
              </div>
              </SectionStructure>
              <SectionStructure title={"Image & Icon"}>
                <div className="image-and-icon">
                  <div className={"image_show" + (image.src ? " no-border" : "")}>
                        <img loading='lazy' src={image.src || default_prod} alt=""/>
                  </div>
                  <div className="controlles">
                      <>
                      {image.src ? (
                        <>
                       <label onClick={() => {
                        setImage({src: "", post: ""})
                        document.getElementById("addImage").value = ""
                       }}>
                      <Btnx width="full" btnStyle="bg" color="danger" element="button">
                        Delete
                        </Btnx>
                </label> 
                </>
                      ) : null}
                  <label>
                          <input accept="image/*" onChange={setImageHandle} type="file" id='addImage' name="image"/>
                          <Btnx htmlFor="addImage" width="full" btnStyle="bg" color="success" element="label">
                        {image.src ? "Update" : "Add Image"}
                            </Btnx>
                    </label>
                      </>
                  
                  </div>
                </div>
              </SectionStructure>
              </div>
              <BtnsFooter>
                <Btnx to="/admin/categories" btnStyle="outline" color="danger" element="a">Cancel</Btnx>
                <Btnx disabled={!slugChecked.checked || pauseCheckingDuration || isLoadingSlug} btnStyle="bg" color="success" element="button" type="submit">Add Category</Btnx>
              </BtnsFooter>
          </form>

  </PageStructure>
    )
  }