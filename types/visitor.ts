export interface VisitorFormData {
  address: string;
  contactNumber: string;
  vehicleNumber: string;
  purposeOfVisit: string;
  visitType: string;
}

export interface AdditionalDetailsFormData {
  whomToMeet: string;
  department: string;
  documentType: string;
  selectedStaff: string;
  sendNotification: boolean;
  documentUri?: string;
}

export interface VisitorLogData {
  id: string;
  name: string;
  checkInTime: string;
  checkOutTime: string | null;
  purpose: string;
  whomToMeet: string;
  department: string;
  status: 'In' | 'Out' | 'pending';
  contactNumber: string;
  visitorPhotoUrl?: string;
  documentUrl?: string;
  type: string;
  lastUpdated?: string;
  additionalDetails?: {
    whomToMeet?: string;
    department?: string;
    documentType?: string;
    visitorCount?: number;
    visitorPhotoUrl?: string;
    documentUrl?: string;
    checkInTime?: string;
    checkOutTime?: string;
  };
} 