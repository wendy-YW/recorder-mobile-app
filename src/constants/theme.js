import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");


export const COLORS = {
     // base colors
     primary:"#3C4142", //   charcoal gray
     secondary: "#08AFA8", //   teal
 
     // colors
     lightGray:"#F5F7F9",
     lightGreen:"#b2d8d8",
     darkGray:"#8c8c8c",
     gray:"#D9D9D9",
     black: "#1E1F20",
     darkBlack:"#24292E",
     lightBlack:"#383F45",
     white: "#FFFFFF",
     red:"#d91e18",
     darkRed:"#d64541",
};

export const SIZES = {
    // global sizes
    base: 8,
    font: 14,
    radius: 12,
    padding: 24,
    padding2: 36,

    iconSize: 26,

    // font sizes
    largeTitle: 50,
    h1: 30,
    h2: 22,
    h3: 16,
    h4: 14,

    body1: 30,
    body2: 20,
    body3: 16,
    body4: 14,
    body5: 12,

    // app dimensions
    width,
    height
};

export const FONTS = {
    largeTitle: { fontFamily: "Inter-Bold", fontSize: SIZES.largeTitle, lineHeight: 55 },
    
    h1: { fontFamily: "Inter-Bold", fontSize: SIZES.h1, lineHeight: 36 },
    
    h2: { fontFamily: "Inter-Bold", fontSize: SIZES.h2, lineHeight: 30 },
    h2SemiBold: { fontFamily: "Inter-SemiBold", fontSize: SIZES.h2, lineHeight: 30 },
    
    h3: { fontFamily: "Inter-SemiBold", fontSize: SIZES.h3, lineHeight: 22 },
    h3Bold: { fontFamily: "Inter-Bold", fontSize: SIZES.h3, lineHeight: 22 },
    
    h4: { fontFamily: "Inter-SemiBold", fontSize: SIZES.h4, lineHeight: 22 },
    
    body1: { fontFamily: "Inter-SemiBold", fontSize: SIZES.body1, lineHeight: 36 },
    
    body2: { fontFamily: "Inter-SemiBold", fontSize: SIZES.body2, lineHeight: 30 },
    body2Light: { fontFamily: "Inter-Light", fontSize: SIZES.body2, lineHeight: 30 },
    
    body3:{ fontFamily: "Inter-Regular", fontSize: SIZES.body3, lineHeight: 22 },
    body3Medium: { fontFamily: "Inter-Medium", fontSize: SIZES.body3, lineHeight: 22 },
    body3SemiBold: { fontFamily: "Inter-SemiBold", fontSize: SIZES.body3, lineHeight: 22 },
    body3Light: { fontFamily: "Inter-Light", fontSize: SIZES.body3, lineHeight: 22 },
    
    body4: { fontFamily: "Inter-SemiBold", fontSize: SIZES.body4, lineHeight: 22 },
    body4Light: { fontFamily: "Inter-Light", fontSize: SIZES.body4, lineHeight: 22 },
    
    body5: { fontFamily: "Inter-Regular", fontSize: SIZES.body5, lineHeight: 22 },
    body5SemiBold: { fontFamily: "Inter-SemiBold", fontSize: SIZES.body5, lineHeight: 22 },
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;