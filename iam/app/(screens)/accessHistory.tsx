import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView,ImageBackground,Image, ActivityIndicator } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const AccessHistory = () => {

    
    const [data, setData] = useState([]); // State to store access logs
    const [loading, setLoading] = useState(true); // State to manage loading state
    

    useEffect(() => {
      // Fetch access logs when the page is opened
      const fetchAccessLogs = async () => {
        try {
          const email = await AsyncStorage.getItem('userEmail');
          console.log('Fetched email:', email);
          const response = await fetch('https://fabulous-iguana-513.convex.cloud/api/query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              path: 'queryData:getUserByEmail', // Convex query to fetch access logs
              args: { email }, // Replace 'currentUserId' with the actual user ID
            }),
          });

          const result = await response.json();
          const userId = result.value.cmsId;

          const logsResponse = await fetch('https://fabulous-iguana-513.convex.cloud/api/query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              path: 'queryData:getUserByUserId', // Convex query to fetch access logs
              args: { userId }, 
            }),
          });
          const logResult =   await logsResponse.json();
          console.log('Access logs:', logResult);
          console.log("value",logResult.value)
          if (logResult.status === 'success') {
            setData(logResult.value); // Set the fetched data to state
           
          } else {
            console.error('Failed to fetch access logs:', logResult.errorMessage);
          }
        } catch (error) {
          console.error('Error fetching access logs:', error);
        } finally {
          setLoading(false); // Stop the loading spinner
        }
      };

    fetchAccessLogs();
  }, []);

  return (
    <ImageBackground
          source={require('../../assets/images/home-bg.jpg')}
          style={styles.background}
          resizeMode="cover"
    >
    <View style={styles.container}>
      {/* Logo at the top right */}
      <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/nust-logo.png')}
            style={styles.logo}
          />
        <Text style={styles.title}>NUSTAC</Text>
      </View>
      
      {/* Access History heading */}
      <Text style={styles.heading}>Access History</Text>
      
      {/* Show loading spinner while fetching data */}
        {loading ? (
          <ActivityIndicator size="large" color="#80D8FF" />
        ) : (
          <ScrollView style={styles.tableContainer}>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableHeader}>Date</Text>
                <Text style={styles.tableHeader}>Time</Text>
                <Text style={styles.tableHeader}>Access</Text>
                <Text style={styles.tableHeader}>Facility</Text>
              </View>

              {data.length > 0 ? (
                data.map((item, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableData}>{new Date(item.timestamp).toLocaleDateString()}</Text>
                    <Text style={styles.tableData}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
                    <Text
                      style={[
                        styles.tableData,
                        { color: item.accessStatus === 'allowed' ? 'green' : 'red' },
                      ]}
                    >
                      {item.accessStatus === 'allowed' ? 'Granted' : 'Denied'}
                    </Text>
                    <Text style={styles.tableData}>{item.roomName}</Text>
                  </View>
                ))
                    ) : (
                      <Text style={styles.noDataText}>No access logs available.</Text>
                    )}
                  </View>
                </ScrollView>
              )}
          </View>
          </ImageBackground>
        );
      };

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "space-between",
  },
  container: {
    flex: 1,
    padding: 20,
    marginTop: 20,
  
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  heading: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#80D8FF',
  },
  tableContainer: {
    flex: 1,
    marginTop: 10,
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    borderRadius: 5,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding: 10,
    justifyContent: 'space-around',
  },
  tableHeader: {
    fontWeight: 'bold',
    width: '25%',
    textAlign: 'center',
  },
  tableData: {
    width: '25%',
    textAlign: 'center',
  },
  noDataText: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#888',
  },
});

export default AccessHistory;


// you have to add below things above
