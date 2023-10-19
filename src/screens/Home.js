import React from "react";
import { useRef } from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, FlatList, ScrollView, ImageBackground,StatusBar} from "react-native";
import { FAB, Portal, PaperProvider, Button, Snackbar, shadow } from 'react-native-paper';
import { COLORS, FONTS, SIZES, icons } from '../constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import { createNativeWrapper } from "react-native-gesture-handler";

import Icon from 'react-native-vector-icons/Ionicons';
import { Ionicons } from '@expo/vector-icons';
import { SwipeDownModal } from 'react-native-swipe-down-modal'
import { Isao } from 'react-native-textinput-effects';
import DateTimePicker from '@react-native-community/datetimepicker';
import AnimatedInvoice from 'react-native-collapsible-invoice';
import LottieView from 'lottie-react-native';
import animationData from '../assets/animations/check_animation.json';
import { set } from "react-native-reanimated";
import { ExpandableCalendar, CalendarProvider } from 'react-native-calendars';
import axios from 'axios';

const Home = () => {
    //nav to new records page
    const navigation = useNavigation();
    const handleCreateRecordPress = () => {
        navigation.navigate('RecordForm');
    };

    //snack bar 
    const route = useRoute();
    const [sbVisible, setSBVisible] = useState(false);

    useEffect(() => {
        setSBVisible(route.params?.sbVisible || false);
    }, [route.params]);
    const onDismissSnackBar = () => setSBVisible(false);




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


    const [itemNameInput, handleItemNameChange, itemNameError, setItemNameError] = useTextInput('', validateNotEmpty);
    const [itemPriceInput, handleItemPriceChange, itemPriceError, setItemPriceError] = useTextInput('', validateNumber);
    const [itemQuantityInput, handleItemQuantityChange, itemQuantityError, setItemAmountError] = useTextInput('', validateNumber);
    const [itemInfoInput, handleItemlInfoChange] = useTextInput('');
    const [projectNameInput, handleProjectNameChange, projectNameError, setProjectNameError] = useTextInput('', validateNotEmpty);
    const [projectDescriptionInput, handleProjectDescriptionChange] = useTextInput('');
    const [dateString, handleDateChange, dateStringError, setDateStringError] = useTextInput('', validateDate);

    const moment = require('moment');

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
            }, 1000);  // seconds
            return () => clearTimeout(timer);
        }
    }, [showItemSuccess]);

    const handleUploadItem = () => {
        const data = JSON.stringify({
            "collection": "items",
            "database": "test",
            "dataSource": "Cluster0",
            "document":{
              "name": itemNameInput,
              "price": itemPriceInput,
              "quantity": itemQuantityInput,
              "info": itemInfoInput
            }
          });
      
          var config = {
            method: 'post',
            url: 'https://eu-central-1.aws.data.mongodb-api.com/app/data-hzrch/endpoint/data/v1/action/insertOne',
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Request-Headers': '*',
              'api-key': DATA_API_KEY,
            },
            data: data
        };
      
          axios(config)
            .then(function (response) {
              console.log(JSON.stringify(response.data));
          })
          .catch(function (error) {
              console.log(error);
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
            }, 1000);  // seconds
            return () => clearTimeout(timer);
        }
    }, [showProjectSuccess]);

    const handleUploadProject = () => {
        const formattedStartDate = moment(dateString, 'DD/MM/YYYY').format('YYYY-MM-DD');

        const data = JSON.stringify({
          "collection": "projects",
          "database": "test",
          "dataSource": "Cluster0",
          "document":{
            "name": projectNameInput,
            "startDate": formattedStartDate,
            "description": projectDescriptionInput,
            "customerName": customerList.join(", ")
          }
        });
    
        var config = {
          method: 'post',
          url: 'https://eu-central-1.aws.data.mongodb-api.com/app/data-hzrch/endpoint/data/v1/action/insertOne',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Request-Headers': '*',
            'api-key': DATA_API_KEY,
          },
          data: data
      };
    
    
        // axios.post('http://10.0.2.2:3000/api/projects/create', data)
        // axios.post('https://eu-central-1.aws.data.mongodb-api.com/app/data-hzrch/endpoint/data/v1/action/findOne', data,
        // )
        axios(config)
          .then(function (response) {
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
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
        setCustomerName(''); // Clear the customer name input by setting it to an empty string
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
            <View style={{ width: 300, height: 300, flex: 1, marginLeft: '0%', marginTop: '5%' ,alignSelf:'center'}}>
                <LottieView
                    source={animationData}
                    autoPlay
                    loop={false}
                    speed={0.2}
                    style={{ 
                        width: '100%', 
                        height: '100%',
                        flex:1
                    }}
                    resizeMode="cover"
                    // colorFilters={[
                    //     {
                    //       keypath: "Circle Fill.Ellipse Path 1",
                    //       color: COLORS.secondary,
                    //     },
                    //     {
                    //       keypath: "Circle Stroke",
                    //       color: COLORS.secondary,
                    //     },
                    //     {
                    //       keypath: "Circle Fill.Ellipse Path 1",
                    //       color: COLORS.secondary,
                    //     },
                    // ]}
                />
            </View>
        );
    };








    //floating action button
    const [state, setState] = React.useState({ open: false });
    const onStateChange = ({ open }) => setState({ open });
    const { open } = state;


    function floatingAddButton() {

        // Get today's date in 'YYYY-MM-DD' format
        const today = new Date().toISOString().split('T')[0];
        const [selectedDate, setSelectedDate] = useState(today);

        // These will be replaced by our own data.
        const projects = [
            {
                id: 3,
                name: 'ProjectName',
                date: '2023-07-19',
                description: 'This is project 1.',
                participants: ['User4', 'User5'],
                hours: 12,
                minutes: 31,
                materials: [
                    { name: 'Screws', quantity: 50 },
                    { name: 'Bolts', quantity: 100 },
                ]
            },
            {
                id: 4,
                name: 'ProjectName',
                date: '2023-07-19',
                description: 'This is project 1.',
                participants: ['User5', 'User6'],
                hours: 12,
                minutes: 31,
                materials: [
                    { name: 'Screws', quantity: 50 },
                    { name: 'Bolts', quantity: 100 },
                ]
            },
            {
                id: 5,
                name: 'ProjectName',
                date: '2023-07-19',
                description: 'This is project 1.',
                participants: ['User5', 'User6'],
                hours: 12,
                minutes: 31,
                materials: [
                    { name: 'Screws', quantity: 50 },
                    { name: 'Bolts', quantity: 100 },
                ]
            },

        ];
        // Filter projects based on selected date
        const filteredProjects = selectedDate
            ? projects.filter(project => project.date === selectedDate)
            : [];

        // Create a markedDates object for ExpandableCalendar
        const markedDates = {
            [today]: { selected: true, marked: true, selectedColor: '#009999' }
        };
        projects.forEach(project => {
            if (!markedDates[project.date]) {
                markedDates[project.date] = { marked: true };
            }
        });

        const ProjectCard = ({ project }) => {
            return (
                <View style={styles.projectCard}>
                    <View style={styles.sideColor}>
                        {project.participants.map((participant, index) => (
                            <Text key={index} style={styles.participant}>{participant}</Text>
                        ))}
                    </View>
                    <View style={styles.cardContent}>
                        <View style={styles.titleAndTimeContainer}>
                            <Text style={styles.projectTitle}>{project.name}</Text>
                            <View style={styles.timeContainer}>
                                <Text style={styles.label}>Hours</Text>
                                <Text style={styles.projectTime}>{project.hours}h {project.minutes}m</Text>
                            </View>
                        </View>
                        <Text style={styles.projectDescription}>{project.description}</Text>
                        {project.materials.map((material, index) => (
                            <View key={index} style={styles.materialContainer}>
                                <Text style={styles.material}>{material.name}</Text>
                                <Text style={styles.quantity}>{material.quantity}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            );
        };

        const statusBarHeight = StatusBar.currentHeight || 0;

        return (
            <View style={{ flex: 1, backgroundColor: COLORS.lightGray, }}>
            <StatusBar translucent backgroundColor={COLORS.lightGreen} barStyle="light-content"/>
                {/* Part of ProjectCalendar */}
                <View style={styles.container}>
                <ImageBackground source={require("../assets/images/home-bg.png")} 
                 style={[styles.backgroundImage, { marginTop: +statusBarHeight*0.5}]}>
                         <Text style={styles.header}>My Records</Text>
                        <Text style={styles.subHeader}>Curate Every Record</Text>
                        <Text style={styles.subHeader}>Ever Recorded</Text>
                        <CalendarProvider date={today} onDateChanged={setSelectedDate}>
                            <View style={styles.calendarCard}>
                                <ExpandableCalendar markedDates={markedDates} />
                                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                                    {filteredProjects.length > 0 ? (
                                        filteredProjects.map((project) => (
                                            <View key={project.id} style={styles.projectCardContainer}>
                                                <ProjectCard project={project} />
                                            </View>
                                        ))
                                    ) : (
                                        <View style={styles.emptyProjectContainer}>
                                            <View style={{ alignItems: 'center', 
                                                            marginTop:'-15%'}}>
                                                        <Image
                                                        source={require('../assets/icons/empty_record.png')} 
                                                        style={{ width: 100, height: 100, tintColor: COLORS.gray,
                                                            marginBottom:'5%'
                                                        }} 
                                                    />
                                                <Text style={{...FONTS.h4,
                                                color:COLORS.gray}}>No record</Text>
                                                <Text style={{...FONTS.h4,
                                                color:COLORS.gray}}>Press + to Add</Text>
                                            </View>
                                        </View>

                                    )}

                                </ScrollView>
                            </View>
                        </CalendarProvider>
                    </ImageBackground>
                </View>

                <FAB.Group
                    open={open}
                    visible
                    icon={open ? 'file-document-edit-outline' : 'plus'}
                    label={open ? 'New Reocrd' : ''}
                    color={COLORS.white}
                    fabStyle={{ backgroundColor: COLORS.secondary, borderRadius: 30, marginBottom: '15%', marginRight: '10%' }}
                    actions={[
                        // { icon: 'plus', 
                        // onPress:handleCreateRecordPress,
                        // color: COLORS.secondary,
                        //   style: {backgroundColor: COLORS.white, borderRadius:30},
                        //   },
                        {
                            icon: 'archive-edit-outline',
                            color: COLORS.secondary,
                            style: { backgroundColor: COLORS.white, borderRadius: 30 },
                            label: 'New Item',
                            size: 'medium',
                            labelStyle: { color: COLORS.primary, ...FONTS.body3Medium },
                            onPress: handleItemFormPress,
                        },
                        {
                            icon: 'folder-plus-outline',
                            label: 'New Project',
                            size: 'medium',
                            color: COLORS.secondary,
                            style: { backgroundColor: COLORS.white, borderRadius: 30 },
                            labelStyle: { color: COLORS.primary, ...FONTS.body3Medium },
                            onPress: handleProjectFormPress,
                        },
                    ]}
                    onStateChange={onStateChange}
                    onPress={() => {
                        if (open) {
                            handleCreateRecordPress();
                        }
                    }}
                />


                {/* new item form show  */}
                {newItemForm()}
                {/* new project form show  */}
                {newProjectForm()}
                {showSnackBar()}


            </View>
        );
    }

    function newItemForm() {
        return (
            <SwipeDownModal
                visible={isItemFormVisible}
                onClose={()=>setItemFormVisible(false)}
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
    // module.exports = newItemForm;

    function newProjectForm() {
        return (
            <SwipeDownModal
                visible={isProjectFormVisible}
                onClose={()=>setProjectFormVisible(false)}
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
                                    // backgroundColor: COLORS.secondary,
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

    function showSnackBar() {
        return (
            <Snackbar
                visible={sbVisible}
                onDismiss={onDismissSnackBar}
                style={{ backgroundColor: COLORS.primary }}
                duration={2000}
                action={{
                    label: 'OK',
                    labelStyle: { color: COLORS.white, ...FONTS.body5SemiBold },
                    onPress: () => {
                        onDismissSnackBar();
                    },
                }}>
                <Text style={{ color: COLORS.white, ...FONTS.body5 }}>Success! Record added.</Text>
            </Snackbar>
        )
    }


    return (
        <View style={{ flex: 1, backgroundColor: COLORS.lightGray, }}>

            <PaperProvider>
                <Portal>
                    {/* floating button */}
                    {floatingAddButton()}
                </Portal>
            </PaperProvider>
        </View>
    )
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
    },

    //floating button
    actionButtonShadow: {
        elevation: 5, // Android
        shadowColor: COLORS.secondary, // iOS
        shadowOpacity: 0.5, // iOS
        shadowOffset: { width: 2, height: 2 }, // iOS
        shadowRadius: 3, // iOS

    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: COLORS.secondary,
    },
    actionButtonTextContainerShadow: {
        elevation: 5, // Android
        shadowColor: COLORS.secondary, // iOS
        shadowOpacity: 0.5, // iOS
        shadowOffset: { width: 2, height: 2 }, // iOS
        shadowRadius: 3, // iOS,
        borderRadius: 40,
        height: 30,
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
        ...FONTS.h2SemiBold,
    },

    errorText: { color: COLORS.darkRed, ...FONTS.body5SemiBold },

    subHeader: {
        ...FONTS.body4,
        marginLeft: '11%',
        color: COLORS.lightGreen,
    },
    imageBackground: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 50,
        marginLeft: '10 %',
        color: COLORS.lightBlack,
    },
    calendarCard: {
        flex: 1,
        marginTop: 25,
        backgroundColor: COLORS.lightGray,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    projectCard: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 30,
        marginBottom: 10,
        marginTop: 20,
        width: '90%',
        minHeight: 150,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        alignSelf: 'center'

    },
    sideColor: {
        width: '30%',
        backgroundColor: '#B4D5DB',
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    participant: {
        fontSize: 14,
    },
    cardContent: {
        width: '75%',
        padding: 10,
        justifyContent: 'flex-start',
    },
    projectTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    projectDescription: {
        fontSize: 14,
        marginBottom: 10,
    },
    titleAndTimeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90%',
        paddingRight: 10,
    },
    timeContainer: {
        alignItems: 'center',
    },
    projectTime: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    materialContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90%',
        paddingRight: 10,
    },
    material: {
        fontSize: 16,
    },
    quantity: {
        fontSize: 16,
        color: 'turquoise',
        fontWeight: 'bold'
    },
    label: {
        fontSize: 16,
        color: 'turquoise',
        fontWeight: 'bold'
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },

    emptyProjectContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 150,
    },
    emptyProjectText: {
        fontSize: 16,
        color: '#C0C0C0',
    },
    backgroundImage: {
		flex: 1,
		height: "110%",
        width: "100%",
        // resizeMode:'contain',
	},
});


export default Home;