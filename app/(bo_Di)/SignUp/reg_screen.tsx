import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SignInStyles as styles } from './reg.style'
import ButtonCustom from '../ButtonCustom'
import TextInputCustom from '../TextInputCustom'
import { useNavigation } from '@react-navigation/native';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import { COLORS, SPACING } from '../Theme'

const SignUp = () => {
  const navigation = useNavigation();
  const [emailCheck, setEmailCheck] = React.useState<any>();
  const [passwordCheck, setPasswordCheck] = React.useState<any>();
  const [confirmPasswordCheck, setConfirmPasswordCheck] = React.useState<any>();
  const [nameCheck, setNameCheck] = React.useState<any>();
  const [phoneCheck, setPhoneCheck] = React.useState<any>();
  const [agreementIcon, setAgreementIcon] = React.useState(false);


  return (
    <SafeAreaView style={styles.container} >

      <ScrollView contentContainerStyle={styles.loginForm} >

        <TouchableOpacity onPress={() => navigation.goBack()} >
          <Icons name='keyboard-backspace' size={24} />
        </TouchableOpacity>

        <View style={styles.loginTitle} >
          <Text style={styles.loginTitleText} >Đăng ký</Text>
        </View>
        <TextInputCustom props={{
          placeholder: 'Full name',
          autoCapitalize: 'none',
          autoCorrect: false,
          keyboardType: 'email-address',
          returnKeyType: 'next',
          type: 'Name', // bắt buộc phải có để validate kiểu dữ liệu 
          errorMessage: 'Họ và tên quá ngắn', // bắt buộc phải có để hiển thị thông báo
        }} label={'Full name'}
          state={nameCheck}
          setErrorInput={setNameCheck} />

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
          placeholder: 'Phone number',
          autoCapitalize: 'none',
          autoCorrect: false,
          keyboardType: 'email-address',
          returnKeyType: 'next',
          type: 'phone', // bắt buộc phải có để validate kiểu dữ liệu 
          errorMessage: 'Số điện thoại không đúng định dạng', // bắt buộc phải có để hiển thị thông báo
        }} label={'Phone number'}
          state={phoneCheck}
          setErrorInput={setPhoneCheck} />

        <TextInputCustom props={{
          placeholder: 'Password',
          autoCapitalize: 'none',
          autoCorrect: false,
          returnKeyType: 'done',
          secureTextEntry: true,
          type: 'password', // bắt buộc phải có để validate kiểu dữ liệu 
          errorMessage: 'Mật không đúng định dạng', // bắt buộc phải có để hiển thị thông báo
        }} label={'Password'}
          state={passwordCheck}
          setErrorInput={setPasswordCheck} />

        <TextInputCustom props={{
          placeholder: 'Confirm password',
          autoCapitalize: 'none',
          autoCorrect: false,
          returnKeyType: 'done',
          secureTextEntry: true,
          type: 'password', // bắt buộc phải có để validate kiểu dữ liệu 
          errorMessage: 'Mật không đúng định dạng', // bắt buộc phải có để hiển thị thông báo
        }} label={'Confirm password'}
          state={confirmPasswordCheck}
          setErrorInput={setConfirmPasswordCheck} />

        <View style={styles.TermsAndConditionsCheckbox} >
          <TouchableOpacity onPress={() => setAgreementIcon(!agreementIcon)} >
            <Icons name={agreementIcon ? 'checkbox-marked' : 'square-outline'} size={24} color={agreementIcon ? COLORS.Green : COLORS.Black} />
          </TouchableOpacity>
          <Text style={styles.agreementText} >Tôi đồng ý với chính sách và các điều khoản của app</Text>
        </View>

        <ButtonCustom props={{ label: 'Đăng ký' }} onPress={() => navigation.goBack()} />

      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp