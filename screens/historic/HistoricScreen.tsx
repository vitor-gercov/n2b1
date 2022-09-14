import { StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { RootTabScreenProps } from '../../types';

export default function HistoricScreen({ navigation }: RootTabScreenProps<'Historic'>) {
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
