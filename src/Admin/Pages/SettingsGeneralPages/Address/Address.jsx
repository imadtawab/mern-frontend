import React, { useEffect, useState } from 'react'
import SectionStructure from '../../../Components/SectionStructure/SectionStructure'
import GridSections from '../../../Components/GridSections/GridSections'
import InputBox, { SelectBox } from '../../../../MainComponent/InputBox/InputBox'
import BtnsFooter from '../../../Components/BtnsFooter/BtnsFooter'
import Btnx from '../../../Components/Btnx/Btnx'
import { FaRegSave } from "react-icons/fa";
import { Country, City }  from 'country-state-city';
import Loading from '../../../../MainComponent/Loading/Loading'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { Modal } from '../../../Utils/modalUtils'
import { getAddress, updateAddress } from '../../../../Store/Admin/storeSettingsSlice'


export default function Address() {
  const {isLoadingPage} = useSelector(s => s.store_settings)
  const dispatch = useDispatch()

  let countries = [null, ...Country.getAllCountries()]
  let [country, setCountry] = useState(countries[0])

  let [cities, setCities] = useState(City.getCitiesOfCountry(country?.isoCode));
  let [city, setCity] = useState(cities[0]?.name)

  let [zip_code, setZip_code] = useState(null)
  let [address_line_1, setAddress_line_1] = useState(null)
  let [address_line_2, setAddress_line_2] = useState(null)

  const changeCountryHandler = (e) => {
    let newCountry = countries.find(country => country?.isoCode === e.target.value)
    setCountry(newCountry)
    let newCities = City.getCitiesOfCountry(newCountry.isoCode)
    setCities(newCities)
    setCity(newCities[0]?.name)
  }
  const submitHandler = (e) => {
    e.preventDefault()

    let body = {zip_code, address_line_1, address_line_2}
    if(country?.name) body.country = country.name
    if(city) body.city = city
    // return console.log({country: country.name, city: city, zip_code, address_line_1, address_line_2})
    let dispatchNewAttribute = () => {
      dispatch(updateAddress(body))
        .unwrap()
        .then((docs) => {
          toast.success(docs.message);
          Modal(false, null);
          let {country, city, zip_code, address_line_1, address_line_2} = docs.data
          if(country) setCountry(countries.find(c => c?.name === country))
            if(city) setCity(city)
            if(zip_code) setZip_code(zip_code)
            if(address_line_1) setAddress_line_1(address_line_1)
            if(address_line_2) setAddress_line_2(address_line_2)
        })
        .catch((err) => {
          toast.error(err.message);
          Modal(false, null);
        });
    };
    Modal(true, dispatchNewAttribute, {
      title: "Update Address",
      message: "You want to update your address ?",
      type: "info",
    });
  }

  useEffect(() => {
    dispatch(getAddress()).unwrap()
    .then(docs => {
      let {country, city, zip_code, address_line_1, address_line_2} = docs.data



      if(country) {
        let newCountry = countries.find(c => c?.name === country)
        setCountry(newCountry)
        let newCities = City.getCitiesOfCountry(newCountry?.isoCode)
        setCities(newCities)
        setCity(city)
      }
      if(zip_code) setZip_code(zip_code)
      if(address_line_1) setAddress_line_1(address_line_1)
      if(address_line_2) setAddress_line_2(address_line_2)
    })
    .catch(error => toast.error(error.message))
  }, [])
  
  return (
    <Loading loading={isLoadingPage}>
      <form onSubmit={submitHandler} className='Address'>
        <SectionStructure title="Address will appear on your invoices">
            <SelectBox onChange={changeCountryHandler} name="country" id="country" label="Country">
                {countries.map(c => (
                    <option selected={country?.isoCode === c?.isoCode} value={c?.isoCode}>{c?.name}</option>
                ))}

            </SelectBox>
            <GridSections style={{ rowGap: "0px", margin: "0px" }}>
            <SelectBox value={city} onChange={e => setCity(e.target.value)} name="city" id="city" placeholder="City" label="City">
                {cities?.map(c => (
                    <option value={c.name}>{c.name}</option>
                ))}
            </SelectBox>
            {/* <InputBox type="text" name="city" id="city" placeholder="City" label="City" /> */}
            <InputBox value={zip_code} onChange={e => setZip_code(e.target.value)} type="text" name="zip_code" id="zip_code" placeholder="Zip code" label="Zip code" />
            </GridSections>
            <InputBox value={address_line_1} onChange={e => setAddress_line_1(e.target.value)} type="text" name="address1" id="address1" placeholder="Address line 1" label="Address line 1" />
            <InputBox value={address_line_2} onChange={e => setAddress_line_2(e.target.value)} type="text" name="address2" id="address2" placeholder="Address line 2" label="Address line 2" />
        </SectionStructure>
        <BtnsFooter>
            <div></div>
            <div className="box">
              <Btnx
                btnStyle="bg"
                color="success"
                element="button"
                type="submit"
              >
               <FaRegSave/> Save
              </Btnx>
            </div>
          </BtnsFooter>
    </form>
    </Loading>
  )
}
