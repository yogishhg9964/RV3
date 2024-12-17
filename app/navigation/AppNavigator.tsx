import { createStackNavigator } from '@react-navigation/stack';
import { VisitorLog } from '../screens/VisitorLog';
import { VisitorDetails } from '../screens/VisitorDetails';
import { VisitorRegistration } from '../screens/visitor-registration';
import { VisitorAdditionalDetails } from '../screens/visitor-additional-details';
import { VisitorSuccess } from '../screens/visitor-success';
import { RootStackParamList } from '../types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="VisitorLog">
      <Stack.Screen 
        name="VisitorLog" 
        component={VisitorLog} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="VisitorDetails" 
        component={VisitorDetails}
        options={{ 
          headerShown: true,
          headerTitle: "Visitor Details",
          headerTintColor: '#6B46C1',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          }
        }}
      />
      <Stack.Screen 
        name="VisitorRegistration" 
        component={VisitorRegistration}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="VisitorAdditionalDetails" 
        component={VisitorAdditionalDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="VisitorSuccess" 
        component={VisitorSuccess}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
} 