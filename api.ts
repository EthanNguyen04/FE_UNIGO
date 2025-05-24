export const Im_URL = "http://192.168.1.7:3001";
export const BASE_URL = `${Im_URL}/`;
// src/api/index.ts

// Authentication
export const REGISTER_api = "api/user/register";
export const LOGIN_api = "api/user/login";
export const LOGOUT_api = "api/user/logout";
export const SendOtpRsPass_api = "api/user/send_otprs";
export const RsPass_api = "api/user/set_newpass";

// User profile
export const Get_info_user = "api/user/getInfoUser";
export const get_profile = "api/user/getUserProfile";
export const updateProfile = "api/user/updateProfile";
export const add_address = "api/user/addAddress";
export const getAllAddresses = "api/user/getAllAddresses";
export const update_expo_token = "api/user/update_expo_token";

// Notifications
export const Send_token = "api/noti/save_extkn";
export const get_noti = "api/noti/get_noti";
export const post_noti_guest  = "api/noti/send_notification_guest";

// Products
export const Get_product_sale_api = "api/product/products_sale";
export const Get_all_product_sale = "api/product/allproducts_sale";
export const Get_productdx_api = "api/product/products_dx";
export const Get_product = "api/product/";
export const Get_All_product = "api/product/searchProducts";

// Categories
export const Get_all_cate = "api/category/all_category";

// Wishlist
export const Post_CheckLike = "api/wishlist/check_like";
export const Post_ChangeLike = "api/wishlist/change_like";
export const Get_all_like = "api/wishlist/getFavoriteProducts";

// Cart
export const Post_AddCart = "api/cart/add_cart";
export const Get_cart = "api/cart/get_cart";
export const Delete_carts = "api/cart/delete-product_cart";
export const Put_update_quantily_cart  = "api/cart/update-quantity";
export const Get_count_cart = "api/cart/get_count_cart";

// Orders
export const Post_order = "api/order/create_order";
export const get_oder_count = "api/order/get_oder_count";
export const get_oder_status = "api/order/get_oder_status";
export const change_payment = "api/order/payment-status/";

// Discount
export const get_discount_today = "api/discount/discount_today";

// VNPAY
export const Create_payment = "vnpay/create_payment_url";
export const check_payment = "vnpay/create_payment_url";
