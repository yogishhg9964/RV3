import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Dropdown } from '../ui/dropdown';
import { departments, documentTypes, getStaffByDepartment } from '../../constants/visitor-data';

interface VisitorFormProps {
  formData: any;
  setFormData: (data: any) => void;
  renderAfter?: () => React.ReactNode;
}

export function VisitorForm({ formData, setFormData, renderAfter }: VisitorFormProps) {
  // Get staff options based on selected department
  const staffOptions = formData.department ? getStaffByDepartment(formData.department) : [];

  return (
    <View style={styles.container}>
      <Dropdown
        value={formData.department}
        onValueChange={(value) => {
          setFormData(prev => ({ 
            ...prev, 
            department: value,
            whomToMeet: '' // Reset whomToMeet when department changes
          }))
        }}
        options={departments}
        placeholder="Select Department *"
        icon="business"
      />

      <Dropdown
        value={formData.whomToMeet}
        onValueChange={(value) => setFormData(prev => ({ ...prev, whomToMeet: value }))}
        options={staffOptions}
        placeholder="Select Whom to Meet (Optional)"
        icon="person"
        disabled={!formData.department} // Disable if no department selected
      />

      <Dropdown
        value={formData.documentType}
        onValueChange={(value) => setFormData(prev => ({ ...prev, documentType: value }))}
        options={documentTypes}
        placeholder="Select Document Type *"
        icon="document-text"
      />

      {renderAfter?.()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
}); 