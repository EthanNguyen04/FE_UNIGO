export const BASE_URL = "http://192.168.1.2:3001/";
export const Im_URL = "http://192.168.1.2:3001";

export const Head_token = "Bearer "; // kết hợp Head_token + token để gửi về server

//thông báo
export const Send_token = "api/noti/save_extkn";//lưu expo token 
export const get_noti = "api/noti/get_noti"; //lấy thông báo

//Người dùng
export const REGISTER_api = "api/user/register";//đăng kí 
export const LOGIN_api = "api/user/login";// đăng nhập
export const SendOtpRsPass_api = "api/user/send_otprs"; // Gửi otp đặt lại mật khẩu 
export const RsPass_api = "api/user/set_newpass"; // đặt lại mật khẩu 
export const LOGOUT_api = "api/user/logout"; // đăng xuất
export const Get_info_user = "api/user/getInfoUser"; // tại profile nav - lấy tên , ảnh , số mua, số thích
export const updateProfile = "api/user/updateProfile"; // tại Tk bao mat - update ảnh tên, mật khẩu  
export const get_profile = "api/user/getUserProfile"; // tại Tk bao mat - lấy thông tin ảnh tên, mật khẩu  
export const add_address = "api/user/addAddress"; // tại Dia chi - thêm, sửa
export const getAllAddresses = "api/user/getAllAddresses"; //  tại Dia chi - lấy tất cả

//Sản phẩm
export const Get_product_sale_api = "api/product/products_sale"; // 10 sản phẩm sale tại màn hình trang chủ 
export const Get_all_product_sale = "api/product/allproducts_sale"; //tất cả sản phẩm tại màn hình sale
export const Get_productdx_api = "api/product/products_dx"; // sản phẩm đề xuất tại màn hình trang chủ 
export const Get_product = "api/product/"; // màn hình product - xem chi tiết 
export const Get_All_product = "api/product/searchProducts"; // tại màn hình List product - tất cả sản phẩm
export const Post_CheckLike = "api/wishlist/check_like"; // tại màn hình product - check like true flase
export const Post_ChangeLike = "api/wishlist/change_like"; // tại màn hình product - đổi like true flase 
//cart
export const Post_AddCart = "api/cart/add_cart"; // tại màn hình product - bấm thêm giỏ hàng
export const Get_cart = "api/cart/get_cart"; // tại màn hình cart - lấy danh sách giỏ hàng
export const Get_count_cart = "api/cart/get_count_cart"; // tại header, lấy số lượng sp trong giỏ

//phân loại
export const Get_all_cate = "api/category/all_category"; // lấy các phân loại có sẵn 

//Sản phẩm yêu thich
export const Get_all_like = "api/wishlist/getFavoriteProducts"; // tại like nav - lấy các sản phẩm đang được yêu thích

export const get_oder_count = "api/order/get_oder_count"; // tại profile - lấy số đơn hàng Chờ xác nhận, đã xác nhận, đã giao
