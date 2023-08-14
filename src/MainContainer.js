import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Animated } from 'react-native';
import icons from './constants/icons';

// Screens
import ReportPage from './screens/ReportPage';
import InventoryPage from './screens/InventoryPage';
import Home from './screens/Home';

//Screen names
const homeName = "Home";
const reportName = "Report";
const inventoryName = "Inventory";

const Tab = createBottomTabNavigator();

function TabBarIcon({ focused, source }) {
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
            <Animated.Image source={source} style={{ width: 26, height: 26, transform: [{ scale: scaleValue }] }} />
            {focused && <View style={{ height: 6, backgroundColor: 'rgba(0, 0, 0, 0.8)', width: 30, marginTop: 10, borderRadius: 6 }} />}
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

                    return <TabBarIcon focused={focused} source={iconImage} />;
                },
                tabBarStyle: { height: 60 },
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
