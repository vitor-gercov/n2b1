import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { RootTabScreenProps } from '../../types';
import * as databaseService from '../../services/databaseService'
import { Sell } from '../../models/sellModal';

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
      <Text style={styles.title}>Histórico</Text>
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
