import {View, Text, Image, ScrollView, TouchableOpacity, Button, Modal} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { styles, screenWidth } from '../App';
import type {SeverityLevel } from '../App';
import { useState } from 'react';

// Car View Screen
export const CarScreen = (navigation : any) => {
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
      require('../assets/favicon.png'),
      require('../assets/car.webp'),
      require('../assets/icon.png'),
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
  
        <Button title = "maps button" onPress={()=>navigation.navigate('Maps')}></Button>
  
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
  