import * as React from 'react';
import { Modal, Portal, Text, Button, PaperProvider, Tooltip, Appbar } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, TouchableWithoutFeedback, TouchableOpacityComponent } from 'react-native';
import { StatusBar } from 'react-native';
import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, SIZES, icons } from '../constants';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Ionicons';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';

import { SwipeDownModal } from 'react-native-swipe-down-modal';
import { Isao } from 'react-native-textinput-effects';
import DateTimePicker from '@react-native-community/datetimepicker';
import AnimatedInvoice from 'react-native-collapsible-invoice';
import { SelectList } from 'react-native-dropdown-select-list';
import LottieView from 'lottie-react-native';
import animationData from '../assets/animations/check_animation.json';
import axios from 'axios';


// import NewItemForm from './NewItemForm'; //need to modify for code review
import { set } from 'react-native-reanimated';


const RecordFormPage = () => {
  //status bar
  useEffect(() => {
    changeStatusBarStyle();
  }, []);
  function changeStatusBarStyle() {
    // Code to change the status bar style
    StatusBar.setBarStyle('dark-content');
    StatusBar.setBackgroundColor('transparent');
    //StatusBar.setTranslucent(true);
  }


  //handle input fields
  const useTextInput = (initialValue, validate = null) => {
    const [value, setValue] = useState(initialValue);
    const [error, setError] = useState(null);

    const handleChange = (text) => {
      setValue(text);
      setError(null);

      if (validate) {
        const validationError = validate(text);
        setError(validationError);
      }
    };

    return [value, handleChange, error, setError];
  };

  const validateNotEmpty = (text) => {
    if (!text.trim()) {
      return 'Field cannot be empty';
    }
    return null;
  };

  const validateNumber = (text) => {
    if (!text.trim() || isNaN(text)) {
      return 'Field must be a number';
    }
    return null;
  };

  const validateDate = (text) => {
    // validate date format 'dd/mm/yyyy'
    const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!datePattern.test(text)) {
      return 'Invalid date format';
    }
    return null;
  };

  // validate time format 'HS:MM'
  const validateTime = (text) => {
    if (!text.trim()) {
      return 'Field cannot be empty';
    }

    const timePattern = /^(\d+)(?::(\d+))?$/;
    if (!timePattern.test(text)) {
      return 'Invalid time format. Please use HS:MM';
    }

    const [, minutes] = text.split(':');
    if (minutes && Number(minutes) >= 60) {
      return 'Invalid minute value';
    }

    return null;
  };

  //set input fields
  const [timeString, handleTimeStringChange, timeStringError, setTimeStringError] = useTextInput('', validateTime);
  const [selectedProjectName, setSelectedProjectName, selectedProjectNameError, setSelectedProjectNameError] = useTextInput('', validateNotEmpty);
  const [selectedItemName, setSelectedItemName, selectedItemNameError, setSelectedItemNameError] = useTextInput('', validateNotEmpty);
  const [selectedItemQuantity, handleSelectedItemQuantityChange, selectedItemQuantityError, setSelectedItemQuantityError] = useTextInput('', validateNumber);



  //go-back navigation
  const navigation = useNavigation();
  function goBack() {
    navigation.navigate('Home');;
  }

  //modal
  const [projectModalvisible, setProjectModalVisible] = React.useState(false);
  const showProjectModal = () => setProjectModalVisible(true);
  const hideProjectModal = () => setProjectModalVisible(false);

  const [itemModalVisible, setItemModalVisible] = React.useState(false);
  const showItemModal = () => setItemModalVisible(true);
  const hideItemModal = () => setItemModalVisible(false);
  const projectContainerStyle = {
    backgroundColor: COLORS.white,
    padding: 30,
    margin: 20,
    borderRadius: 10,
    height: '70%',
    width: '75%',
    marginLeft: '6%',
    marginTop: '72%',
    marginBottom: 200
  };
  const itemContainerStyle = {
    backgroundColor: COLORS.white,
    padding: 30,
    margin: 20,
    borderRadius: 10,
    height: '70%',
    width: '80%',
    marginLeft: '10%',
    marginTop: '0%',
    marginBottom: '10%'
  };


  //selector
  const [projectOpen, setProjectOpen] = useState('');
  const [projects, setProjects] = useState([]);

  // Fetch projects from the API when the component mounts
  useEffect(() => {
    fetchProjects();
    fetchItems();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:3000/api/projects');
      setProjects(response.data); // Set the fetched projects
      return response.data; // Return the fetched projects data
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error; // Re-throw the error to handle it later
    }
  };

  const handleSelect = (selectedItem) => {
    setProjectOpen(selectedItem);
  };
  const [itemOpen, setItemOpen] = useState('');
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:3000/api/items');
      setItems(response.data); // Set the fetched items
      return response.data; // Return the fetched items data
    } catch (error) {
      console.error('Error fetching items:', error);
      throw error; // Re-throw the error to handle it later
    }
  };




  //selected list
  const [itemList, setItemList] = useState([]);
  const [checkItemListError, setCheckItemListError] = useState(null);
  //handle add item
  const handleAddItem = () => {
    const itemNameError = validateNotEmpty(selectedItemName);
    const itemQuantityError = validateNumber(selectedItemQuantity);

    if (!itemNameError && !itemQuantityError) {
      const dotsCount = 30 - selectedItemName.length - selectedItemQuantity.length;
      const itemNameWithDots = `${selectedItemName}${'.'.repeat(0)}`; // Add dots after the item name
      const formattedItem = `${itemNameWithDots} ${selectedItemQuantity}`; // Concatenate item name with dots, space, and quantity
      setItemList(prevList => [...prevList, formattedItem]);

      handleSelectedItemQuantityChange('');
      setSelectedItemNameError(null);
      setSelectedItemQuantityError(null);
    } else {
      setSelectedItemNameError(itemNameError);
      setSelectedItemQuantityError(itemQuantityError);
    }
    checkItemListError && setCheckItemListError(null);
  };


  //dot counter
  const dotWidth = 14; // width of a single dot character
  const calculateDotCount = () => {
    const itemNameWidth = selectedItemName.length * 20;
    const itemQuantityWidth = selectedItemQuantity.length * 20;
    const availableWidth = Dimensions.get('window').width - itemNameWidth - itemQuantityWidth - SIZES.iconSize - 10;
    //console.log(availableWidth);
    const maxDotsCount = Math.floor(availableWidth / dotWidth);
    return Math.max(maxDotsCount, 0);
  };
  const dots = '.'.repeat(calculateDotCount());

  //delete list item
  const handleDeleteItem = (index) => {
    setItemList(prevList => prevList.filter((_, i) => i !== index));
  };


  // const Project = require('../../server/models/project');

  const fetchProjectRecords = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:3000/api/projectRecords');
      return response.data; // Return the fetched project records data
    } catch (error) {
      console.error('Error fetching project records:', error);
      throw error; // Re-throw the error to handle it later
    }
  };


  const handleUploadRecordProject = async () => {
    try {
      // Fetch the list of items and projects
      const fetchedItems = await fetchItems();
      const fetchedProjects = await fetchProjects();
      const fetchedProjectRecords = await fetchProjectRecords();

      // Find the selected item and project based on their names
      const selectedItem = fetchedItems.find(item => item.name === selectedItemName);
      const selectedProject = fetchedProjects.find(project => project.name === selectedProjectName);
      const selectedProjectRecord = fetchedProjectRecords.find(record => record.project.toString() === selectedProject._id.toString());

      console.log("RECORD: ", selectedProjectRecord);
      if (!selectedItem) {
        console.error('Item not found');
        return;
      }

      if (!selectedProject) {
        console.error('Project not found');
        return;
      }

      // Calculate total minutes from timeString
      const [hours, minutes] = timeString.split(':');
      const totalMinutes = parseInt(hours, 10) * 60 + parseInt(minutes, 10);

      // Create the data object for the project record
      const data = {
        timeWorked: totalMinutes,
        items: itemList.map(item => {
          const [itemNameWithDots, itemQuantity] = item.split(' ');

          return {
            item: selectedItem._id,
            quantity: parseInt(itemQuantity, 10),
          };
        }),
      };

      console.log("Projekti: ", selectedProject);
      console.log("ID: ", selectedProject._id);

      // Check if a project record needs to be created or updated
      if (selectedProjectRecord) {
        // Update existing project record
        data.projectId = selectedProjectRecord._id;
        data.workedHours = totalMinutes;  // Add worked hours for update

        axios.post('http://10.0.2.2:3000/api/projectRecords/updateProjectRecord', data)
          .then(response => {
            console.log('Success:', response.data);
          })
          .catch(error => {
            console.error('Error:', error);
          });
      } else {
        // Create a new project record
        data.project = selectedProject._id;

        axios.post('http://10.0.2.2:3000/api/projectRecords/create', data)
          .then(response => {
            console.log('Success:', response.data);
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
    } catch (error) {
      console.error('Error in handleUploadRecordProject:', error);
    }
  };

  // Create the data object for the project record
  //     const data = {
  //       timeWorked: totalMinutes,
  //       items: itemList.map((item, index) => {
  //         const [itemNameWithDots, itemQuantity] = item.split(' ');

  //         return {
  //           item: selectedItem._id,
  //           quantity: parseInt(itemQuantity, 10),
  //         };
  //       }),
  //       project: selectedProject._id, // Link the project record to the selected project
  //     };

  //     console.log('Data:', data);

  //     // Make a POST request to create the project record
  //     axios.post('http://10.0.2.2:3000/api/projectRecords/create', data)
  //       .then(response => {
  //         console.log('Success:', response.data);
  //       })
  //       .catch((error) => {
  //         console.error('Error:', error);
  //       });
  //   } catch (error) {
  //     console.error('Error in handleUploadRecordProject:', error);
  //   }
  // };



  //snack bar
  const handleSaveRecordButtonPress = () => {
    handleUploadRecordProject();
    console.log('handleSaveRecordButtonPress called');
    console.log('selectedProjectName:', selectedProjectName);
    console.log('timeString:', timeString);
    console.log('itemName:', selectedItemName);
    console.log('selectedItemQuantity:', selectedItemQuantity);


    // Validate input fields
    const selectedProjectNameError = validateNotEmpty(selectedProjectName);
    const timeStringError = validateTime(timeString);
    const itemListError = itemList.length === 0 ? 'Please add at least one item' : null;
    if (selectedProjectNameError || timeStringError || itemListError) {
      setSelectedProjectNameError(selectedProjectNameError);
      setTimeStringError(timeStringError);
      setCheckItemListError(itemListError);
      return;
    }

    // Save record
    console.log("\nprojectName: " + selectedProjectName
      + "\ntimeWorked: " + timeString
      + "\nitemList: " + itemList.join(", "));
    // Navigate to home screen
    navigation.navigate('Home', { sbVisible: true });
  };




  function renderNavBar() {
    return (
      <View style={{ flex: 1 }}>
        <Appbar.Header
          mode='small'
          style={styles.navBar}
        >
          <Appbar.Action icon='arrow-left' onPress={goBack} />
          <Appbar.Content
            title="NEW RECORD"
            titleStyle={{ ...FONTS.h3, color: COLORS.primary }}
          />
          <Appbar.Action icon="format-list-bulleted" onPress={goBack} />
          <Appbar.Action icon="check-bold" onPress={handleSaveRecordButtonPress} />
        </Appbar.Header>
        <ScrollView>
          {createRecord()}
        </ScrollView>
      </View>
    )
  }



  function createRecord() {
    return (
      <View style={{ flex: 1, backgroundColor: "transparent", padding: 15, marginLeft: '-3%' }}>
        {/* title */}
        <View style={{ marginLeft: 50, paddingRight: '22%', paddingTop: 10 }}>
          <Isao
            label={'NAME'}
            activeColor={COLORS.secondary}
            labelStyle={{ ...FONTS.h3 }}
            borderHeight={3}
            inputPadding={0}
            labelHeight={24}
            placeholder="Select Your Project"
            placeholderTextColor={COLORS.gray}
            inputStyle={{ color: COLORS.secondary, ...FONTS.body3SemiBold, fontSize: SIZES.h2 }}
            passiveColor={COLORS.primary}
            value={selectedProjectName}
            onChangeText={setSelectedProjectName}
          />
          {selectedProjectNameError && <Text style={styles.errorText}>{selectedProjectNameError}</Text>}
        </View>
        <View style={{ paddingLeft: '86%', paddingTop: '10%', paddingBottom: 30, position: 'absolute' }}>
          <TouchableOpacity>
            <Ionicons name="caret-down-circle-outline" size={40} color={COLORS.primary} onPress={showProjectModal} />
          </TouchableOpacity>
          <Portal>
            <Modal visible={projectModalvisible} onDismiss={hideProjectModal} contentContainerStyle={projectContainerStyle}>
              <View style={{ flex: 1, backgroundColor: "transparent" }}>
                <Text style={{ ...FONTS.h3, color: COLORS.primary, paddingBottom: 10 }}>SELECT PROJECT</Text>
                <Text style={{ ...FONTS.body3Light, color: COLORS.primary, paddingBottom: 10 }}>Please select from existing projects or add a new project.</Text>
                <TouchableOpacity onPress={handleProjectFormPress}>
                  <Text style={{ ...FONTS.h4, color: COLORS.secondary, paddingBottom: 20, textAlign: 'right', paddingRight: 0 }}>ADD PROJECT</Text>
                </TouchableOpacity>
                <SelectList
                  setSelected={(val) => setSelectedProjectName(val)}
                  fontFamily='Inter-Light'
                  data={projects.map(project => ({ key: project._id, value: project.name }))} // Transform project data to match SelectList format
                  save='value'
                  arrowicon={<Icon name="chevron-down" size={12} color={COLORS.primary} />}
                  searchicon={<Icon name="search" size={12} color={COLORS.primary} />}
                  search={true}
                  boxStyles={{ borderRadius: 30 }} //override default styles
                  defaultOption={{}}   //default selected option
                />
                <View style={{ flexDirection: 'row', alignContent: 'space-between' }}>
                  <Text style={{ ...FONTS.h4, color: COLORS.primary, paddingBottom: 10, paddingTop: 20 }}>Selected:</Text>
                  <Text style={{ ...FONTS.body4Light, color: COLORS.primary, paddingBottom: 10, paddingTop: 20, paddingLeft: 10 }}>{selectedProjectName}</Text>
                </View>
                <TouchableOpacity onPress={hideProjectModal}>
                  <Text style={{ ...FONTS.h4, color: COLORS.primary, paddingBottom: 20, textAlign: 'right', paddingRight: 10, paddingTop: 20 }}>SAVE</Text>
                </TouchableOpacity>
              </View>

            </Modal>
          </Portal>
        </View>
        {/* hours */}
        <View style={{ marginLeft: 50, marginTop: '5%' }} >
          <View style={{ paddingRight: '55%' }}>
            <Isao
              label={'TIME WORKED'}
              activeColor={COLORS.secondary}
              labelStyle={{ ...FONTS.h3 }}
              borderHeight={3}
              inputPadding={0}
              labelHeight={24}
              placeholder="HS:MM"
              placeholderTextColor={COLORS.gray}
              inputStyle={{ color: COLORS.secondary, ...FONTS.body3SemiBold, fontSize: SIZES.h2 }}
              passiveColor={COLORS.primary}
              value={timeString}
              onChangeText={handleTimeStringChange}
            />
          </View>
          {timeStringError && <Text style={styles.errorText}>{timeStringError}</Text>}

        </View>
        {/* items */}
        <View style={{ paddingTop: '15%', marginLeft: 40, marginRight: 25 }}>
          <View style={{
            backgroundColor: COLORS.secondary,
            borderRadius: 20,
            borderLeftWidth: 10,
            //borderTopWidth:5,
            borderEndWidth: 10,
            //borderBottomWidth:5,
            borderTopColor: COLORS.secondary,
            borderBottomColor: COLORS.secondary,
            borderEndColor: COLORS.secondary,
            borderLeftColor: COLORS.secondary,
            marginLeft: 10,
            marginRight: 10
          }}>
            <AnimatedInvoice
              borderRadius={20}
              barStyle={{ backgroundColor: 'white' }}
              triangleStyle={{ backgroundColor: 'white' }}
              barComponent={
                <View>
                  < Text style={{
                    marginLeft: 15, ...FONTS.body4Light,
                    color: COLORS.primary,
                  }} >ITEMS</Text>
                </View>
              }>

              <View style={{ marginLeft: 20, marginRight: '22%', paddingTop: 5 }}>
                <Isao
                  label={'NAME'}
                  activeColor={COLORS.secondary}
                  labelStyle={{
                    fontFamily: FONTS.h3SemiBold,
                  }}
                  borderHeight={3}
                  inputPadding={0}
                  labelHeight={24}
                  placeholder="Select Item"
                  placeholderTextColor={COLORS.gray}
                  inputStyle={{ color: COLORS.secondary, ...FONTS.body3SemiBold, fontSize: SIZES.h3 }}
                  passiveColor={COLORS.primary}
                  value={selectedItemName}
                  onChangeText={setSelectedItemName}
                />
                {selectedItemNameError && <Text style={styles.errorText}>{selectedItemNameError}</Text>}

              </View>
              <View style={{ paddingLeft: '83%', paddingTop: '10%', position: 'absolute' }}>
                <TouchableOpacity>
                  <Ionicons name="caret-down-circle-outline" size={30} color={COLORS.primary} onPress={showItemModal} />
                </TouchableOpacity>
              </View>

              <Portal>
                <Modal visible={itemModalVisible} onDismiss={hideItemModal} contentContainerStyle={itemContainerStyle}>

                  <View style={{ flex: 1, backgroundColor: "transparent" }}>
                    <Text style={{ ...FONTS.h3, color: COLORS.primary, paddingBottom: 10 }}>SELECT ITEM</Text>
                    <Text style={{ ...FONTS.body3Light, color: COLORS.primary, paddingBottom: 10 }}>Please select from existing items or add a new item.</Text>
                    <TouchableOpacity onPress={handleItemFormPress}>
                      <Text style={{ ...FONTS.h4, color: COLORS.secondary, paddingBottom: 20, textAlign: 'right', paddingRight: 10 }}>ADD ITEM</Text>
                    </TouchableOpacity>
                    <SelectList
                      setSelected={(val) => setSelectedItemName(val)}
                      fontFamily='Inter-Light'
                      data={items.map(item => ({ key: item._id, value: item.name }))} // Transform item data to match SelectList format
                      save='value'
                      arrowicon={<Icon name="chevron-down" size={12} color={COLORS.primary} />}
                      searchicon={<Icon name="search" size={12} color={COLORS.primary} />}
                      search={true}
                      boxStyles={{ borderRadius: 30 }} //override default styles
                      defaultOption={{}}   //default selected option
                    />
                    <View style={{ flexDirection: 'row', alignContent: 'space-between' }}>
                      <Text style={{ ...FONTS.h4, color: COLORS.primary, paddingBottom: 10, paddingTop: 20 }}>Selected:</Text>
                      <Text style={{ ...FONTS.body4Light, color: COLORS.primary, paddingBottom: 10, paddingTop: 20, paddingLeft: 10 }}>{selectedItemName}</Text>
                    </View>
                    <TouchableOpacity onPress={hideItemModal}>
                      <Text style={{ ...FONTS.h4, color: COLORS.secondary, paddingBottom: 20, textAlign: 'right', paddingRight: 10 }}>SAVE</Text>
                    </TouchableOpacity>
                  </View>
                </Modal>
              </Portal>
              <View style={{ marginLeft: 20, marginRight: '50%', paddingTop: 5, paddingBottom: 0 }}>
                <Isao
                  label={'QUANTITY'}
                  activeColor={COLORS.secondary}
                  labelStyle={{ fontFamily: FONTS.h3SemiBold }}
                  borderHeight={3}
                  inputPadding={0}
                  labelHeight={24}
                  placeholder="Number"
                  placeholderTextColor={COLORS.gray}
                  inputStyle={{ color: COLORS.secondary, ...FONTS.body3SemiBold, fontSize: SIZES.h3 }}
                  passiveColor={COLORS.primary}
                  value={selectedItemQuantity}
                  onChangeText={handleSelectedItemQuantityChange}
                />
              </View>
              <View style={{ marginLeft: 20 }}>
                {selectedItemQuantityError && <Text style={styles.errorText}>{selectedItemQuantityError}</Text>}
              </View>
              <View style={{ marginLeft: '75%', marginTop: '0%', paddingBottom: 20 }}>
                <TouchableOpacity>
                  <Ionicons name="add-circle-sharp" size={50} color={COLORS.primary} onPress={handleAddItem} />
                </TouchableOpacity>
              </View>
              <View style={{ marginLeft: 20, marginRight: 0, paddingBottom: 20 }} >
                {itemList.map((item, index) => {
                  const [itemNameWithDots, itemQuantity] = item.split(' ');
                  return (
                    <View key={index} style={{ flexDirection: 'row' }}>
                      <Text style={{ color: COLORS.primary, ...FONTS.body3Light }}>
                        {itemNameWithDots}
                      </Text>
                      <Text style={{ color: COLORS.gray, ...FONTS.body4Light }}>
                        {dots}
                      </Text>
                      <Text style={{
                        color: COLORS.primary, ...FONTS.body3Light,
                        fontWeight: 'bold'
                      }}>
                        {itemQuantity}</Text>
                      <TouchableOpacity onPress={() => handleDeleteItem(index)}>
                        <Ionicons name="trash" size={22} color={COLORS.gray} />
                      </TouchableOpacity>
                    </View>
                  );
                })}
                {checkItemListError && <Text style={styles.errorText}>{checkItemListError}</Text>}
              </View>
            </AnimatedInvoice>
          </View>
        </View>
        {/* users */}
        <View style={{ paddingTop: 40, marginLeft: 40, marginRight: 25 }}>
          <View style={{
            backgroundColor: COLORS.secondary,
            borderRadius: 20,
            borderLeftWidth: 10,
            borderEndWidth: 10,
            borderTopColor: COLORS.secondary,
            borderBottomColor: COLORS.secondary,
            borderEndColor: COLORS.secondary,
            borderLeftColor: COLORS.secondary,
            marginLeft: 10,
            marginRight: 10
          }}>
            <AnimatedInvoice
              borderRadius={20}
              barStyle={{ backgroundColor: 'white' }}
              triangleStyle={{ backgroundColor: 'white' }}
              barComponent={<View>
                < Text style={{
                  marginLeft: 15,
                  ...FONTS.body4Light,
                  color: COLORS.primary,
                }} >USERS</Text>
              </View>
              }>
              <View style={{ marginLeft: 20, marginRight: '20%', paddingTop: 5, marginBottom: 20 }}>
                <Isao
                  label={'NAME'}
                  activeColor={COLORS.secondary}
                  labelStyle={{ ...FONTS.body3SemiBold }}
                  borderHeight={3}
                  inputPadding={0}
                  labelHeight={24}
                  placeholder="Add user name"
                  placeholderTextColor={COLORS.gray}
                  inputStyle={{ color: COLORS.secondary, ...FONTS.body3SemiBold, fontSize: SIZES.h3 }}
                  passiveColor={COLORS.primary}
                />
              </View>
              <View style={{ marginLeft: '82%', paddingTop: '10%', position: 'absolute' }}>
                <TouchableOpacity>
                  <Ionicons name="add-circle-outline" size={30} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
              <View style={{ marginLeft: 20, marginRight: 60, paddingTop: 20, paddingBottom: 20 }}>
                <Text style={{ ...FONTS.body3 }}>For Authentication login?</Text>
              </View>
            </AnimatedInvoice>
          </View>
        </View>
      </View>
    )
  }




  //item & project form
  const [itemNameInput, handleItemNameChange, itemNameError, setItemNameError] = useTextInput('', validateNotEmpty);
  const [itemPriceInput, handleItemPriceChange, itemPriceError, setItemPriceError] = useTextInput('', validateNumber);
  const [itemQuantityInput, handleItemQuantityChange, itemQuantityError, setItemAmountError] = useTextInput('', validateNumber);
  const [itemInfoInput, handleItemlInfoChange] = useTextInput('');
  const [projectNameInput, handleProjectNameChange, projectNameError, setProjectNameError] = useTextInput('', validateNotEmpty);
  const [projectDescriptionInput, handleProjectDescriptionChange] = useTextInput('');
  const [dateString, handleDateChange, dateStringError, setDateStringError] = useTextInput('', validateDate);


  //date options
  const dateOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };
  //date picker
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    const newDateString = currentDate.toLocaleDateString('en-GB', dateOptions);
    handleDateChange(newDateString);
  };
  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };
  const showDatePicker = () => {
    showMode('date');
  };

  //sheets
  const [isItemFormVisible, setItemFormVisible] = useState(false);
  const [isProjectFormVisible, setProjectFormVisible] = useState(false);
  const [showItemSuccess, setItemShowSuccess] = useState(false);
  const [showProjectSuccess, setProjectSuccess] = useState(false);

  const handleItemFormPress = () => {
    setItemFormVisible(true);
  };
  const handleItemSccuess = () => {
    setItemShowSuccess(true);
  };
  let timer;
  useEffect(() => {
    if (showItemSuccess) {
      timer = setTimeout(() => {
        setItemFormVisible(false);
        handleItemReset();
        setItemShowSuccess(false);
      }, 5000);  //5 seconds
      return () => clearTimeout(timer);
    }
  }, [showItemSuccess]);

  const handleUploadItem = () => {
    const data = {
      name: itemNameInput,
      price: itemPriceInput,
      quantity: itemQuantityInput,
      info: itemInfoInput
    };

    console.log('Data:', data);

    axios.post('http://10.0.2.2:3000/api/items/create', data)
      .then(response => {
        console.log('Success:', response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleItemFormClose = () => {
    handleUploadItem();
    const itemNameError = validateNotEmpty(itemNameInput);
    const itemPriceError = validateNumber(itemPriceInput);
    const itemQuantityError = validateNumber(itemQuantityInput);
    if (itemNameError || itemPriceError || itemQuantityError) {
      setItemNameError(itemNameError);
      setItemPriceError(itemPriceError);
      setItemAmountError(itemQuantityError);
      console.log("Error in item form");
    } else {
      console.log("\nmaterialName: " + itemNameInput
        + "\nmaterialPrice: " + itemPriceInput
        + "\nmaterialAmount: " + itemQuantityInput
        + "\nmaterialInfo: " + itemInfoInput);
      console.log("Closing material form");

      handleItemSccuess();
    }
  };

  const handleDismissItemForm = () => {
    setItemFormVisible(false);
    handleItemReset();
    setItemShowSuccess(false);
    clearTimeout(timer);
  };



  const handleProjectFormPress = () => {
    setProjectFormVisible(true);
  };
  const handleProjectSccuess = () => {
    setProjectSuccess(true);
  };
  useEffect(() => {
    if (showProjectSuccess) {
      timer = setTimeout(() => {
        setProjectFormVisible(false);
        handleProjectReset();
        setProjectSuccess(false);
      }, 5000);  // seconds
      return () => clearTimeout(timer);
    }
  }, [showProjectSuccess]);

  const moment = require('moment');

  const handleUploadProject = () => {
    const formattedStartDate = moment(dateString, 'DD/MM/YYYY').format('YYYY-MM-DD');

    const data = {
      name: projectNameInput,
      startDate: formattedStartDate,
      description: projectDescriptionInput,
      customerName: customerList.join(", ")
    };

    axios.post('http://10.0.2.2:3000/api/projects/create', data)
      .then(response => {
        console.log('Success:', response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleProjectFormClose = () => {
    handleUploadProject();
    const projectNameError = validateNotEmpty(projectNameInput);
    const dateStringError = validateDate(dateString);
    if (projectNameError || dateStringError) {
      setProjectNameError(projectNameError);
      setDateStringError(dateStringError);
    } else {
      console.log("\nprojectName: " + projectNameInput
        + "\ndate string: " + dateString
        + "\nprojectDescription: "
        + projectDescriptionInput
        + "\nCustomer List: " +
        customerList.join(", "));
      console.log("Closing project form");
      setProjectSuccess(true);
    }
  };

  hanldeDismissProjectForm = () => {
    setProjectFormVisible(false);
    handleProjectReset();
    setProjectSuccess(false);
    clearTimeout(timer);
  };


  //handle customer list
  const [customerName, setCustomerName] = useState('');
  const [customerNameError, setCustomerNameError] = useState('');
  const [customerList, setCustomerList] = useState([]); // State to store the list of customers

  const handleAddCustomer = () => {
    if (customerName.trim() === '') {
      setCustomerNameError('Name cannot be empty');
      return;
    }
    const newCustomer = customerName;
    setCustomerList([...customerList, newCustomer]); // Add the new customer to the list
    setCustomerName(''); // Clear the customer name input
  };
  const handleDeleteCustomer = (index, subIndex) => {
    const updatedList = [...customerList];
    const customerIndex = index + subIndex;
    updatedList.splice(customerIndex, 1);
    setCustomerList(updatedList);
  };


  // confirm status 
  const handleItemConfirm = () => {
    const textBody = (
      <Text>
        <Text style={styles.boldText}>Name:</Text> <Text style={{ ...FONTS.body2Light }}>{itemNameInput}</Text> {"\n"}
        <Text style={styles.boldText}>Price:</Text> <Text style={{ ...FONTS.body2Light }}>{itemPriceInput}</Text>{"\n"}
        <Text style={styles.boldText}>Quantity:</Text> <Text style={{ ...FONTS.body2Light }}>{itemQuantityInput}</Text>{"\n"}
        <Text style={styles.boldText}>Info:</Text> <Text style={{ ...FONTS.body2Light }}>{itemInfoInput}</Text>
      </Text>
    );
    return (
      <View>
        {textBody}
      </View>
    );
  };

  const handleItemReset = () => {
    handleItemConfirm();
    handleItemNameChange('');
    handleItemPriceChange('');
    handleItemQuantityChange('');
    handleItemlInfoChange('');
    // Reset error states
    setItemNameError('');
    setItemPriceError('');
    setItemAmountError('');
  };

  const handleProjectConfirm = () => {
    const textBody = (
      <Text>
        <Text style={styles.boldText}>Name:</Text> <Text style={{ ...FONTS.body2Light }}>{projectNameInput}</Text>{"\n"}
        <Text style={styles.boldText}>Start Date:</Text> <Text style={{ ...FONTS.body2Light }}>{dateString}</Text>{"\n"}
        <Text style={styles.boldText}>Description:</Text> <Text style={{ ...FONTS.body2Light }}>{projectDescriptionInput}</Text>{"\n"}
        <Text style={styles.boldText}>Customer List:</Text> <Text style={{ ...FONTS.body2Light }}>{customerList.join(", ")}</Text>
      </Text>
    );
    return (
      <View>
        {textBody}
      </View>
    );
    //showConfirmationPopup('success', 'ADDED PROJECT', textBody);
  }

  const handleProjectReset = () => {
    // Reset project form
    handleProjectConfirm();
    handleDateChange('');
    handleProjectNameChange('');
    handleProjectDescriptionChange('');
    setCustomerList([]);  // Reset customer list
    // Reset error states
    setDateStringError('');
    setProjectNameError('');
    setCustomerNameError('');
  };


  //lottie animation
  const LottieCheckAnimation = () => {
    return (
      <View style={{ width: 200, height: 200, flex: 1, marginLeft: '22%', marginTop: '5%' }}>
        <LottieView
          source={animationData}
          autoPlay
          loop={false}
          style={{ width: '100%', height: '100%' }}
        />
      </View>
    );
  };


  //item form
  function renderItemForm() {
    return (
      <SwipeDownModal
        visible={isItemFormVisible}
        onClose={handleDismissItemForm}
        backgroundColor='transparent'
        customHeader={
          <View
            style={{
              height: 40,
              borderBottomColor: COLORS.lightGray,
              borderBottomWidth: .5,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            <View style={{ width: 40, height: 5, borderRadius: 3, backgroundColor: 'grey' }} />
          </View>
        }
      >
        <ScrollView>
          <View style={{ flex: 1, backgroundColor: "transparent" }}>
            {!showItemSuccess ? (
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 20, paddingTop: 40, paddingBottom: 20 }}>
                  <Text style={{ ...FONTS.h2SemiBold, color: COLORS.primary }}>New Item</Text>
                </View>
                {/* image and name */}
                <View style={{ alignItems: 'stretch', paddingTop: 40, marginLeft: 60 }}>
                  <View style={{ marginLeft: 0, paddingRight: 0 }}>
                    <TouchableOpacity onPress={() => { }}>
                      <Ionicons name="image-outline"
                        size={40}
                        color={COLORS.primary} />
                    </TouchableOpacity>
                  </View>
                  <View style={{ paddingRight: '20%', marginLeft: 70, marginTop: -50 }}>
                    <Isao
                      label={'NAME'}
                      activeColor={COLORS.secondary}
                      labelStyle={{ ...FONTS.h3 }}
                      borderHeight={3}
                      inputPadding={0}
                      labelHeight={24}
                      placeholder="Add Item Name"
                      placeholderTextColor={COLORS.gray}
                      inputStyle={{ color: COLORS.secondary, ...FONTS.body3SemiBold, fontSize: SIZES.h3 }}
                      passiveColor={COLORS.primary}
                      value={itemNameInput}
                      onChangeText={handleItemNameChange}
                    />
                    {itemNameError && <Text style={styles.errorText}>{itemNameError}</Text>}
                  </View>
                </View>
                {/* price and quantity */}
                <View style={{ marginLeft: 30 }}>
                  <View style={{ marginLeft: 20 }}>
                    <View style={{ marginLeft: 10, marginRight: '70%' }}>
                      <Isao
                        label={'PRICE'}
                        activeColor={COLORS.secondary}
                        labelStyle={{ ...FONTS.h3 }}
                        borderHeight={3}
                        inputPadding={0}
                        labelHeight={40}
                        placeholder="Number"
                        placeholderTextColor={COLORS.gray}
                        inputStyle={{
                          color: COLORS.secondary,
                          ...FONTS.body3SemiBold, fontSize: SIZES.h3
                        }}
                        passiveColor={COLORS.primary}
                        value={itemPriceInput}
                        onChangeText={handleItemPriceChange}
                      />
                    </View>
                    <View style={{ marginLeft: 10, paddingRight: '60%' }}>
                      {itemPriceError && <Text style={styles.errorText}>{itemPriceError}</Text>}
                    </View>
                    <View style={{ marginLeft: 160, paddLeft: '1%', marginTop: '0%', position: 'absolute', paddingRight: '20%' }}>
                      <Isao
                        label={'QUANTITY'}
                        activeColor={COLORS.secondary}
                        labelStyle={{ ...FONTS.h3 }}
                        borderHeight={3}
                        inputPadding={0}
                        labelHeight={40}
                        placeholder="Number"
                        placeholderTextColor={COLORS.gray}
                        inputStyle={{ color: COLORS.secondary, ...FONTS.body3SemiBold, fontSize: SIZES.h3 }}
                        passiveColor={COLORS.primary}
                        value={itemQuantityInput}
                        onChangeText={handleItemQuantityChange}
                      />
                    </View>
                    <View style={{ marginLeft: 160, position: 'absolute', marginTop: 90, paddingRight: '20%' }}>
                      {itemQuantityError && <Text style={styles.errorText}>{itemQuantityError}</Text>}
                    </View>
                  </View>
                </View>
                {/* info */}
                <View style={{ marginLeft: 60, marginRight: '15%' }}>
                  <Isao
                    label={'INFO'}
                    activeColor={COLORS.secondary}
                    labelStyle={{ ...FONTS.h3 }}
                    borderHeight={3}
                    inputPadding={0}
                    labelHeight={24}
                    placeholder="Where you bought.etc"
                    placeholderTextColor={COLORS.gray}
                    inputStyle={{ color: COLORS.secondary, ...FONTS.body3SemiBold, fontSize: SIZES.h3 }}
                    passiveColor={COLORS.primary}
                    value={itemInfoInput}
                    onChangeText={handleItemlInfoChange}
                  />
                </View>
                {/* select materials cate */}


                {/* save button */}
                <View style={{ paddingTop: 60, marginLeft: 120, paddingHorizontal: 40, marginRight: 20 }}>
                  <Button mode="outlined"
                    style={{ borderColor: COLORS.primary }}
                    textColor={COLORS.primary}
                    onPress={handleItemFormClose}>
                    <Text style={{ ...FONTS.body4 }}>SAVE</Text>
                  </Button>
                </View>
              </View>
            ) : (
              <View style={{ flex: 1, backgroundColor: "transparent" }}>
                <LottieCheckAnimation />
                <View style={{
                  flexDirection: 'row',
                  marginLeft: '20%',
                  paddingTop: '10%',
                  marginTop: '5%',
                  marginRight: '10%',
                  paddingBottom: 20,
                  borderColor: COLORS.primary,
                  //borderWidth:2,
                  borderRadius: 30,
                  alignItems: 'center',
                }}>
                  {handleItemConfirm()}
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </SwipeDownModal>
    )
  }


  //project form
  function renderProjectForm() {
    return (
      <SwipeDownModal
        visible={isProjectFormVisible}
        onClose={hanldeDismissProjectForm}
        backgroundColor='transparent'
        customHeader={
          <View
            style={{
              height: 40,
              borderBottomColor: COLORS.lightGray,
              borderBottomWidth: .5,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            <View style={{ width: 40, height: 5, borderRadius: 3, backgroundColor: 'grey' }} />
          </View>
        }
      >
        <ScrollView>
          {!showProjectSuccess ? (
            <View style={{ flex: 1, backgroundColor: "transparent" }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 20, paddingTop: 40 }}>
                <Text style={{ ...FONTS.h2SemiBold, color: COLORS.primary }}>New Project</Text>
              </View>
              {/* name */}
              <View style={{ paddingTop: 40, marginLeft: 60 }}>
                <View style={{ marginLeft: 0, marginRight: 75 }}>
                  <Isao
                    label={'NAME'}
                    activeColor={COLORS.secondary}
                    labelStyle={{ ...FONTS.h3 }}
                    borderHeight={3}
                    inputPadding={0}
                    labelHeight={24}
                    placeholder="Add Project Name"
                    placeholderTextColor={COLORS.gray}
                    inputStyle={{ color: COLORS.secondary, ...FONTS.body3SemiBold, fontSize: SIZES.h3 }}
                    passiveColor={COLORS.primary}
                    value={projectNameInput}
                    onChangeText={text => handleProjectNameChange(text)}
                  />
                  {projectNameError && <Text style={styles.errorText}>{projectNameError}</Text>}
                </View>
              </View>
              {/* Date */}
              <View style={{ marginLeft: 50, paddingTop: 10, alignItems: 'stretch' }}>
                <View style={{ marginLeft: 10, paddingRight: '65%' }}>
                  <Isao
                    label={'START DATE'}
                    activeColor={COLORS.secondary}
                    labelStyle={{ ...FONTS.h3 }}
                    borderHeight={3}
                    inputPadding={0}
                    labelHeight={24}
                    placeholder="dd/mm/yyyy"
                    placeholderTextColor={COLORS.gray}
                    inputStyle={{ color: COLORS.secondary, ...FONTS.body3SemiBold, fontSize: SIZES.h3 }}
                    passiveColor={COLORS.primary}
                    value={dateString}
                  />
                </View>
                <View style={{ marginLeft: 10 }}>
                  {dateStringError && <Text style={styles.errorText}>{dateStringError}</Text>}
                </View>
                <View style={{ paddingLeft: '56%', marginTop: 25, paddingBottom: 30, position: 'absolute' }}>
                  <TouchableOpacity onPress={showDatePicker}>
                    <Ionicons name="calendar-sharp" size={30} color={COLORS.primary} />
                  </TouchableOpacity>
                  {/* color can not be changed for now, waiting for styles.xml */}
                  {show && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={date}
                      mode={mode}
                      is24Hour={true}
                      onChange={onChange}
                    />
                  )}
                </View>
              </View>
              {/* Description */}
              <View style={{ marginLeft: 60, marginRight: 75, paddingTop: 10, paddingBottom: 15 }}>
                <Isao
                  label={'DESCRIPTION'}
                  activeColor={COLORS.secondary}
                  labelStyle={{ ...FONTS.h3 }}
                  borderHeight={3}
                  inputPadding={0}
                  labelHeight={24}
                  placeholder="Finish Date.etc"
                  placeholderTextColor={COLORS.gray}
                  inputStyle={{ color: COLORS.secondary, ...FONTS.body3SemiBold, fontSize: SIZES.h3 }}
                  passiveColor={COLORS.primary}
                  value={projectDescriptionInput}
                  onChangeText={text => handleProjectDescriptionChange(text)}
                />
              </View>
              {/* select customers */}
              <View style={{ paddingTop: 40, marginLeft: 45, marginRight: 50 }}>
                <View style={{
                  backgroundColor: COLORS.secondary,
                  borderRadius: 20,
                  borderLeftWidth: 10,
                  borderEndWidth: 10,
                  borderTopColor: COLORS.secondary,
                  borderBottomColor: COLORS.secondary,
                  borderEndColor: COLORS.secondary,
                  borderLeftColor: COLORS.secondary,
                  marginLeft: 10,
                  marginRight: 10
                }}>
                  <AnimatedInvoice
                    borderRadius={10}
                    barStyle={{ backgroundColor: 'white' }}
                    triangleStyle={{ backgroundColor: 'white' }}
                    barComponent={<View>
                      < Text style={{ marginLeft: 15, ...FONTS.body4Light }} >CUSTOMERS</Text>
                    </View>
                    }>
                    <View style={{ marginLeft: 20, marginRight: '20%', paddingTop: 5 }}>
                      <Isao
                        label={'NAME'}
                        activeColor={COLORS.secondary}
                        labelStyle={{ ...FONTS.h3 }}
                        borderHeight={3}
                        inputPadding={0}
                        labelHeight={24}
                        placeholder="Add customer"
                        placeholderTextColor={COLORS.gray}
                        inputStyle={{ color: COLORS.secondary, ...FONTS.body3SemiBold, fontSize: SIZES.h3 }}
                        passiveColor={COLORS.primary}
                        value={customerName}
                        onChangeText={(text) => {
                          setCustomerName(text);
                          setCustomerNameError('');
                        }}
                      />
                      {customerNameError !== '' && <Text style={styles.errorText}>{customerNameError}</Text>}
                    </View>
                    <View style={{ marginLeft: '82%', paddingTop: '10%', position: 'absolute' }}>
                      <TouchableOpacity onPress={handleAddCustomer}>
                        <Ionicons name="add-circle-outline" size={30} color={COLORS.primary} />
                      </TouchableOpacity>
                    </View>

                    {/* customer name list */}
                    <View style={{ marginLeft: 20, marginRight: 60, paddingTop: 20 }}>
                      {customerList.length > 0 ? (
                        customerList.map((customer, index) => (
                          (index % 3 === 0) && (
                            <View key={index} style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                              {customerList.slice(index, index + 3).map((customer, subIndex) => (
                                <View key={subIndex} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, marginBottom: 10 }}>
                                  <Text>{customer}</Text>
                                  <TouchableOpacity onPress={() => handleDeleteCustomer(index, subIndex)}>
                                    <Ionicons name="trash" size={20} color={COLORS.gray} />
                                  </TouchableOpacity>
                                </View>
                              ))}
                            </View>
                          )
                        ))
                      ) : (
                        <Text> </Text>  //for customer list to be empty
                      )}
                    </View>
                  </AnimatedInvoice>
                </View>
              </View>
              {/* save button */}
              <View style={{ paddingTop: 50, marginLeft: 120, paddingHorizontal: 40, marginRight: 20 }}>
                <Button mode="outlined"
                  style={{ borderColor: COLORS.primary }}
                  textColor={COLORS.primary}
                  onPress={handleProjectFormClose}>
                  <Text style={{ ...FONTS.body4 }}>SAVE</Text>

                </Button>
              </View>
            </View>
          ) : (
            <View style={{ flex: 1, backgroundColor: "transparent" }}>
              <LottieCheckAnimation />
              <View style={{
                flexDirection: 'row',
                marginLeft: '20%',
                paddingTop: '10%',
                marginTop: '5%',
                marginRight: '10%',
                paddingBottom: 20,
                borderColor: COLORS.primary,
                //borderWidth:2,
                borderRadius: 30,
                alignItems: 'center',
              }}>
                {handleProjectConfirm()}
              </View>
            </View>
          )}
        </ScrollView>
      </SwipeDownModal>
    )
  }



  return (
    <PaperProvider>
      <View style={{ flex: 1, backgroundColor: COLORS.lightGray }}>
        {/* NavBarHeader */}
        {renderNavBar()}
        {/* Form */}
        {renderItemForm()}
        {renderProjectForm()}


      </View>
    </PaperProvider>
  )
}

const styles = StyleSheet.create({
  navBar: {
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

  shadow: {
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },

  //confirmation form
  confirmButtonStyle: {
    backgroundColor: COLORS.secondary,
  },
  popupText: {
    color: COLORS.primary,
    ...FONTS.body3Light,
    textAlign: 'justify',
    padding: 20,
    lineHeight: 24,
  },
  boldText: {
    ...FONTS.h3,
  },
  errorText: { color: COLORS.darkRed, ...FONTS.body5SemiBold },


});

export default RecordFormPage;