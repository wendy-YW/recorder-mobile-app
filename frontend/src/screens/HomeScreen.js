import React, { useState, useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet, ImageBackground } from 'react-native';
import { ExpandableCalendar, CalendarProvider } from 'react-native-calendars';


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

// Get today's date in 'YYYY-MM-DD' format
const today = new Date().toISOString().split('T')[0];

const ProjectCalendar = () => {
    const [selectedDate, setSelectedDate] = useState(today);


    const projects = [
        {
            id: 1,
            name: 'ProjectName',
            date: '2023-07-03',
            description: 'First line\nSecond line',
            participants: ['User1', 'User2'],
            hours: 12,
            minutes: 31,
            materials: [
                { name: 'Screws', quantity: 50 },
                { name: 'Bolts', quantity: 100 },
            ]
        },
        {
            id: 2,
            name: 'ProjectName',
            date: '2023-07-04',
            description: 'This is project 1.',
            participants: ['User3', 'User4'],
            hours: 12,
            minutes: 31,
            materials: [
                { name: 'Screws', quantity: 50 },
                { name: 'Bolts', quantity: 100 },
            ]
        },
        {
            id: 3,
            name: 'ProjectName',
            date: '2023-07-06',
            description: 'This is project 1.',
            participants: ['User4', 'User5'],
            hours: 12,
            minutes: 31,
            materials: [
                { name: 'Screws', quantity: 9 },
                { name: 'Bolts', quantity: 10 },
                { name: 'Bolts', quantity: 12 },
            ]
        },
        {
            id: 4,
            name: 'ProjectName',
            date: '2023-07-06',
            description: 'This is project 2.',
            participants: ['User5', 'User6'],
            hours: 12,
            minutes: 31,
            materials: [
                { name: 'Screws', quantity: 9 },
                { name: 'Bolts', quantity: 10 },
                { name: 'Bolts', quantity: 12 },
            ]
        },

    ];

    // Filter projects based on selected date
    const filteredProjects = useMemo(() => selectedDate
        ? projects.filter((project) => project.date === selectedDate)
        : []
        , [selectedDate]);


    // Create a markedDates object for ExpandableCalendar
    const markedDates = useMemo(() => {
        const dates = {
            [today]: { selected: true, marked: true, selectedColor: '#009999' }
        };

        projects.forEach(project => {
            if (!dates[project.date]) {
                dates[project.date] = { marked: true };
            }
        });

        return dates;
    }, [projects]);

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../../assets/images/home-bg.png')} style={styles.backgroundImage}>
                <Text style={styles.header}>My Records</Text>
                <Text style={styles.subHeader}>Curate Every Record</Text>
                <Text style={styles.subHeader}>Ever Recorded</Text>
                <CalendarProvider date={today} onDateChanged={setSelectedDate}>
                    <View style={styles.calendarCard}>
                        <ExpandableCalendar markedDates={markedDates} />
                        <ScrollView contentContainerStyle={styles.scrollViewContent}>
                            {filteredProjects.map((project) => (
                                <View key={project.id} style={styles.projectCardContainer}>
                                    <ProjectCard project={project} />
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </CalendarProvider>
            </ImageBackground>
        </View>
    );

};

const styles = StyleSheet.create({
    subHeader: {
        fontSize: 14,
        marginLeft: 50,
        color: 'white',
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
        marginLeft: 50,
    },
    calendarCard: {
        flex: 1,
        marginTop: 50,
        backgroundColor: '#f0f0f0',
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

});

export default ProjectCalendar;
