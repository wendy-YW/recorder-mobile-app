import * as React from 'react';
import {View, StyleSheet, Dimensions,ListRenderItem,Text } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
// import {SceneMap} from 'react-native-tab-view';
// import {HScrollView} from 'react-native-header-tab-view';

import { useNavigation } from '@react-navigation/native';

import {
  Appbar,
  Button,
  Title,
  Paragraph,
} from 'react-native-paper';
import {
  Tabs,
  TabScreen,
  useTabIndex,
  useTabNavigation,
  TabsProvider,
} from 'react-native-paper-tabs';
import { Circle } from 'react-native-svg';


const ProjectsItemsPage = ({route}) => {
  const { functionName } = route.params;
  const TabIndex = functionName === 'project' ? 1 : 0;
  // console.log(functionName);

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

const handleChangeIndex = (index) => console.log(index);


const ProjectsItemsTabView = () => {
  
  return (
    <TabsProvider
      defaultIndex={TabIndex} // default = 0
      // onChangeIndex={handleChangeIndex} //optional
    >
      <Tabs
        // uppercase={false} // true/false | default=true (on material v2) | labels are uppercase
        // showTextLabel={false} // true/false | default=false (KEEP PROVIDING LABEL WE USE IT AS KEY INTERNALLY + SCREEN READERS)
        // iconPosition // leading, top | default=leading
        iconPosition='top'
          style={{ backgroundColor:
                  COLORS.white,
                }} // works the same as AppBar in react-native-paper
        // dark={false} // works the same as AppBar in react-native-paper
        // theme={} // works the same as AppBar in react-native-paper
        theme={{
          colors: {
            primary: COLORS.secondary, 
            underlineColor: 'transparent',
            onSurface: COLORS.secondary,
            onSurfaceVariant: COLORS.primary,
          },
        }} 
        // mode="scrollable" // fixed, scrollable | default=fixed
        // showLeadingSpace={true} //  (default=true) show leading space in scrollable tabs inside the header
        //disableSwipe={false} // (default=false) disable swipe to left/right gestures
      >
        <TabScreen label="Items" icon="archive-edit-outline">
           <InventoryView />
        </TabScreen>
        <TabScreen
          label="Projects"
          icon="folder-plus-outline"
          // optional props
          // badge={true} // only show indicator
          // badge="text"
          // badge={1}
          // onPressIn={() => {
          //   console.log('onPressIn explore');
          // }}
          // onPress={() => {
          //   console.log('onPress explore');
          // }}
        >
           <ProjectView  />
           {/* <InventoryView /> */}
        </TabScreen>
        <TabScreen label="Customers" icon="account-edit" disabled>
          <View style={{ backgroundColor: 'black', flex:1 }} />
        </TabScreen>
      </Tabs>
    </TabsProvider>
  )
}

function InventoryView() {
  const goTo = useTabNavigation();
  const index = useTabIndex();
  return (
    <View style={{ 
      flex:1,
      backgroundColor:COLORS.lightGray,
    }}>
      {/* <Title>TODO</Title>
      <Paragraph>TODO</Paragraph> */}
      <Title></Title>
      <Paragraph></Paragraph>
      <Button
      onPress={() => goTo(1)}
      textColor= {COLORS.secondary}
      >Go to Projects</Button>
    </View>
  );
  }

  function ProjectView() {
    const goTo = useTabNavigation();
    const index = useTabIndex();
    return (
      <View style={{ 
        flex:1,
        backgroundColor:COLORS.lightGray,
      }}>
        {/* <Title>TODO</Title>
        <Paragraph>TODO</Paragraph> */}
        <Title></Title>
        <Paragraph></Paragraph>
        <Button
        onPress={() => goTo(0)}
        textColor= {COLORS.secondary}
        >Go to Items</Button>
      </View>
    );
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
    borderBottomColor: COLORS.gray + '90',
    borderBottomWidth: 1,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
},

});

export default ProjectsItemsPage;