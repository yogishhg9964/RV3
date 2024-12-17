import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Root Stack Types
export type RootStackParamList = {
  VisitorLogStack: undefined;
  VisitorEntry: undefined;
  QuickCheckIn: undefined;
  QuickCheckInForm: {
    existingVisitor: any;
  };
  VisitorSuccess: {
    formData: any;
    visitorId: string;
  };
  CabSuccess: {
    formData: any;
  };
  // ... other screens
};

// Visitor Log Stack Types
export type VisitorLogStackParamList = {
  VisitorLog: undefined;
  VisitorDetails: {
    visitorId: string;
  };
};

export type VisitorLogRouteProp = RouteProp<VisitorLogStackParamList, 'VisitorLog'>;
export type VisitorDetailsRouteProp = RouteProp<VisitorLogStackParamList, 'VisitorDetails'>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 