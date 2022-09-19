import { useEffect, useState } from 'react';
import { StyleSheet, AsyncStorage, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { globalStyles } from '../../assets/styles/globalStyles';
import { Text, View } from '../../components/Themed';
import { Food } from '../../models';
import { Cart } from '../../models/cartModel';
import { RootTabScreenProps } from '../../types';
import * as databaseService from '../../services/databaseService'

export default function CartScreen({ navigation }: RootTabScreenProps<'Cart'>) {

  const [cartItems, setCartItems] = useState<{ food: Food, quantity: number }[]>()
  const [totalPrice, setTotalPrice] = useState<number>()

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getCart()
    })
    return unsubscribe
  }, [navigation])

  function getCart(): void {
    AsyncStorage.getItem('cart').then((localStorage: string | null) => {
      if (localStorage) {
        const cart: Cart = JSON.parse(localStorage)
        setCartItems(cart.items.filter(cartItem => cartItem.quantity > 0))
        if (cart.totalPrice < 0) {
          return setTotalPrice(0)
        }
        setTotalPrice(cart.totalPrice)
      }
    })
  }

  async function registerSell(): Promise<void> {
    if (cartItems && totalPrice) {
      const sellCreated: boolean = await databaseService.createSell({ items: cartItems, totalPrice })
      if (sellCreated) {
        Alert.alert('Venda criada', 'Acesse o histórico para ver os detalhes')
        await AsyncStorage.setItem('cart', '')
        return getCart()
      }
      Alert.alert('Erro', 'Venda não foi criada')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carrinho</Text>
      {
        totalPrice ?
          <Text>Preço total: R$ {totalPrice ?? 0}</Text>
          : null
      }
      {
        cartItems && cartItems.length > 0 ?
          <TouchableOpacity onPress={() => {
            registerSell()
          }} style={[globalStyles.button, globalStyles.backgroudGreen]}>
            <Text style={[globalStyles.textWhite]}>
              Finalizar pedido
            </Text>
          </TouchableOpacity>
          : null
      }
      <ScrollView style={globalStyles.scrollView}>
        {
          cartItems?.map((cartItem, index: number) => {
            return (
              <View key={index} style={[
                globalStyles.card,
                globalStyles.displayFlex,
                globalStyles.alignItemsCenter,
                globalStyles.justifyContentBetween
              ]}>
                <Text>
                  {cartItem.food.description}
                </Text>
                <Text>
                  Quantidade: {cartItem.quantity.toString()}
                </Text>
              </View>
            )
          })
        }
      </ScrollView >
    </View >
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
