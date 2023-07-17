import React from 'react';
import { View, Text, ImageBackground, TextInput, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/FontAwesome';

const projects = [
  { name: 'Project A', time: '5 hours', chartData: [20, 45, 28, 80, 99, 43] },
  { name: 'Project B', time: '7 hours', chartData: [10, 30, 50, 70, 90, 110] },
  { name: 'Project C', time: '3 hours', chartData: [50, 60, 70, 80, 90, 100] },
];

const ReportTimeScreen = () => {
  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../../assets/images/home-bg.png')} style={styles.backgroundImage}>
        <Text style={styles.title}>Time Tab</Text>

        <View style={styles.searchContainer}>
          <Icon name="search" style={styles.searchIcon} />
          <TextInput style={styles.searchInput} placeholder="Search Project" />
        </View>

        {projects.map((project, index) => (
          <View key={index} style={styles.projectContainer}>
            <Text style={styles.projectName}>{project.name}</Text>
            <Text style={styles.projectTime}>{project.time}</Text>

            <BarChart
              data={{
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{ data: project.chartData }],
              }}
              width={300}
              height={200}
              yAxisLabel=""
              chartConfig={chartConfig}
              verticalLabelRotation={0}
              style={styles.chart}
            />
          </View>
        ))}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ffffff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  projectContainer: {
    marginBottom: 20,
  },
  projectName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ffffff',
  },
  projectTime: {
    fontSize: 14,
    marginBottom: 10,
    color: '#ffffff',
  },
  chart: {
    marginTop: 10,
  },
});

export default ReportTimeScreen;
