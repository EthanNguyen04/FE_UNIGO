import { View, Text, SafeAreaView, TouchableOpacity, Image, ScrollView } from 'react-native'
import React from 'react'
import { LoginStyles as styles } from './login.style'
import ButtonCustom from '../ButtonCustom'
import TextInputCustom from '../TextInputCustom'
import { useNavigation } from '@react-navigation/native';


const Login = () => {
  const navigation = useNavigation();
  const [emailCheck, setEmailCheck] = React.useState<any>();
  const [passwordCheck, setPasswordCheck] = React.useState<any>();

  const loginHandler = () => {
    // if (!emailCheck && emailCheck != undefined && !passwordCheck && passwordCheck != undefined) {
    //   navigation.reset({
    //     index: 0,
    //     routes: [
    //       { name: 'BottomTabs' as never },
    //     ],
    //   }
    //   );
    // } else {
    //   setEmailCheck(true);
    //   setPasswordCheck(true);
    //   Toast.show('This is a long toast.', Toast.LONG);
    // }

    navigation.reset({
      index: 0,
      routes: [
        { name: 'BottomTabs' as never },
      ],
    }
    );
  }

  const signUpHandler = () => {
    navigation.navigate('SignUp' as never);
  }

  return (
    <SafeAreaView style={styles.container} >

      <ScrollView contentContainerStyle={{ flex: 1 }} >
        <View style={styles.loginTitle} >
          <Text style={styles.loginTitleText} >Chào mừng bạn</Text>
          <Text style={styles.subLoginTitleText} >Đăng nhập để tiếp tục</Text>
        </View>
        {/* Login form */}
        <View style={styles.loginForm} >
          <TextInputCustom props={{
            placeholder: 'Email',
            autoCapitalize: 'none',
            autoCorrect: false,
            keyboardType: 'email-address',
            returnKeyType: 'next',
            type: 'email', // bắt buộc phải có để validate kiểu dữ liệu 
            errorMessage: 'Email không đúng định dạng', // bắt buộc phải có để hiển thị thông báo
          }} label={'Email'}
            state={emailCheck}
            setErrorInput={setEmailCheck} />

          <TextInputCustom props={{
            placeholder: 'Password',
            autoCapitalize: 'none',
            autoCorrect: false,
            returnKeyType: 'done',
            secureTextEntry: true,
            type: 'password', // bắt buộc phải có để validate kiểu dữ liệu 
            errorMessage: 'Mật khẩu sai', // bắt buộc phải có để hiển thị thông báo
          }} label={'Password'}
            state={passwordCheck}
            setErrorInput={setPasswordCheck} />

          <View>
    
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword' as never)}><Text style={styles.forgotPasswordLabel} >Quên mật khẩu?</Text></TouchableOpacity>
            <ButtonCustom props={{ label: 'Đăng nhập' }} onPress={loginHandler} />
          </View>
        </View>

    

        <View style={styles.footerContainer} >
          <Text style={styles.footerTitle} >Bạn chưa có tài khoản? </Text>
          <TouchableOpacity onPress={signUpHandler} style={styles.footerButton} ><Text style={styles.footerButtonText} > Đăng ký</Text></TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}


export default Login