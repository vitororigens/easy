import React, { useState } from "react";
import { IMarket } from "../../services/firebase/market.firebase";
import { useNavigation } from "@react-navigation/native";
import { SharedMarketsTabContent } from "./SharedMarketsTabContent";
import { MyMarketsTabContent } from "./MyMarketsTabContent";

interface IMarketTabContentProps {
  myMarkets: IMarket[];
  setMyMarkets: (items: IMarket[]) => void;
  selectedItems: IMarket[];
  setSelectedItems: (items: IMarket[]) => void;
  sharedMarkets: IMarket[];
  setSharedMarkets: (items: IMarket[]) => void;
}

export const MarketTabContent = ({
  myMarkets,
  setMyMarkets,
  selectedItems,
  setSelectedItems,
  sharedMarkets,
  setSharedMarkets,
}: IMarketTabContentProps) => {
  const navigation = useNavigation();

  const [isMyListVisible, setIsMyListVisible] = useState(true);
  const [isSharedListVisible, setIsSharedListVisible] = useState(false);

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
        setMyMarkets={setMyMarkets}
      />
      <SharedMarketsTabContent
        handleAddItem={handleAddItem}
        handleEditItem={handleEditItem}
        handleRemoveItem={handleRemoveItem}
        isSharedListVisible={isSharedListVisible}
        selectedItems={selectedItems}
        setIsSharedListVisible={setIsSharedListVisible}
        sharedMarkets={sharedMarkets}
        setSharedMarkets={setSharedMarkets}
      />
    </>
  );
};
