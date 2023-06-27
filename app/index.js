import { useState } from "react";
import { View, ScrollView, SafeAreaView } from "react-native";
import { Stack, useRouter } from 'expo-router';

import {COLORS,FONTS,SIZES,icons} from '../recorder-mobile-app/src/constants';


const Home = () => {
    const router = useRouter();

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: COLORS.
        primary}}>
            <Stack.Screen
                options={{
                    headerStyle: { backgroundColor: COLORS.primary },
                }}
            />
        </SafeAreaView>
    )
}

export default Home;