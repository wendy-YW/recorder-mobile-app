import * as React from 'react';
import {View, StyleSheet, Dimensions,ListRenderItem,Text } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
// import {SceneMap} from 'react-native-tab-view';
// import {HScrollView} from 'react-native-header-tab-view';
import { Tabs } from 'react-native-collapsible-tab-view'
import { useNavigation } from '@react-navigation/native';

import {Appbar} from 'react-native-paper';


const ProjectsItemsPage = ({}) => {

const initialLayout = {width: Dimensions.get('window').width};

  const navigation = useNavigation();
  const handleBackPress = () => {
    navigation.goBack();
  };


const ProjectsItemsAppBarView = () => {
    return (
        <Appbar.Header
        style={styles.navBar}
        >
         <Appbar.BackAction onPress={handleBackPress} 
            />
           <Appbar.Content title="Inventory" 
           titleStyle={{...FONTS.h3, color: COLORS.primary}}
           />
       </Appbar.Header>
    
    );
};


// const HEADER_HEIGHT = 250
const DATA = [0, 1, 2, 3, 4]
const identity = (v) => v.toString();

const Header = () => {
  return (

  <View style={styles.header}>
     {/* <Tabs.Bar style={{backgroundColor:COLORS.lightGreen}} /> */}
  </View>
  );
}

const ProjectsItemsTabView = () => {
  const renderItem = React.useCallback(({ index }) => {
    return (
      <View style={[styles.box, index % 2 === 0 ? styles.boxB : styles.boxA]} />
    )
  }, [])

  return (
    <Tabs.Container
      renderHeader={Header}
    //   headerHeight={HEADER_HEIGHT} // optional
    >
      <Tabs.Tab 
        name="PROJECT"
        >
        <Tabs.FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={identity}
        />
      </Tabs.Tab>
      <Tabs.Tab name="ITEM">
        <Tabs.ScrollView>
          <View style={[styles.box, styles.boxB]} />
        </Tabs.ScrollView>
      </Tabs.Tab>
    </Tabs.Container>
  )
}



return (
    <View style={{flex:1,backgroundColor:COLORS.white}}>
        {ProjectsItemsAppBarView()}
        {ProjectsItemsTabView()}
    </View>
    );
};


const styles = StyleSheet.create({
  scene: {
    flex: 1,
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

box: {
    height: 300,
    width: '100%',
  },
  boxA: {
    backgroundColor: COLORS.white,
  },
  boxB: {
    backgroundColor: COLORS.white,
  },
  header: {
    height: 120,
    width: '100%',
    backgroundColor: COLORS.lightGray,
  },
});

export default ProjectsItemsPage;