import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Animated,Text} from 'react-native';
import { COLORS, FONTS, Icons, SIZES, icons } from './constants';

// Screens
import ReportPage from './screens/ReportPage';
import InventoryPage from './screens/InventoryPage';
import Home from './screens/Home';

//Screen names
const homeName = "Home";
const reportName = "Report";
const inventoryName = "Inventory";

const Tab = createBottomTabNavigator();

function TabBarIcon({ focused, source,color}) {
    const scaleValue = new Animated.Value(1);

    React.useEffect(() => {
        if (focused) {
            Animated.spring(scaleValue, {
                toValue: 1.2,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.spring(scaleValue, {
                toValue: 1,
                useNativeDriver: true,
            }).start();
        }
    }, [focused, scaleValue]);

    return (
        <View style={{ alignItems: 'center' }}>
            <Animated.Image source={source} 
            style={{ width: 26, height: 26, transform: [{ scale: scaleValue }],
            tintColor: focused ? COLORS.primary : COLORS.gray, 
            borderWidth: focused ? 12 : 3,   
             }}
            />
             {/* <Text style={{ fontWeight: focused ? 'bold' : 'normal' }}>
            </Text> */}
            {focused && 
            <View style={{ height: 6, backgroundColor: COLORS.primary, width: 30, marginTop: 10, borderRadius: 6}} 
            />
            }
        </View>
    );
}

function MainContainer() {
    return (
        <Tab.Navigator
            initialRouteName={homeName}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused }) => {
                    let iconImage;
                    let rn = route.name;

                    if (rn === reportName) {
                        iconImage = focused ? icons.chart_light : icons.chart_light;
                    } else if (rn === homeName) {
                        iconImage = focused ? icons.home : icons.home;
                    } else if (rn === inventoryName) {
                        iconImage = focused ? icons.folder : icons.folder;
                    }

                    // const iconColor = focused ? COLORS.white : COLORS.gray;

                    return <TabBarIcon 
                            focused={focused} 
                            source={iconImage}
                            // color={iconColor}  
                            />;
                },
                tabBarStyle: { height: 60, 
                    borderRadius: 30, 
                    borderTopLeftRadius: 40,
                    borderTopRightRadius: 40,
                    marginTop: -20,
                    backgroundColor: COLORS.white, 
                    borderTopColor: COLORS.gray,
                    borderLeftColor: COLORS.gray,
                    borderRightColor: COLORS.gray,
                    borderBottomColor: COLORS.gray,
                    borderTopWidth: 0.5,
                    borderLeftWidth: 0.5,
                    borderRightWidth: 0.5,
                    borderBottomWidth: 0.5,
                    },
                tabBarShowLabel: false,
            })}
        >
            <Tab.Screen name={reportName} component={ReportPage} options={{ headerShown: false }} />
            <Tab.Screen name={homeName} component={Home} options={{ headerShown: false }} />
            <Tab.Screen name={inventoryName} component={InventoryPage} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
}


export default MainContainer;
