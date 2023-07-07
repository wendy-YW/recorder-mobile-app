import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Animated } from 'react-native';
import icons from '../../../constants/icons';

// Screens
import ChartScreen from './ChartScreen';
import HomeScreen from './HomeScreen';
import InventoryScreen from './InventoryScreen';

// Screen names
const calendarName = 'Chart';
const homeName = 'Home';
const inventoryName = 'Inventory';

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
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName={homeName}
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused }) => {
                        let iconImage;
                        let rn = route.name;

                        if (rn === calendarName) {
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
                <Tab.Screen name={calendarName} component={ChartScreen} options={{ headerShown: false }} />
                <Tab.Screen name={homeName} component={HomeScreen} options={{ headerShown: false }} />
                <Tab.Screen name={inventoryName} component={InventoryScreen} options={{ headerShown: false }} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

export default MainContainer;
