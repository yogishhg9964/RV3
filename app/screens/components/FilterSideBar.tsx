import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { departments } from '../../constants/visitor-data';

interface FilterSidebarProps {
  visible: boolean;
  onClose: () => void;
  filters: {
    status: string[];
    department: string[];
    sortBy: string | null;
  };
  onFilterChange: (filters: any) => void;
}

const STATUS_OPTIONS = [
  { label: 'Checked In', value: 'In' },
  { label: 'Checked Out', value: 'Out' },
  { label: 'Pending', value: 'pending' },
];

const SORT_OPTIONS = [
  { label: 'Check-in Time', value: 'checkInTime' },
  { label: 'Visitor Name', value: 'name' },
  { label: 'Status', value: 'status' },
  { label: 'Department', value: 'department' },
];

export function FilterSidebar({ visible, onClose, filters, onFilterChange }: FilterSidebarProps) {
  if (!visible) return null;

  const toggleStatus = (status: string) => {
    const newStatuses = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    
    onFilterChange({
      ...filters,
      status: newStatuses,
    });
  };

  const toggleDepartment = (dept: string) => {
    const newDepartments = filters.department.includes(dept)
      ? filters.department.filter(d => d !== dept)
      : [...filters.department, dept];
    
    onFilterChange({
      ...filters,
      department: newDepartments,
    });
  };

  const setSortBy = (sortBy: string) => {
    onFilterChange({
      ...filters,
      sortBy: filters.sortBy === sortBy ? null : sortBy,
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      status: [],
      department: [],
      sortBy: null,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Filters</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={clearAllFilters}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          {STATUS_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.checkboxRow}
              onPress={() => toggleStatus(option.value)}
            >
              <View style={[
                styles.checkbox,
                filters.status.includes(option.value) && styles.checkboxChecked
              ]}>
                {filters.status.includes(option.value) && (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Department</Text>
          {departments.map((dept) => (
            <TouchableOpacity
              key={dept.value}
              style={styles.checkboxRow}
              onPress={() => toggleDepartment(dept.value)}
            >
              <View style={[
                styles.checkbox,
                filters.department.includes(dept.value) && styles.checkboxChecked
              ]}>
                {filters.department.includes(dept.value) && (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>{dept.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sort By</Text>
          {SORT_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.radioRow}
              onPress={() => setSortBy(option.value)}
            >
              <View style={[
                styles.radio,
                filters.sortBy === option.value && styles.radioSelected
              ]}>
                {filters.sortBy === option.value && (
                  <View style={styles.radioInner} />
                )}
              </View>
              <Text style={styles.radioLabel}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '80%',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  clearText: {
    color: '#6B46C1',
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#6B46C1',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#6B46C1',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#374151',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#6B46C1',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#6B46C1',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6B46C1',
  },
  radioLabel: {
    fontSize: 14,
    color: '#374151',
  },
});