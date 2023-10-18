import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';

import { List, Divider,PaperProvider,Appbar} from 'react-native-paper';

const SettingPage = ({}) => {
  const navigation = useNavigation();
  const handleItemClick = (routeName) => {
    navigation.navigate(routeName);
  };
  const handleBackPress = () => {
    navigation.goBack();
  };

  const aboutSection = () => {
    return(
        <PaperProvider>
        <Appbar.Header
        style={styles.navBar}
        >
         <Appbar.BackAction onPress={handleBackPress} 
            />
           <Appbar.Content title="Settings" 
           titleStyle={{...FONTS.h3, color: COLORS.primary}}
           />
       </Appbar.Header>
       <View style={styles.container}>
         <List.Section>
           <List.Subheader
           style={styles.listSubHeader}
           >About</List.Subheader>
           <List.Item
             titleStyle={styles.listItem}
             title="Terms of Service"
             left={() => <List.Icon icon="file-document" color={COLORS.primary}/>}
             onPress={() => handleItemClick('TermsOfService')}
           />
           <Divider />
           <List.Item
           titleStyle={styles.listItem}
             title="Privacy Policy"
             left={() => <List.Icon icon="shield-lock" color={COLORS.primary}/>}
             onPress={() => handleItemClick('PrivacyPolicy')}
           />
           <Divider />
           <List.Item
           titleStyle={styles.listItem}
             title="Acknowledgements"
             left={() => <List.Icon icon="heart" color={COLORS.primary}/>}
             onPress={() => handleItemClick('Acknowledgements')}
           />
           <Divider />
           <List.Item
             title="Version"
             titleStyle={styles.listItem}
             description="0.1.0"
             left={() => 
             <List.Icon 
              icon="information"
              color={COLORS.primary}
             />}
             disabled
           />
         </List.Section>
       </View>
       </PaperProvider>
    );
  };

  return (
    <View style={{flex:1,backgroundColor:COLORS.lightGray}}>
        {aboutSection()}
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:'0%',
    marginLeft:'6%',
    marginRight:'6%',
  },
    navBar:{    
        backgroundColor: COLORS.white,
        shadowColor: COLORS.primary,
        shadowOffset: {
          width: 2,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
},
  listSubHeader:{
    ...FONTS.h2SemiBold,
    color:COLORS.lightGreen,
    marginLeft:'-5%',
  },
  listItem:{
    ...FONTS.body3,
    color:COLORS.primary,
  }
});

export default SettingPage;
