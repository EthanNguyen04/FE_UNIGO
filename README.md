# Dự án Frontend UNIGO

Đây là một dự án [Expo](https://expo.dev) được tạo bằng [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Cài đặt và chạy dự án

1. Cài đặt dependencies:
   ```bash
   npm install
   ```

2. Khởi chạy ứng dụng:
   ```bash
   npx expo start
   ```

Ứng dụng có thể chạy trên:
- Giả lập Android ([Hướng dẫn](https://docs.expo.dev/workflow/android-studio-emulator/))
- Trình giả lập iOS ([Hướng dẫn](https://docs.expo.dev/workflow/ios-simulator/))
- Expo Go ([Hướng dẫn](https://expo.dev/go))

## Học thêm về Expo

- [Tài liệu chính thức của Expo](https://docs.expo.dev/)
- [Hướng dẫn từng bước](https://docs.expo.dev/tutorial/introduction/)


my-expo-app/
│── app/                     # Chứa các màn hình và điều hướng chính

│── assets/                  # Chứa hình ảnh, icon, fonts, v.v.

│── components/              # Chứa các thành phần UI dùng chung

│── constants/               # Chứa các giá trị cố định
│
│── hooks/                   # Chứa các hook custom
│   ├── useAuth.ts           # Hook xác thực
│   ├── useCart.ts           # Hook quản lý giỏ hàng
│   └── useFetch.ts          # Hook fetch API
│
│── services/                # Chứa API services
│