export interface VisitorData {
  id: string;
  name: string;
  contactNumber: string;
  address: string;
  purposeOfVisit: string;
  vehicleNumber: string;
  checkInTime: string;
  checkOutTime: string | null;
  status: 'In' | 'Out' | 'pending';
  additionalDetails?: {
    whomToMeet: string;
    department: string;
    documentType: string;
    visitorCount: number;
    visitorPhotoUrl?: string;
    documentUrl?: string;
  };
}

export interface VisitorFormData {
  name: string;
  address: string;
  contactNumber: string;
  vehicleNumber: string;
  purposeOfVisit: string;
  typeOfVisit: string;
  email?: string;
  department: string;
  whomToMeet: string;
  visitorCount: number;
}

export interface AdditionalDetailsFormData {
  whomToMeet: string;
  department: string;
  documentType: string;
  documentUri: string;
  visitorPhotoUri: string;
  sendNotification: boolean;
  visitorCount: number;
  visitorPhotoUrl?: string;
  documentUrl?: string;
}

export interface DropdownOption {
  label: string;
  value: string;
}

export interface CabFormData extends VisitorFormData {
  cabProvider: string;
  driverName?: string;
  driverNumber?: string;
}

export interface CabAdditionalDetailsFormData extends AdditionalDetailsFormData {
  cabProvider: string;
  driverName: string;
  driverNumber: string;
}

export type RootStackParamList = {
  Home: undefined;
  QuickCheckIn: undefined;
  QuickCheckInForm: {
    existingVisitor: {
      id: string;
      name: string;
      contactNumber: string;
      address: string;
      vehicleNumber: string;
      purposeOfVisit: string;
      typeOfVisit: string;
      additionalDetails?: {
        whomToMeet: string;
        department: string;
        documentType: string;
        visitorCount: number;
        visitorPhotoUrl?: string;
        documentUrl?: string;
      };
    };
  };
  CabEntry: undefined;
  ApprovalStatus: undefined;
  TodaysVisitors: undefined;
  VisitorEntry: undefined;
  Document: undefined;
  VisitorLog: undefined;
  VisitorDetails: {
    visitorId: string;
  };
  Register: undefined;
  CabAdditionalDetails: {
    formData: CabFormData;
    visitorId: string;
  };
  VisitorSuccess: {
    formData: VisitorFormData;
    visitorId: string;
  };
  CabSuccess: {
    formData: CabFormData & AdditionalDetailsFormData;
    visitorId: string;
  };
}; 