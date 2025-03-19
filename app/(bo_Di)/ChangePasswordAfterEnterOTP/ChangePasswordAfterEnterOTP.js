import { View, Text, ScrollView, TouchableOpacity, TextInput, SafeAreaView } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { COLORS, SPACING } from '../Theme'
import { useNavigation } from '@react-navigation/native';
import { ChangePasswordAfterEnterOTPStyles } from './changePasswordAfterEnterOTP.style';
import { CommonActions } from '@react-navigation/native';

const ChangePasswordAfterEnterOTP = () => {
  const navigation =useNavigation()
  const handerCapNhatMatKhau = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      })
    );
  }
  return (
    <SafeAreaView style ={ChangePasswordAfterEnterOTPStyles.container}>
      <ScrollView>
        <View style= {ChangePasswordAfterEnterOTPStyles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name='arrow-left' size={SPACING.space_32} color={COLORS.Black}/>
          </TouchableOpacity>

        </View>
        <View style ={ChangePasswordAfterEnterOTPStyles.body}>
          <View style ={ChangePasswordAfterEnterOTPStyles.box1}>
            <Text style ={ChangePasswordAfterEnterOTPStyles.box1Title1}>Nhập mật khẩu mới của bạn</Text>
          </View>
          
          <View style ={ChangePasswordAfterEnterOTPStyles.box2}>
            <Text style ={ChangePasswordAfterEnterOTPStyles.box1Title2}>Nhập mật khẩu mới</Text>
            <TextInput placeholder='*********' style={ChangePasswordAfterEnterOTPStyles.customInput}/>
          </View>
          <View style ={ChangePasswordAfterEnterOTPStyles.box2}>
            <Text style ={ChangePasswordAfterEnterOTPStyles.box1Title2}>Xác nhận lại mật khẩu</Text>
            <TextInput  placeholder='*********' style={ChangePasswordAfterEnterOTPStyles.customInput}/>
          </View>
        </View>

        <TouchableOpacity onPress={() => handerCapNhatMatKhau()} style ={ChangePasswordAfterEnterOTPStyles.footer}>
          <Text style ={ChangePasswordAfterEnterOTPStyles.footerTitle}>Cập nhập mật khẩu</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ChangePasswordAfterEnterOTP