import { useEffect, useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Text, View } from '../../components/Themed';
import { RootTabScreenProps } from '../../types';
import * as databaseService from '../../services/databaseService'
import { Sell } from '../../models/sellModal';
import { globalStyles } from '../../assets/styles/globalStyles';

export default function HistoricScreen({ navigation }: RootTabScreenProps<'Historic'>) {

  const [sells, setSells] = useState<Sell[]>()

  useEffect(() => {
    navigation.addListener('focus', () => {
      getAllSells()
    })
  }, [navigation])

  async function getAllSells(): Promise<void> {
    let sells: Sell[] = await databaseService.getAllSells()
    setSells(sells)
  }

  return (
    <View style={styles.container}>
      <ScrollView style={globalStyles.scrollView}>
        {
          sells?.map((sell, index: number) => {
            return (
              <View key={index} style={globalStyles.card}>
                <Text style={globalStyles.label}>Data: {sell.createdAt.substring(0, 10)}</Text>
                {
                  sell.items?.map((item: { food: string, quantity: number }, itemIndex: number) => {
                    return (
                      <Text key={itemIndex}>
                        {item.food} - {item.quantity.toString()}
                      </Text>
                    )
                  })
                }
              </View>
            )
          })
        }
      </ScrollView >
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
