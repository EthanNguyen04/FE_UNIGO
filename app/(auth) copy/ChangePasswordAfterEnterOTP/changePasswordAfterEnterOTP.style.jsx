import { StyleSheet } from "react-native";
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from "../Theme";

export const ChangePasswordAfterEnterOTPStyles = StyleSheet.create({
    container:{
        flex: 1
    },
    header:{
        padding: SPACING.space_24
    },
    box1Title1:{
        color: COLORS.Black,
        fontSize: FONTSIZE.size_24,
        fontFamily: FONTFAMILY.Roboto_Medium

    },
    box1:{
        gap: SPACING.space_4
    },
    box1Title2:{
        color: COLORS.Gray,
        fontSize: FONTSIZE.size_16,
        fontFamily: FONTFAMILY.Roboto_Medium

    },
    body:{
        paddingHorizontal: SPACING.space_28
    },
    box2:{
        marginTop: SPACING.space_20,
        gap: SPACING.space_4

    },
    customInput:{
        borderBottomWidth: 1,
        padding: SPACING.space_2,
        fontSize: FONTSIZE.size_16,
        borderBottomColor: COLORS.Gray
    },
    footer:{
        backgroundColor: COLORS.LightOrange,
        justifyContent: "center",
        alignItems: "center",
        padding: SPACING.space_15,
        marginHorizontal: SPACING.space_24,
        marginTop: SPACING.space_20 * 3,
        borderRadius: SPACING.space_8
    },
    footerTitle:{
        color: COLORS.White,
        fontFamily: FONTFAMILY.Roboto_Bold,
        fontSize: FONTSIZE.size_16
    }
})