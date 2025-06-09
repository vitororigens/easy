import React, { useState, useEffect } from "react";
import { IMarket } from "../../services/firebase/market.firebase";
import { useNavigation } from "@react-navigation/native";
import { SharedMarketsTabContent } from "./SharedMarketsTabContent";
import { MyMarketsTabContent } from "./MyMarketsTabContent";
import { useMarket } from "../../contexts/MarketContext";
import { Toast } from "react-native-toast-notifications";

interface IMarketTabContentProps {
  selectedItems: IMarket[];
  setSelectedItems: (items: IMarket[]) => void;
}

export const MarketTabContent = ({
  selectedItems,
  setSelectedItems,
}: IMarketTabContentProps) => {
  const navigation = useNavigation();
  const { markets, error } = useMarket();
  const [isMyListVisible, setIsMyListVisible] = useState(true);
  const [isSharedListVisible, setIsSharedListVisible] = useState(false);

  // Filter markets based on ownership
  const myMarkets = markets.filter(market => market.isOwner && !market.isShared);
  const sharedMarkets = markets.filter(market => market.isShared || !market.isOwner);

  useEffect(() => {
    if (error) {
      Toast.show(error, { type: "error" });
    }
  }, [error]);

  const handleAddItem = (item: IMarket) => {
    const itemIndex = selectedItems.findIndex(
      (selectedItem) => selectedItem.id === item.id
    );
    const exists = itemIndex !== -1;

    if (exists) {
      const item = selectedItems[itemIndex] as IMarket;
      item.quantity = (item.quantity ?? 0) + 1;

      const updatedItems = [...selectedItems];
      updatedItems.splice(itemIndex, 1, item);
      setSelectedItems(updatedItems);
    } else {
      setSelectedItems([
        ...selectedItems,
        { ...item, quantity: 1, price: item.price },
      ]);
    }
  };

  const handleRemoveItem = (item: IMarket) => {
    const itemIndex = selectedItems.findIndex(
      (selectedItem) => selectedItem.id === item.id
    );

    const exists = itemIndex !== -1;

    if (exists) {
      const item = selectedItems[itemIndex] as IMarket;
      item.quantity = (item.quantity ?? 0) - 1;

      const updatedItems = [...selectedItems];

      if (item.quantity <= 0) {
        updatedItems.splice(itemIndex, 1);
      } else {
        updatedItems.splice(itemIndex, 1, item);
      }

      setSelectedItems(updatedItems);
    }
  };

  function handleEditItem(documentId: string) {
    navigation.navigate("market-item", { selectedItemId: documentId });
  }

  return (
    <>
      <MyMarketsTabContent
        handleAddItem={handleAddItem}
        handleEditItem={handleEditItem}
        handleRemoveItem={handleRemoveItem}
        isMyListVisible={isMyListVisible}
        myMarkets={myMarkets}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        setIsMyListVisible={setIsMyListVisible}
      />
      <SharedMarketsTabContent
        handleAddItem={handleAddItem}
        handleEditItem={handleEditItem}
        handleRemoveItem={handleRemoveItem}
        isSharedListVisible={isSharedListVisible}
        selectedItems={selectedItems}
        setIsSharedListVisible={setIsSharedListVisible}
        sharedMarkets={sharedMarkets}
      />
    </>
  );
};
