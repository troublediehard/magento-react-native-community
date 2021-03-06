/**
 * Created by Dima Portenko on 02.04.2021
 */
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native-ui-lib';
import { useCartDetails } from '../../logic/cart/useCartDetails';
import { ActivityIndicator, FlatList, ListRenderItem, RefreshControl } from 'react-native';
import { CartDetailItemType } from '../../apollo/queries/cartItemsFragment';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getPriceString } from '../../logic/util/price';
import { CartDetailsListItem } from './CartDetailsListItem';
import TouchableRipple from '../common/TouchableRipple';
import { CartDetailsScreenNavigationProp } from '../../navigation/Navigation';
import * as routes from '../../navigation/routes';

interface CartDetailsScreenProps {
  navigation: CartDetailsScreenNavigationProp;
}

export const CartDetailsScreen = ({ navigation }: CartDetailsScreenProps) => {
  const [removeItemUid, setRemoveItemUid] = useState('');
  const {
    getCartDetails,
    loading,
    cartItems,
    totals,
    removeFromCart,
    removeItemLoading,
  } = useCartDetails();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    getCartDetails();
  }, []);

  const onRemoveCartItemPress = (item: CartDetailItemType) => {
    setRemoveItemUid(item.uid);
    removeFromCart(item.uid);
  };

  const renderCartItem: ListRenderItem<CartDetailItemType> = ({ item, index }) => {
    const isLast = cartItems.length - 1 === index;
    return (
      <CartDetailsListItem
        removing={removeItemLoading && removeItemUid === item.uid}
        index={index}
        isLast={isLast}
        onRemoveCartItemPress={onRemoveCartItemPress}
        item={item}
      />
    );
  };

  return (
    <View flex>
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={item => item.product.sku}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={getCartDetails} />}
      />
      <View bg-white style={{ paddingBottom: insets.bottom }}>
        {!!totals && (
          <Text text70R margin-10>{`Totals: ${getPriceString(totals?.grand_total)}`}</Text>
        )}
        <TouchableRipple
          enabled={!loading}
          color="black"
          rippleColor="rgba(255, 255, 255, 0.2)"
          onPress={() => {
            navigation.navigate(routes.NAVIGATION_CHECKOUT_ROUTE);
          }}>
          <View height={50} width="100%" absB bg-black center>
            <View row flex center>
              <Text white marginH-7>
                Checkout
              </Text>
            </View>
          </View>
        </TouchableRipple>
      </View>
    </View>
  );
};
