import { configureStore } from '@reduxjs/toolkit' 
import accountSlice from './Admin/accountSlice';
import modalSlice from './Admin/modalSlice';
import attributeSlice from './Admin/attributeSlice';
import categorySlice from './Admin/categorySlice';
import productSlice from './Admin/productSlice';
import client_categorySlice from './Client/categorySlice'
import client_attributeSlice from './Client/attributeSlice'
import client_productSlice from './Client/productSlice'
import sideCartSlice from './Client/sideCartSlice';
import shoppingCartSlice from './Client/shoppingCartSlice';
import orderSlice from './Admin/orderSlice';
import shippingSlice from './Admin/shippingSlice';
import client_shippingSlice from './Client/shippingSlice';
import couponSlice from './Admin/couponSlice';
import client_couponSlice from './Client/couponSlice'
import storeSettingsSlice from './Admin/storeSettingsSlice'
import client_storeSettingsSlice from './Client/storeSettingsSlice'

const store = configureStore({
    reducer: {
        account: accountSlice,
        modal: modalSlice,
        attribute: attributeSlice,
        category: categorySlice,
        product: productSlice,
        sideCart: sideCartSlice,
        shoppingCart: shoppingCartSlice,
        order: orderSlice,
        shipping: shippingSlice,
        coupon: couponSlice,
        store_settings: storeSettingsSlice,

        client_category: client_categorySlice,
        client_attribute: client_attributeSlice,
        client_product: client_productSlice,
        client_shipping: client_shippingSlice,
        client_coupon: client_couponSlice,
        client_settings: client_storeSettingsSlice,
        // products: productsSlice,
        // users: usersSlice,
        // orders: orderSlice,
        // client_products: client_productsSlice,
        // categories: categoriesSlice,
        // attributes: attributesSlice,
        // modal: modalSlice,
        // cart: cartSlice,
    },
}) ; 
export default store ;
