import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, FlatList, ScrollView, ImageBackground,StatusBar} from "react-native";
import { COLORS, FONTS, Icons, SIZES, icons } from '../constants';
import { useNavigation, useRoute } from '@react-navigation/native';

import { Provider as PaperProvider, Portal,Drawer,Chip } from 'react-native-paper';
import { color } from 'react-native-reanimated';


const InventoryPage = () => {

  const navigation = useNavigation();
  const handleSettingsPress = () => {
    navigation.navigate('Settings'); // Navigate to the 'Settings' screen
  };
  const handleProjectsPress = () => {
    navigation.navigate('ProjectsItems'); // Navigate to the 'Settings' screen
  };

    const inventoryHeader = () => {
        //status bar height
        const statusBarHeight = StatusBar.currentHeight || 0;

        return (
            <View style={styles.container}>
                     <StatusBar translucent backgroundColor={COLORS.lightGreen} 
                     barStyle="light-content"/>
			<ImageBackground source={require("../assets/images/Inventory-bg.png")} 
                style={[styles.backgroundImage, { marginTop: +statusBarHeight}]}>
                     <View style={styles.hearderContainer}>
					<Text style={styles.header}>Welcome</Text>
                    <Text style={styles.subHeader}>Start to manage your projects</Text>
				    </View> 
                    <View style={styles.calendarCard}>
					<View
						style={{
							height: "25%",
							paddingLeft: "10%",
							paddingTop: "5%",
							zIndex: 999,
						}}
					>
                        <View style={{flex:1, 
                            alignContent:'center',
                            marginLeft:'5%',
                            }}>
                        <Chip 
                        icon={({ size, color, direction }) => (
                            <Image
                              source={require('../assets/icons/folder-open.png')}
                              style={[
                                {
                                  transform: [{ scaleX: direction === 'rtl' ? -1 : 1 }],
                                },
                                {
                                  width: 25,
                                  height: 25,
                                  tintColor: COLORS.secondary,
                                  marginLeft:'20%',
                                }
                              ]}
                            />
                          )}
                        closeIcon="close"
                        mode='outlined'
                        rippleColor={COLORS.lightGreen}
                        textStyle={{color:COLORS.primary,
                                    ...FONTS.h4,
                                    fontSize:15,
                                    marginLeft:'-2%'}}
                        style={{backgroundColor:COLORS.white,
                                borderColor:COLORS.lightGray,
                                borderWidth:3,
                                borderRadius:20,
                                shadowColor:COLORS.primary,
                                shadowOpacity:0.8,
                                shadowRadius:3.85,
                                shadowOffset:{
                                    height:1,
                                    width:1
                                },
                                elevation:1,
                                width: '80%',
                                height: '80%',
                                marginTop:'20%',
                                color:COLORS.primary
                            }}
                        onPress={handleProjectsPress}>
                        Your Projects</Chip>
                        <Chip 
                        icon={({ size, color, direction }) => (
                            <Image
                              source={require('../assets/icons/briefcase_bold2.png')}
                              style={[
                                {
                                  transform: [{ scaleX: direction === 'rtl' ? -1 : 1 }],
                                },
                                {
                                  width: 25,
                                  height: 25,
                                  tintColor: COLORS.secondary,
                                  marginLeft:'20%'
                                }
                              ]}
                            />
                          )}
                        closeIcon="close"
                        mode='outlined'
                        rippleColor={COLORS.lightGreen}
                        textStyle={{color:COLORS.primary,
                                    ...FONTS.h4,
                                    fontSize:15,
                                    marginLeft:'-2%'}}
                        style={{backgroundColor:COLORS.white,
                                borderColor:COLORS.lightGray,
                                borderWidth:3,
                                borderRadius:20,
                                shadowColor:COLORS.primary,
                                shadowOpacity:0.8,
                                shadowRadius:3.85,
                                shadowOffset:{
                                    height:1,
                                    width:1
                                },
                                elevation:1,
                                width: '80%',
                                height: '80%',
                                color:COLORS.primary,
                                marginTop:'5%'
                            }}
                        onPress={() => console.log('Pressed')}>
                        Your Items
                        </Chip>
                        <Chip 
                        icon={({ size, color, direction }) => (
                            <Image
                              source={require('../assets/icons/gear.png')}
                              style={[
                                {
                                  transform: [{ scaleX: direction === 'rtl' ? -1 : 1 }],
                                },
                                {
                                  width: 25,
                                  height: 25,
                                  tintColor: COLORS.secondary,
                                  marginLeft:'20%'
                                }
                              ]}
                            />
                          )}
                        closeIcon="close"
                        mode='outlined'
                        rippleColor={COLORS.lightGreen}
                        textStyle={{color:COLORS.primary,
                                    ...FONTS.h4,
                                    fontSize:15,
                                    marginLeft:'-2%'}}
                        style={{backgroundColor:COLORS.white,
                                borderColor:COLORS.lightGray,
                                borderWidth:3,
                                borderRadius:20,
                                shadowColor:COLORS.primary,
                                shadowOpacity:0.8,
                                shadowRadius:3.85,
                                shadowOffset:{
                                    height:1,
                                    width:1
                                },
                                elevation:1,
                                width: '80%',
                                height: '80%',
                                color:COLORS.primary,
                                marginTop:'5%'
                            }}
                        onPress={handleSettingsPress}>
                        Your Settings
                        </Chip>
                    </View>
                    </View>
                    </View>
                
            </ImageBackground>
            </View>
        )
    }



    return (
        <View style={{flex:1}}>
           {/* <PaperProvider>
        <Portal> */}
        {inventoryHeader()}
        {/* </Portal>
        </PaperProvider> */}
        </View>
    );
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	backgroundImage: {
		flex: 1,
		height: "100%",
        width: "100%",
        // resizeMode:'contain',
		// justifyContent: "center",
		// alignItems: "center",
	},
    hearderContainer: {
		height: "25%",
		// backgroundColor: "yellow",
		width: "80%",
		justifyContent: "center",
		alignSelf: "flex-start",
		marginLeft: "15%",
        marginTop: "30%",
	},
	header: {
		...FONTS.h1,
		color: COLORS.primary,
	},
    subHeader: {
        ...FONTS.body5,
        marginLeft: '1%',
        marginTop: '5%',
        fontSize: 14,
        color: COLORS.darkGray,
    },
    calendarCard: {
        alignSelf: "center",
        marginTop: "-5%",
		height: "50%",
		width: "80%",
        // marginBottom: "10%",
		backgroundColor: COLORS.white,
		borderTopLeftRadius: 35,
		borderTopRightRadius: 35,
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
	},
});



export default InventoryPage;