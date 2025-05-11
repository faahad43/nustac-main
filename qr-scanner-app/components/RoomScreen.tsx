import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView  } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../src/types/navigation';



type AccessCategories = {
  classes: Record<string, string[]>; // Each department has an array of class names
  labs: Record<string, string[]>; // Each department has an array of lab names
  staffRooms: Record<string, string[]>; // Each department has an array of staff room names
  personalRooms: Record<string, string[]>; // Each department has an array of personal room names
};


const generateAccessOptions = (): AccessCategories => {
  const departments = [
    "Seecs", "Sada", "Iaec", "S3h", "Smme", "Rimms",
    "Ns", "Sns", "Nshs", "Igis", "Nice", "Scme", "Asap", "Nls"
  ];

  const accessCategories: AccessCategories = {
    classes: {},
    labs: {},
    staffRooms: {},
    personalRooms: {},
  };

  departments.forEach((dept) => {
    accessCategories.classes[dept] = Array.from({ length: 15 }, (_, i) => `Class ${i + 1}`);
    accessCategories.labs[dept] = Array.from({ length: 5 }, (_, i) => `Lab ${i + 1}`);
    accessCategories.staffRooms[dept] = [`Staff Room`];
    accessCategories.personalRooms[dept] = Array.from({ length: 10 }, (_, i) => `Personal Room ${i + 1}`);
  });

  return accessCategories;
};

const accessOptions = generateAccessOptions();

type Props = NativeStackScreenProps<RootStackParamList, 'RoomSelect'>;

export default function RoomScreen({ route, navigation }: Props) {
  const { selectedDept } = route.params;
  const [selectedRoom, setSelectedRoom] = useState<string>('');


  const rooms = [
    ...(accessOptions.classes[selectedDept] || []),
    ...(accessOptions.labs[selectedDept] || []),
    ...(accessOptions.staffRooms[selectedDept] || []),
    ...(accessOptions.personalRooms[selectedDept] || []),
  ];

  return (
     <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Select Room</Text>
      <Picker
        selectedValue={selectedRoom}
        onValueChange={(value) => setSelectedRoom(value)}
        style={styles.picker}
      >
        {rooms.map((room) => (
          <Picker.Item key={room} label={room} value={room} />
        ))}
      </Picker>
      <Button
        title="Scan QR"
        onPress={() =>
          navigation.navigate('QrScanner', {
            selectedDept: selectedDept,
            selectedRoom: selectedRoom,
          })
        }
        disabled={!selectedRoom} // Disable button if no room is selected
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  picker: { height: 50, marginBottom: 20 },
});
