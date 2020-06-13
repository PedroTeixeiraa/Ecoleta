import React, { useState, useEffect } from 'react'
import { Feather as Icon } from '@expo/vector-icons'
import { View, Text, Image, ImageBackground, KeyboardAvoidingView, Picker } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'

import axios from 'axios'

import styles from './styles'

interface IBGEUFResponse {
	sigla: string
}

interface IBGECityResponse {
	nome: string
}

const Home = () => {
	const [ufs, setUfs] = useState<string[]>([])
	const [cities, setCities] = useState<string[]>([])

	const [selectedCity, setSelectedCity] = useState('0');
	const [selectedUF, setSelectedUF] = useState('0');

	const navigation = useNavigation()

	useEffect(() => {
		axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome').then(response => {

			const ufInitials = response.data.map(uf => uf.sigla)

			setUfs(ufInitials)
		})
	}, [])

	useEffect(() => {
		axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`).then(response => {
			const cities = response.data.map(city => city.nome)

			setCities(cities)
		})
	}, [selectedUF])

	function handleNavigateToPoints() {
		navigation.navigate('Points', {
			city: selectedCity,
			uf: selectedUF,
		})
	}

	return (
		<KeyboardAvoidingView
			behavior='height'
			style={{ flex: 1 }}
		>
			<ImageBackground
				source={require('../../assets/home-background.png')}
				style={styles.container}
				imageStyle={{ width: 274, height: 368 }}
			>
				<View style={styles.main}>
					<Image source={require('../../assets/logo.png')} />
					<View>
						<Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
						<Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
					</View>
				</View>

				<View style={styles.footer}>
					<View style={styles.selectItem}>
						<Picker
							style={styles.item}
							selectedValue={selectedUF}
							onValueChange={(itemValue, itemIndex) => setSelectedUF(itemValue)}
							key={selectedUF}
						>
							<Picker.Item label="Selecione uma UF" value="0" />
							{ufs.map(uf => (
								<Picker.Item key={uf} label={uf} value={uf} />
							))}
						</Picker>
					</View>

					<View style={styles.selectItem}>
						<Picker
							style={styles.item}
							selectedValue={selectedCity}
							onValueChange={itemValue => setSelectedCity(itemValue)}
							key={selectedCity}
							enabled={selectedUF != '0'}
						>
							<Picker.Item label="Selecione uma Cidade" value="0" />
							{cities.map(city => (
								<Picker.Item key={city} label={city} value={city} />
							))}
						</Picker>
					</View>
					<RectButton style={styles.button} onPress={handleNavigateToPoints}>
						<View style={styles.buttonIcon}>
							<Text>
								<Icon name="arrow-right" color="#FFF" size={24} />
							</Text>
						</View>
						<Text style={styles.buttonText}>Entrar</Text>
					</RectButton>
				</View>
			</ImageBackground>
		</KeyboardAvoidingView>
	)
}

export default Home