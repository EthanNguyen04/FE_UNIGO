import { View, Text, ScrollView, TouchableOpacity, TextInput, SafeAreaView } from 'react-native'
import React from 'react'
import { ForgotPasswordStyles } from './ForgotPassword.style'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { COLORS, SPACING } from '../Theme'
import { useNavigation } from '@react-navigation/native';


const ForgotPassword = () => {
  const navigation = useNavigation();

  const handerXacNhan = () => {
    navigation.navigate('EnterYourOTPCode')
  }

  return (
    <SafeAreaView style ={ForgotPasswordStyles.container}>
      <ScrollView>
        <View style= {ForgotPasswordStyles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name='arrow-left' size={SPACING.space_32} color={COLORS.Black}/>
          </TouchableOpacity>

        </View>
        <View style ={ForgotPasswordStyles.body}>
          <View style ={ForgotPasswordStyles.box1}>
            <Text style ={ForgotPasswordStyles.box1Title1}>Bạn đã quên mật khẩu</Text>
            <Text style ={ForgotPasswordStyles.box1Title2}>Nhập email để lấy lại tài khoản</Text>
          </View>
          <View style ={ForgotPasswordStyles.box2}>
            <Text style ={ForgotPasswordStyles.box1Title2}>Email</Text>
            <TextInput placeholder='Nhập email' style={ForgotPasswordStyles.customInput}/>
          </View>
        </View>

        <TouchableOpacity onPress={() => handerXacNhan()} style ={ForgotPasswordStyles.footer}>
          <Text style ={ForgotPasswordStyles.footerTitle}>Xác nhận</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ForgotPassword