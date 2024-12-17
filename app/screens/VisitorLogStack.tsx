import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { VisitorLogStackParamList } from '../types/navigation';
import VisitorLog from './VisitorLog';
import { VisitorDetails } from './VisitorDetails';

const Stack = createStackNavigator<VisitorLogStackParamList>();

export function VisitorLogStack() {
  return (
    <Stack.Navigator
      initialRouteName="VisitorLog"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#fff' },
      }}
    >
      <Stack.Screen 
        name="VisitorLog" 
        component={VisitorLog}
      />
      <Stack.Screen 
        name="VisitorDetails" 
        component={VisitorDetails}
        options={{
          presentation: 'card',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      />
    </Stack.Navigator>
  );
} 