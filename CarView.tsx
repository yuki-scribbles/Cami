import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Modal, Button, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

type SeverityLevel = 'Low' | 'Medium' | 'High';

const { width: screenWidth } = Dimensions.get('window');

const CarView = () => {
  const carData = {
    model: 'Toyota Camry',
    licensePlate: 'XYZ-1234',
    year: 2020,
    damages: [
      { part: 'Front Bumper', severity: 'Medium' as SeverityLevel, description: 'Scratches and dents on the front bumper.' },
      { part: 'Rear Door', severity: 'Low' as SeverityLevel, description: 'Minor scratches on the left rear door.' },
      { part: 'Windshield', severity: 'High' as SeverityLevel, description: 'Large crack across the windshield.' },
    ],
  };

  const images = [
    require('./assets/favicon.png'),
    require('./assets/car.webp'),
    require('./assets/icon.png'),
  ];

  const [selectedDamage, setSelectedDamage] = useState<null | { part: string; description: string }>(null);

  const severityStyles: Record<SeverityLevel, object> = {
    Low: styles.severityLow,
    Medium: styles.severityMedium,
    High: styles.severityHigh,
  };

  return (
    <ScrollView style={styles.container}>
      {/* Carousel */}
      <View style={styles.carouselContainer}>
        <Carousel
          loop
          width={screenWidth}
          height={250}
          autoPlay={true}
          data={images}
          scrollAnimationDuration={1000}
          renderItem={({ item }) => (
            <Image source={item} style={styles.carouselImage} />
          )}
        />
      </View>

      {/* Car Info Section */}
      <View style={styles.infoContainer}>
        <Text style={styles.carModel}>{carData.model}</Text>
        <Text style={styles.carDetails}>
          Year: {carData.year} | License Plate: {carData.licensePlate}
        </Text>
      </View>

      {/* Damages Section */}
      <View style={styles.damageContainer}>
        <Text style={styles.sectionTitle}>Damages</Text>
        {carData.damages.map((damage, index) => (
          <TouchableOpacity
            key={index}
            style={styles.damageItem}
            onPress={() => setSelectedDamage({ part: damage.part, description: damage.description })}
          >
            <Text style={styles.damageText}>{damage.part}</Text>
            <Text style={[styles.severityText, severityStyles[damage.severity]]}>
              {damage.severity}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Damage Detail Modal */}
      {selectedDamage && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={!!selectedDamage}
          onRequestClose={() => setSelectedDamage(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedDamage.part}</Text>
              <Text style={styles.modalDescription}>{selectedDamage.description}</Text>
              <Button title="Close" onPress={() => setSelectedDamage(null)} />
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
};

export default CarView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  carouselContainer: {
    marginBottom: 20,
  },
  carouselImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  carModel: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  carDetails: {
    fontSize: 16,
    color: '#aaaaaa',
    textAlign: 'center',
    marginTop: 5,
  },
  damageContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  damageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#2e2e2e',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  damageText: {
    color: 'white',
    fontSize: 16,
  },
  severityText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  severityLow: {
    color: '#4caf50',
  },
  severityMedium: {
    color: '#ff9800',
  },
  severityHigh: {
    color: '#f44336',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
});