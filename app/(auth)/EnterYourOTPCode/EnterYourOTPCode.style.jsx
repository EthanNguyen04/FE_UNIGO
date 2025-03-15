import { StyleSheet } from "react-native";
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from "../Theme";

export const EnterYourOTPCodeStyles = StyleSheet.create({
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
    box1Title3:{
        color: COLORS.Orange,
        fontSize: FONTSIZE.size_16,
        fontFamily: FONTFAMILY.Roboto_Medium
    },
    body:{
        paddingHorizontal: SPACING.space_28
    },
    box2:{
        marginTop: SPACING.space_20 * 3,
        gap: SPACING.space_24,
        justifyContent: "center",
        flexDirection: "row",
       

    },
    customInput:{
    
        borderBottomWidth: 1,
        paddingHorizontal: SPACING.space_8,
        fontSize: FONTSIZE.size_24,
        borderBottomColor: COLORS.Black,
        fontFamily: FONTFAMILY.Roboto_Bold
    },
    footerBox1:{
        backgroundColor: COLORS.LightOrange,
        justifyContent: "center",
        alignItems: "center",
        padding: SPACING.space_15,
        marginHorizontal: SPACING.space_24,
        marginTop: SPACING.space_28,
        borderRadius: SPACING.space_8
    },
    footerTitle:{
        color: COLORS.White,
        fontFamily: FONTFAMILY.Roboto_Bold,
        fontSize: FONTSIZE.size_16
    },
    footerBox2:{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: SPACING.space_15
    }


});