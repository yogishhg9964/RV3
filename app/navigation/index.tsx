import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { VisitorLogStack } from '../screens/VisitorLogStack';
import VisitorEntry from '../screens/VisitorEntry';

const RootStack = createStackNavigator<RootStackParamList>();

export function Navigation() {
  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <RootStack.Screen 
          name="VisitorLogStack" 
          component={VisitorLogStack}
        />
        <RootStack.Screen 
          name="VisitorEntry" 
          component={VisitorEntry}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
} 