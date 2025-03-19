import { Platform, StyleSheet } from 'react-native';
import { SPACING, FONTFAMILY, FONTSIZE, COLORS } from '../Theme';

export const SignInStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loginForm: {
    flex: 1,
    gap: SPACING.space_20,
    marginBottom: SPACING.space_20,
    paddingHorizontal: SPACING.space_20,
    marginTop: SPACING.space_8,
    ...Platform.select({
      ios: {
        marginTop: SPACING.space_32,
      },
    }),
  },
  forgotPasswordLabel: {
    fontFamily: FONTFAMILY.Roboto_Light,
    fontSize: FONTSIZE.size_14,
    color: COLORS.Black,
    marginTop: SPACING.space_10,
    textAlign: 'right',
    marginHorizontal: SPACING.space_20,
    marginVertical: SPACING.space_28,
  },
  loginTitle: {
    justifyContent: 'center',
    marginBottom: SPACING.space_20,
  },
  loginTitleText: {
    fontFamily: FONTFAMILY.Roboto_Medium,
    fontSize: FONTSIZE.size_24,
    color: COLORS.Black,
    ...Platform.select({
      ios: {
        fontSize: FONTSIZE.size_30,
      },
    })
  },
  TermsAndConditionsCheckbox: {
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: SPACING.space_4,
  },
  agreementText: {
    fontFamily: FONTFAMILY.Roboto_Light,
    fontSize: FONTSIZE.size_14,
    color: COLORS.Black,
  },
});
