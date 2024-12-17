import React from "react";
import { StyleSheet, Platform, Dimensions, Image, View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import index from './screens/index';
import VisitorEntry from "./screens/VisitorEntry";
import VisitorLog from "./screens/VisitorLog";
import plus from "./screens/plus";
import { Colors } from "@/constants/Colors";
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

export default function Tabs() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  
  return (
    <Tab.Navigator 
      screenOptions={{
        tabBarShowLabel: true,
        headerShown: true,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          height: 70,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          paddingTop: 10,
          ...styles.tabBarShadow,
        },
        headerLeft: () => (
          <TouchableOpacity 
            onPress={() => navigation.toggleDrawer()}
            style={{ marginLeft: 16 }}
          >
            <Ionicons name="menu" size={24} color={Colors.PRIMARY} />
          </TouchableOpacity>
        ),
        headerTitle: () => (
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>RVCE Visitor Management</Text>
          </View>
        ),
        headerRight: () => (
          <Image 
            source={require('@/assets/images/icon.png')}
            style={styles.headerLogo}
          />
        ),
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        },
      }}>
      <Tab.Screen 
        name="Home" 
        component={index} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
          tabBarActiveTintColor: Colors.PRIMARY,
          tabBarInactiveTintColor: '#999999',
          tabBarLabel: 'Home'
        }}
      />
      <Tab.Screen 
        name="Visitor Entry" 
        component={VisitorEntry} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-add" size={24} color={color} />
          ),
          tabBarActiveTintColor: Colors.PRIMARY,
          tabBarInactiveTintColor: '#999999',
          tabBarLabel: 'Visitor Entry'
        }}
      />
      <Tab.Screen 
        name="Visitor Log" 
        component={VisitorLog} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="clipboard" size={24} color={color} />
          ),
          tabBarActiveTintColor: Colors.PRIMARY,
          tabBarInactiveTintColor: '#999999',
          tabBarLabel: 'Visitor Log'
        }}
      />
      <Tab.Screen 
        name="More" 
        component={plus} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={24} color={color} />
          ),
          tabBarActiveTintColor: Colors.PRIMARY,
          tabBarInactiveTintColor: '#999999',
          tabBarLabel: 'More'
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  headerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: Colors.PRIMARY,
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerLogo: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginRight: 16,
  },
});