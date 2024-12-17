interface FormErrors {
  name?: string;
  address?: string;
  contactNumber?: string;
  vehicleNumber?: string;
  purposeOfVisit?: string;
  typeOfVisit?: string;
  // Additional details form fields
  idType?: string;
  idNumber?: string;
  temperature?: string;
  company?: string;
  personToMeet?: string;
  department?: string;
  cabProvider?: string;
  driverName?: string;
  driverNumber?: string;
}

interface ValidationRules {
  name: (value: string) => string | undefined;
  address: (value: string) => string | undefined;
  contactNumber: (value: string) => string | undefined;
  vehicleNumber: (value: string) => string | undefined;
  purposeOfVisit: (value: string) => string | undefined;
  typeOfVisit: (value: string) => string | undefined;
  idType: (value: string) => string | undefined;
  idNumber: (value: string) => string | undefined;
  temperature: (value: string) => string | undefined;
  company: (value: string) => string | undefined;
  personToMeet: (value: string) => string | undefined;
  department: (value: string) => string | undefined;
  cabProvider: (value: string) => string | undefined;
  driverName: (value: string) => string | undefined;
  driverNumber: (value: string) => string | undefined;
}

const validationRules: ValidationRules = {
  name: (value: string) => {
    if (!value.trim()) return 'Name is required';
    if (!/^[a-zA-Z\s]{2,50}$/.test(value.trim())) {
      return 'Name should be 2-50 characters and contain only letters and spaces';
    }
    return undefined;
  },

  address: (value: string) => {
    if (!value.trim()) return 'Address is required';
    if (value.trim().length < 5) {
      return 'Address should be at least 5 characters';
    }
    return undefined;
  },

  contactNumber: (value: string) => {
    if (!value) return 'Contact number is required';
    if (!/^\d{10}$/.test(value)) {
      return 'Contact number must be exactly 10 digits';
    }
    return undefined;
  },

  vehicleNumber: (value: string) => {
    if (!value) return undefined; // Optional field
    if (!/^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/.test(value.replace(/\s/g, ''))) {
      return 'Invalid vehicle number format (e.g., KA01AB1234)';
    }
    return undefined;
  },



  typeOfVisit: (value: string) => {
    const validTypes = ['Personal', 'Business', 'Official', 'Other'];
    if (!validTypes.includes(value)) {
      return 'Please select a valid visit type';
    }
    return undefined;
  },

  // Additional details validation rules
  idType: (value: string) => {
    const validIdTypes = ['Passport', 'Driving License', 'National ID', 'Other'];
    if (!value) return 'ID type is required';
    if (!validIdTypes.includes(value)) {
      return 'Please select a valid ID type';
    }
    return undefined;
  },

  idNumber: (value: string) => {
    if (!value.trim()) return 'ID number is required';
    if (value.trim().length < 4) return 'ID number should be at least 4 characters';
    if (!/^[A-Z0-9-/]{4,20}$/i.test(value.trim())) {
      return 'Invalid ID number format';
    }
    return undefined;
  },

  temperature: (value: string) => {
    if (!value) return 'Temperature is required';
    const temp = parseFloat(value);
    if (isNaN(temp) || temp < 35 || temp > 42) {
      return 'Temperature must be between 35°C and 42°C';
    }
    return undefined;
  },

  company: (value: string) => {
    if (!value.trim()) return 'Company name is required';
    if (value.trim().length < 2) return 'Company name should be at least 2 characters';
    if (!/^[a-zA-Z0-9\s&.,'-]{2,50}$/.test(value.trim())) {
      return 'Invalid company name format';
    }
    return undefined;
  },

  personToMeet: (value: string) => {
    if (!value.trim()) return 'Person to meet is required';
    if (!/^[a-zA-Z\s]{2,50}$/.test(value.trim())) {
      return 'Person name should be 2-50 characters and contain only letters and spaces';
    }
    return undefined;
  },

  department: (value: string) => {
    if (!value.trim()) return 'Department is required';
    if (value.trim().length < 2) return 'Department should be at least 2 characters';
    if (!/^[a-zA-Z0-9\s&-]{2,50}$/.test(value.trim())) {
      return 'Invalid department name format';
    }
    return undefined;
  },

  cabProvider: (value: string) => {
    if (!value) return 'Cab provider is required';
    return undefined;
  },

  driverName: (value: string) => {
    if (!value) return undefined; // Optional
    if (!/^[a-zA-Z\s]{2,50}$/.test(value.trim())) {
      return 'Driver name should be 2-50 characters and contain only letters and spaces';
    }
    return undefined;
  },

  driverNumber: (value: string) => {
    if (!value) return undefined; // Optional
    if (!/^\d{10}$/.test(value)) {
      return 'Driver number must be exactly 10 digits';
    }
    return undefined;
  },
};

export function validateField(field: keyof FormErrors, value: string): string | undefined {
  return validationRules[field](value);
}

export function validateForm(formData: CabFormData) {
  const errors: Record<string, string> = {};

  // Required fields
  if (!formData.name) {
    errors.name = 'Name is required';
  }
  if (!formData.contactNumber) {
    errors.contactNumber = 'Contact number is required';
  }
  
  if (!formData.cabProvider) {
    errors.cabProvider = 'Cab provider is required';
  }

  // Optional driver details validation (only if provided)
  if (formData.driverName && formData.driverName.length < 2) {
    errors.driverName = 'Driver name should be at least 2 characters';
  }
  if (formData.driverNumber && !formatters.contactNumber(formData.driverNumber)) {
    errors.driverNumber = 'Please enter a valid driver contact number';
  }

  return errors;
}

// Helper function to format input values
export const formatters = {
  vehicleNumber: (value: string): string => {
    return value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  },
  
  contactNumber: (value: string): string => {
    return value.replace(/[^0-9]/g, '').slice(0, 10);
  },
  
  temperature: (value: string): string => {
    return value.replace(/[^0-9.]/g, '');
  },
  
  cabNumber: (value: string) => {
    return value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  },
}; 