import React, { useState, useEffect } from 'react'
import { View, Image, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native'
import { Feather as Item } from '@expo/vector-icons'
import Constants from 'expo-constants'
import { useNavigation } from '@react-navigation/native'
import MapView, { Marker } from 'react-native-maps'
import { SvgUri } from 'react-native-svg'

import api from '../../services/api'

interface Item {
  id: number
  title: string
  image_url: string
}

const Points = () => {
    const [items, setItems] = useState<Item[]>([])
    const [selectedItems, setSelectedItems] = useState<number[]>([])
    const navigation = useNavigation()

    useEffect(() => {
      api.get('items').then(response => {

        setItems(response.data)
      })
    }, [])

    function handleNavigateToHome() {
        navigation.goBack()
    }

    function handleNavigateToDetail() {
        navigation.navigate('Detail')
    }

    function handleSelectItem(id: number) {
      const alreadySelected = selectedItems.findIndex(item => item === id)

      if (alreadySelected >= 0) {
          const filteredItems = selectedItems.filter(item => item !== id)

          setSelectedItems(filteredItems)
      } else {
          setSelectedItems([...selectedItems, id])
      }
  }

    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleNavigateToHome}>
                    <Item name="arrow-left" size={25} color="#34cb79"/>
                </TouchableOpacity>

                <Text style={styles.title}>Bem vindo.</Text>
                <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>

                <View style={styles.mapContainer}>
                    <MapView 
                        style={styles.map} 
                        initialRegion={{
                            latitude: -29.8343533,
                            longitude: -51.1689972,
                            latitudeDelta: 0.012,
                            longitudeDelta: 0.012,
                        }}
                    >
                        <Marker 
                            style={styles.mapMarker}
                            onPress={handleNavigateToDetail}
                            coordinate={{
                                latitude: -29.8343533,
                                longitude: -51.1689972,
                            }}
                        >   
                            <View style={styles.mapMarkerContainer}>
                                <Image
                                    style={styles.mapMarkerImage} 
                                    source={{ uri: 'https://images.unsplash.com/photo-1556767576-5ec41e3239ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60'}}
                                />
                                <Text style={styles.mapMarkerTitle}>Mercado</Text>
                            </View>
                        </Marker>
                    </MapView>
                </View>
            </View>
            <View style={styles.itemsContainer}>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20 }} 
                > 
                    {items.map(item => (
                        <TouchableOpacity 
                            style={[
                              styles.item,
                              selectedItems.includes(item.id) ? styles.selectedItem : {}
                            ]} 
                            activeOpacity={0.6}
                            onPress={() => handleSelectItem(item.id)} 
                            key={String(item.id)}
                        >
                            <SvgUri width={42} height={42} uri={item.image_url}/>
                            <Text style={styles.itemTitle}>{item.title}</Text>
                        </TouchableOpacity>
                    ))}
                    

                </ScrollView>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 32,
      paddingTop: 20 + Constants.statusBarHeight,
    },
  
    title: {
      fontSize: 20,
      fontFamily: 'Ubuntu_700Bold',
      marginTop: 24,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 4,
      fontFamily: 'Roboto_400Regular',
    },
  
    mapContainer: {
      flex: 1,
      width: '100%',
      borderRadius: 10,
      overflow: 'hidden',
      marginTop: 16,
    },
  
    map: {
      width: '100%',
      height: '100%',
    },
  
    mapMarker: {
      width: 90,
      height: 80, 
    },
  
    mapMarkerContainer: {
      width: 90,
      height: 70,
      backgroundColor: '#34CB79',
      flexDirection: 'column',
      borderRadius: 8,
      overflow: 'hidden',
      alignItems: 'center'
    },
  
    mapMarkerImage: {
      width: 90,
      height: 45,
      resizeMode: 'cover',
    },
  
    mapMarkerTitle: {
      flex: 1,
      fontFamily: 'Roboto_400Regular',
      color: '#FFF',
      fontSize: 13,
      lineHeight: 23,
    },
  
    itemsContainer: {
      flexDirection: 'row',
      marginTop: 16,
      marginBottom: 32,
    },
  
    item: {
      backgroundColor: '#fff',
      borderWidth: 2,
      borderColor: '#eee',
      height: 120,
      width: 120,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 16,
      marginRight: 8,
      alignItems: 'center',
      justifyContent: 'space-between',
  
      textAlign: 'center',
    },
  
    selectedItem: {
      borderColor: '#34CB79',
      borderWidth: 2,
    },
  
    itemTitle: {
      fontFamily: 'Roboto_400Regular',
      textAlign: 'center',
      fontSize: 13,
    },
  })

export default Points