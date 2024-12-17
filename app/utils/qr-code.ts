import QRCode from 'react-native-qrcode-svg';

export function generateVisitorQRData(visitorData: {
  id: string;
  name: string;
  contactNumber: string;
  purposeOfVisit: string;
  additionalDetails?: {
    department?: string;
    whomToMeet?: string;
  };
}) {
  // Create a structured data object for the QR code
  const qrData = {
    visitorId: visitorData.id,
    name: visitorData.name,
    contactNumber: visitorData.contactNumber,
    purposeOfVisit: visitorData.purposeOfVisit,
    department: visitorData.additionalDetails?.department,
    whomToMeet: visitorData.additionalDetails?.whomToMeet,
  };

  return JSON.stringify(qrData);
} 