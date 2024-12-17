import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './Home';
import QuickCheckInScreen from './quick-check-in';
import CabEntry from './cab-entry';
import CabAdditionalDetails from './cab-additional-details';
import ApprovalStatus from './ApprovaStatus';
import TodaysVisitors from './TodaysVisitors';
import { Colors } from '@/constants/Colors';
import { TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import VisitorEntry from './VisitorEntry';
import Document from './document';
import VisitorLog from './VisitorLog';
import {VisitorDetails} from './VisitorDetails';
import CabSuccess from './cab-success';
import QuickCheckInForm from './quick-check-in-form';
import { VisitorSuccess } from './visitor-success';
import { EditProfile } from './EditProfile';
import { NotificationSettings } from './NotificationSettings';
import { PrivacySettings } from './PrivacySettings';
import { Support } from './Support';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerShadowVisible: false,
        headerTintColor: Colors.PRIMARY,
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="QuickCheckIn" 
        component={QuickCheckInScreen} 
        options={({ navigation }) => ({ 
          title: 'Quick Check-In',
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen 
        name="QuickCheckInForm" 
        component={QuickCheckInForm}
        options={{ 
          title: 'Quick Check-In',
          headerShown: false 
        }}
      />
      <Stack.Screen 
        name="CabEntry" 
        component={CabEntry} 
        options={({ navigation }) => ({ 
          title: 'Cab Entry',
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen 
        name="ApprovalStatus" 
        component={ApprovalStatus} 
        options={{ title: 'Approval Status' }}
      />
      <Stack.Screen 
        name="TodaysVisitors" 
        component={TodaysVisitors} 
        options={{ title: 'TodaysVisitors' }}
      />
      <Stack.Screen 
        name="VisitorEntry" 
        component={VisitorEntry} 
        options={{ title: 'VisitorEntry' }}
      />
      <Stack.Screen 
        name="Document" 
        component={Document} 
        options={{ title: 'Documents' }}
      />
      <Stack.Screen 
        name="VisitorLog" 
        component={VisitorLog}
        options={{ title: 'Visitor Log' }}
      />
      <Stack.Screen 
        name="VisitorDetails" 
        component={VisitorDetails}
        options={{ 
          headerShown: false 
        }}
      />
      <Stack.Screen 
        name="Register" 
        component={VisitorEntry} 
        options={{ title: 'Register' }}
      />
      <Stack.Screen 
        name="CabAdditionalDetails" 
        component={CabAdditionalDetails} 
        options={{ title: 'Additional Details' }}
      />
      <Stack.Screen 
        name="CabSuccess" 
        component={CabSuccess}
        options={{ 
          title: 'Entry Details',
          headerShown: false 
        }}
      />
      <Stack.Screen 
        name="VisitorSuccess" 
        component={VisitorSuccess}
        options={{ 
          title: 'Check-In Successful',
          headerShown: false 
        }}
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="NotificationSettings" 
        component={NotificationSettings}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="PrivacySettings" 
        component={PrivacySettings}
        options={{ headerShown: false }}
      />
      
      <Stack.Screen 
        name="Support" 
        component={Support}
        options={{ headerShown: false }}
      />
        
    </Stack.Navigator>
    

    
  );
};

export default AppNavigator;
