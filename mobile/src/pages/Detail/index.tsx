import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, Image, Text, Linking } from 'react-native'
import { Feather as Icon, FontAwesome, } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { RectButton } from 'react-native-gesture-handler'
import * as MailComposer from 'expo-mail-composer'

import styles from './styles'
import api from '../../services/api'

interface Params {
	point_id: number
}

interface Data {
	serializedPoint: {
		image: string
		image_url: string
		name: string
		email: string
		whatsapp: string
		city: string
		uf: string
	}
	item: {
		title: string
	}[]
}

const Detail = () => {
	const [data, setData] = useState<Data>({} as Data)

	const navigation = useNavigation()
	const route = useRoute()

	const routeParams = route.params as Params

	useEffect(() => {
		api.get(`points/${routeParams.point_id}`).then(response => {
			setData(response.data)
		})
	}, [])

	function handleNavigateToPoints() {
		navigation.goBack()
	}

	function handleComposeMail() {
		MailComposer.composeAsync({
			subject: 'Interesse na coleta de resíduos',
			recipients: [data.serializedPoint.email],
		})
	}

	function handleWhatsapp() {
		Linking.openURL(`whatsapp://send?phone=${data.serializedPoint.whatsapp}&text=Tenho Interesse sobre coleta de resíduos`)
	}

	if (!data.serializedPoint) {
		return null
	}

	return (
		<>
			<View style={styles.container}>
				<TouchableOpacity onPress={handleNavigateToPoints}>
					<Icon name="arrow-left" size={25} color="#34cb79" />
				</TouchableOpacity>

				<Image style={styles.pointImage} source={{ uri: data.serializedPoint.image_url }} />

				<Text style={styles.pointName}>{data.serializedPoint.name}</Text>
				<Text style={styles.pointItems}>
					{data.item.map(item => item.title).join(', ')}
				</Text>

				<View style={styles.address}>
					<Text style={styles.addressTitle}>Endereço</Text>
					<Text style={styles.addressContent}>{data.serializedPoint.city}, {data.serializedPoint.uf}</Text>
				</View>
			</View>
			<View style={styles.footer}>
				<RectButton style={styles.button} onPress={handleWhatsapp}>
					<FontAwesome name="whatsapp" size={20} color="#fff" />
					<Text style={styles.buttonText}>Whatsapp</Text>
				</RectButton>

				<RectButton style={styles.button} onPress={handleComposeMail}>
					<Icon name="mail" size={20} color="#fff" />
					<Text style={styles.buttonText}>E-mail</Text>
				</RectButton>
			</View>
		</>
	)
}

export default Detail