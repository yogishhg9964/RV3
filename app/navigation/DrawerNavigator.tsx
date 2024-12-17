import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';
import Tabs from '../Tabs';
import Profile from '../screens/Profile';
import Settings from '../screens/Settings';
import AboutUs from '../screens/AboutUs';
import SignOut from '../screens/signout';
import EmergencyContact from '../screens/EmergencyContact';
import { Colors } from '@/constants/Colors';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: Colors.PRIMARY,
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#333',
        drawerStyle: {
          backgroundColor: '#fff',
          width: 280,
        },
        drawerItemStyle: {
          borderRadius: 8,
          paddingVertical: 2,
          marginVertical: 4,
          marginHorizontal: 8,
        },
        drawerLabelStyle: {
          fontSize: 15,
          marginLeft: -10,
        },
      }}>
      <Drawer.Screen
        name="HomeDrawer"
        component={Tabs}
        options={{
          drawerLabel: 'Home',
          drawerIcon: ({ color }) => (
            <View style={[styles.iconContainer, { backgroundColor: color === '#fff' ? Colors.PRIMARY : '#F3F0FF' }]}>
              <Ionicons name="home-outline" size={22} color={color === '#fff' ? '#fff' : Colors.PRIMARY} />
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          drawerIcon: ({ color }) => (
            <View style={[styles.iconContainer, { backgroundColor: color === '#fff' ? Colors.PRIMARY : '#F3F0FF' }]}>
              <Ionicons name="person-outline" size={22} color={color === '#fff' ? '#fff' : Colors.PRIMARY} />
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="EmergencyContact"
        component={EmergencyContact}
        options={{
          drawerLabel: 'Emergency Contact',
          drawerIcon: ({ color }) => (
            <View style={[styles.iconContainer, { backgroundColor: color === '#fff' ? Colors.PRIMARY : '#F3F0FF' }]}>
              <Ionicons name="call-outline" size={22} color={color === '#fff' ? '#fff' : Colors.PRIMARY} />
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="AboutUs"
        component={AboutUs}
        options={{
          drawerLabel: 'About Us',
          drawerIcon: ({ color }) => (
            <View style={[styles.iconContainer, { backgroundColor: color === '#fff' ? Colors.PRIMARY : '#F3F0FF' }]}>
              <Ionicons name="information-circle-outline" size={22} color={color === '#fff' ? '#fff' : Colors.PRIMARY} />
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={{
          drawerIcon: ({ color }) => (
            <View style={[styles.iconContainer, { backgroundColor: color === '#fff' ? Colors.PRIMARY : '#F3F0FF' }]}>
              <Ionicons name="settings-outline" size={22} color={color === '#fff' ? '#fff' : Colors.PRIMARY} />
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="SignOut"
        component={SignOut}
        options={{
          drawerLabel: 'Sign Out',
          drawerIcon: ({ color }) => (
            <View style={[styles.iconContainer, { backgroundColor: color === '#fff' ? Colors.PRIMARY : '#F3F0FF' }]}>
              <Ionicons name="log-out-outline" size={22} color={color === '#fff' ? '#fff' : Colors.PRIMARY} />
            </View>
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
}); 