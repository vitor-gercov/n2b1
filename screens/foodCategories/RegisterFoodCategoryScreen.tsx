import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Text, View } from '../../components/Themed';
import * as databaseService from '../../services/databaseService';

export default function RegisterFoodCategoryScreen() {
  const [description, setDescription] = useState('');

  async function createFoodCategory(): Promise<void> {
    if (description && description.trim() != '') {
      await databaseService.createFoodCategory(description)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>
          Descrição
        </Text>
        <TextInput
          style={styles.input}
          onChangeText={(value: string) => {
            setDescription(value)
          }}
          value={description}
        />
        {
          !(description && description.trim() != '') ?
            <Text style={styles.errorText}>
              Descrição não informada
            </Text> : null
        }
        <View style={styles.marginBottom}></View>
        <TouchableOpacity style={styles.button}
          onPress={async () => {
            await createFoodCategory()
          }}>
          <Text style={styles.buttonText}>
            Criar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ddd',
    minWidth: 250
  },
  inputLabel: {
    fontSize: 18,
  },
  button: {
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#040d59',
  },
  buttonText: {
    color: '#FFF',
  },
  errorText: {
    color: '#a00'
  },
  marginBottom: {
    marginBottom: 30
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
