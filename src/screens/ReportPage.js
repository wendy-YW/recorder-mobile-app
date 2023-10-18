import React, { useState } from "react";
import { View, Text, ImageBackground, TextInput, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import DropDownPicker from "react-native-dropdown-picker";
import appTheme, { COLORS, FONTS } from "../constants/theme";
import { PieChart } from "react-native-chart-kit";
import { Dimensions,StatusBar} from "react-native";

const screenWidth = Dimensions.get("window").width;

const chartColors = [
    COLORS.secondary,
    COLORS.primary,
    COLORS.lightGreen,  
    COLORS.darkGray,
    COLORS.gray,
    COLORS.lightGray,
    COLORS.darkRed,
    COLORS.red,
	"#FF0000",
	"#00FF00",
	"#0000FF",
	"#FFA500",
	"#FF00FF",
	"#00FFFF",
	"#FF4500",
	"#8A2BE2",
	"#FF1493",
	"#00CED1",
	"#FFD700",
	"#32CD32",
	"#FF69B4",
	"#00FF7F",
	"#1E90FF",
	"#FF6347",
	"#7B68EE",
	"#FF8C00",
	"#20B2AA",
	"#FF7F50",
	"#9400D3",
	"#ADFF2F",
	"#FFC0CB",
	"#FF8C69",
	"#BA55D3",
	"#FFE4E1",
	"#FFC3A0",
	"#E6E6FA",
	"#FFDAB9",
	"#FFFFE0",
	"#B0E0E6",
	"#FFC1C1",
	"#DDA0DD",
	"#F0E68C",
	"#D2B48C",
	"#FF69B4",
	"#FF7F50",
	"#FFD700",
	"#FFC0CB",
	"#FF4500",
	"#32CD32",
	"#BA55D3",
	"#FFC3A0",
	"#ADFF2F",
	"#E6E6FA",
	"#FFDAB9",
	"#FF6347",
	"#FFA500",
	"#9400D3",
	"#7B68EE",
	"#00FF7F",
	"#1E90FF",
	"#FF1493",
	"#00CED1",
	"#8A2BE2",
	"#FF0000",
];

const projects = [
	{
		id: 1,
		name: "Project A",
		date: "2023-07-03",
		description: "Constructing a new residential building.",
		participants: ["User1", "User2"],
		hours: 20,
		minutes: 31,
		materials: [
			{
				name: "Screws",
				quantity: 45,
			},
			{
				name: "Bolts",
				quantity: 67,
			},
			{
				name: "Nails",
				quantity: 92,
			},
			{
				name: "Concrete",
				quantity: 12,
			},
			{
				name: "Wood",
				quantity: 76,
			},
			{
				name: "Bricks",
				quantity: 33,
			},
			{
				name: "Paint",
				quantity: 28,
			},
			{
				name: "Plumbing ",
				quantity: 61,
			},
			{
				name: "Electrical",
				quantity: 89,
			},
			{
				name: "Tiles",
				quantity: 54,
			},
		],
		rating: 8.5,
		customers: ["Customer1", "Customer2"],
	},
	{
		id: 2,
		name: "Project B",
		date: "2023-07-04",
		description: "Renovating an existing office space.",
		participants: ["User3", "User4"],
		hours: 12,
		minutes: 31,
		materials: [
			{ name: "Screws", quantity: 50 },
			{ name: "Bolts", quantity: 100 },
		],
		rating: 6.2,
		customers: ["Customer3", "Customer4"],
	},
	{
		id: 3,
		name: "Project C",
		date: "2023-07-06",
		description: "Building a new commercial complex.",
		participants: ["User4", "User5"],
		hours: 12,
		minutes: 31,
		materials: [
			{ name: "Screws", quantity: 9 },
			{ name: "Bolts", quantity: 10 },
			{ name: "Bolts", quantity: 12 },
		],
		rating: 9.8,
		customers: ["Customer5", "Customer6"],
	},
	{
		id: 4,
		name: "Project D",
		date: "2023-07-06",
		description: "Renovating a restaurant space.",
		participants: ["User5", "User6","User5", "User6"],
		hours: 22,
		minutes: 31,
		materials: [
			{ name: "Screws", quantity: 9 },
			{ name: "Bolts", quantity: 10 },
			{ name: "Bolts", quantity: 12 },
		],
		rating: 7.3,
		customers: ["Customer7", "Customer8"],
	},
];

const RatingComponent = ({ projectName, hours, minutes, MAXHOUR }) => {
	const minutesToDecimal = (minutes / 60).toFixed(1);
	const normalizedHours = parseFloat(hours) + parseFloat(minutesToDecimal);
	const percentage = (normalizedHours / MAXHOUR) * 100;
   

	return (
		<View style={{ marginVertical: "2%", alignItems: "flex-start" }}>
			<View style={{ flexDirection: "row", justifyContent: "space-between", width: `${percentage}%` }}>
				<Text style={{ color: COLORS.secondary, fontSize: 10, fontWeight: "bold" }}>{projectName}</Text>
				<Text>{normalizedHours}</Text>
			</View>

			<View
				style={{
					width: `${percentage}%`,
					height: 10,
					backgroundColor: COLORS.secondary,
				}}
			/>
		</View>
	);
};

const ReportTimeScreen = () => {
	const dropdownValue = projects.map((p) => ({
		label: p.name,
		value: p.id,
	}));

	let totalMinutes = 0;
	let totalHours = 0;
	let MAXHOUR = 0;

	projects.forEach((project) => {
		totalMinutes += project.minutes;
		totalHours += project.hours;

		if (totalMinutes >= 60) {
			const additionalHours = Math.floor(totalMinutes / 60);
			totalHours += additionalHours;
			totalMinutes = totalMinutes % 60;
		}
		const minutesToDecimal = (project.minutes / 60).toFixed(1);
		const normalizedHours = parseFloat(project.hours) + parseFloat(minutesToDecimal);
		if (normalizedHours > MAXHOUR) {
			MAXHOUR = normalizedHours;
		}
	});
	const [isDetail, setisDetail] = useState(false);
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState(null);
	const [items, setItems] = useState(dropdownValue);

	const selectedProject = value == null ? projects[0] : projects[value - 1];
	const sortedMat = selectedProject?.materials?.sort((a, b) => b.quantity - a.quantity);
	const chartData = sortedMat.map((material, index) => ({
		name: material.name,
		quantity: material.quantity,
		color: chartColors[index], // You can use a function to generate random colors
		legendFontColor: "#000",
		legendFontSize: 12,
	}));

    const statusBarHeight = StatusBar.currentHeight || 0;
	// chartData.sort((a, b) => b.quantity - a.quantity);
	// console.log(chartData);
	// console.log(value);
	// console.log(selectedProject);
	// console.log("M", MAXHOUR);
	return (
		<View style={styles.container}>
            <StatusBar translucent backgroundColor={COLORS.lightGreen} barStyle="light-content"/>
			<ImageBackground source={require("../assets/images/home-bg.png")} 
             style={[styles.backgroundImage, { marginTop:+statusBarHeight*0.5}]}>
                <View style={styles.hearderContainer}>
					<Text style={styles.header}>Overview Analysis</Text>
				</View>
				<View style={styles.calendarCard}>
					<View
						style={{
							height: "25%",
							paddingLeft: "10%",
							paddingTop: "5%",
							flexDirection: "column",
							zIndex: 1,
						}}
					>
						<View	
							style={{
								zIndex: 999,
							}}
							>
						<DropDownPicker
							placeholder="Select Project"
							open={open}
							value={value}
							items={items}
							setOpen={setOpen}
							setValue={setValue}
							setItems={setItems}
                            placeholderStyle={{
                                ...FONTS.h2,
                                color: COLORS.gray,
                            }}
							labelStyle={{
                                ...FONTS.h2,
								// fontWeight: "bold",
                                color: COLORS.primary,
								zIndex: 9999,
							}}
							dropDownContainerStyle={{
								backgroundColor: COLORS.lightGray,
								borderWidth: 0,
								width: "70%",
								fontSize: 20,
								zIndex: 9999,
							}}
							style={{
								width: "70%",
								marginTop: "2%",
								marginBottom: "2%",
								borderLeftWidth: 0,
								borderTopWidth: 0,
								borderRightWidth: 0,
								backgroundColor:COLORS.lightGray,
								borderTopLeftRadius: 0,
								borderTopRightRadius: 0,
							}}
						/>
						</View>
					{isDetail && <Text 
									style={styles.description}>
										{selectedProject.description}</Text>}
					</View>
					<View style={styles.DetailCard}>
						<View style={{ flexDirection: "row", height: "20%", alignItems: "center", justifyContent: "space-between", paddingHorizontal: "10%" }}>
							<View>
								{!isDetail ? (
									<Text style={{ color: COLORS.secondary, fontWeight: "bold" }}>
										{projects.length}{' '}
										{projects.length > 1 ? (
											<Text style={{ color: COLORS.primary, fontWeight: "bold" }}>Projects</Text>
										) : (
											<Text style={{ color: COLORS.primary, fontWeight: "bold" }}>Project</Text>
										)}
									</Text>
								) : (
									<Text style={{ color: COLORS.secondary, fontWeight: "bold" }}>{selectedProject.date}</Text>
								)}
								{!isDetail ? (
									<Text style={{ color: COLORS.secondary, fontWeight: "bold" }}>
										{totalHours} <Text style={{ color: COLORS.primary, fontWeight: "bold" }}>h </Text>
										{totalMinutes} <Text style={{ color: COLORS.primary, fontWeight: "bold" }}>m</Text>
									</Text>
								) : (
									<Text style={{ color: COLORS.secondary, fontWeight: "bold" }}>
										{selectedProject.hours} <Text style={{ color: COLORS.primary, fontWeight: "bold" }}>h </Text>
										{selectedProject.minutes} <Text style={{ color: COLORS.primary, fontWeight: "bold" }}>m</Text>
									</Text>
								)}
							</View>
							<View style={{ flexDirection: "row", justifyContent: "space-between" }} onCl>
								<TouchableOpacity style={{ borderRadius: 100, overflow: "hidden" }} onPress={() => setisDetail(true)}>
									<Icon name="wrench" size={25} color={isDetail ? "white" : COLORS.gray} style={{ 
                                        marginHorizontal: "0%",
                                         backgroundColor: isDetail ? COLORS.secondary : "white", 
                                         alignItems:'center',
                                        justifyContent:'center',
                                         padding:10, 
                                        height:50,
                                        width:50,
                                        paddingLeft:13,
                                        borderRadius:25 }} />
								</TouchableOpacity>
								<TouchableOpacity style={{ borderRadius: 100, overflow: "hidden" }} onPress={() => setisDetail(false)}>
									<Icon
										name="clock-o"
										size={30}
										color={isDetail ? COLORS.gray : "white"}
										style={{ 
                                        marginHorizontal: "1%", 
                                        backgroundColor: isDetail ? "white" : COLORS.secondary, 
                                        padding:10, 
                                        paddingLeft:12,
                                        height:50,
                                        width:50,
                                        borderRadius:25 }}
									/>
								</TouchableOpacity>
							</View>
						</View>
						{!isDetail ? (
							<ScrollView contentContainerStyle={styles.scrollViewContent}>
								{projects
									.sort((a, b) => b.hours - a.hours)
									.map((p) => (
										<RatingComponent projectName={p.name} hours={p.hours} minutes={p.minutes} MAXHOUR={MAXHOUR} key={p.id} />
									))}
							</ScrollView>
						) : (
							<ScrollView contentContainerStyle={styles.scrollViewContent}>
								<PieChart
									data={chartData}
									width={screenWidth}
									height={200}
									chartConfig={{
										color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
										formatText: (value) => `${value}`,
										propsForLabels: {
											fontSize: 12,
											fontWeight: "bold",
										},
									}}
									accessor={"quantity"}
									backgroundColor={"transparent"}
									// paddingLeft={"15"}
									// center={[10, 50]}
									absolute
								/>
								<View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: "10%" }}>
									<View>
										<Text style={{ fontSize: 20, fontWeight: "bold", color: COLORS.secondary }}>Customers</Text>
										{selectedProject?.customers?.map((p) => (
											<Text>{p}</Text>
										))}
									</View>
									<View>
										<Text style={{ fontSize: 20, fontWeight: "bold", color: COLORS.secondary }}>Users</Text>
										{selectedProject?.participants?.map((p) => (
											<Text>{p}</Text>
										))}
									</View>
								</View>
							</ScrollView>
						)}
					</View>
				</View>
			</ImageBackground>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	backgroundImage: {
		flex: 1,
		height: "110%",
        width: "100%",
        // resizeMode:'contain',
		justifyContent: "center",
		alignItems: "center",
        
	},
	hearderContainer: {
		height: "25%",
		// backgroundColor: "yellow",
		width: "50%",
		justifyContent: "center",
		alignSelf: "flex-start",
		marginLeft: "10%",
	},
	header: {
		fontSize: 30,
		fontWeight: "bold",
		color: COLORS.primary,
	},
	calendarCard: {
		height: "75%",
		width: "100%",
		backgroundColor: COLORS.lightGray,
		borderTopLeftRadius: 35,
		borderTopRightRadius: 35,
	},
	description: {
		color: COLORS.primary,
        ...FONTS.body5,
        marginHorizontal:'1%',
	},
	DetailCard: {
		height: "75%",
		width: "100%",
		backgroundColor: "#ffffff",
		borderTopLeftRadius: 35,
		borderTopRightRadius: 35,
		overflow: "hidden",
	},
	scrollViewContent: {
		paddingHorizontal: "10%",
    	height: '120%',
    	width: '100%',
	},
});

export default ReportTimeScreen;