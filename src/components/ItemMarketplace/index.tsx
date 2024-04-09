import React, { useState } from "react";
import { Button, CartIcon, Container, ContainerQuantity, Contant, Icon, SubTitle, Title } from "./styles";

type ItemMarketplaceProps = {
    title: string;
    quantity: number;
    value: string;
    measurements: string;
    addItem: (value: string) => void;
    removeItem: (value: string) => void;
}

export function ItemMarketplace({ title, quantity, value, measurements, addItem, removeItem }: ItemMarketplaceProps) {
    const [isTyping, setIsTyping] = useState(false); 
    const [quantityValue, setQuantityValue] = useState(1);
    const handleClickAddItem = () => {
        setIsTyping(true); 
        addItem(value); 
    };


    const handleDecreaseQuantity = () => {
        if (quantityValue > 1) { 
            setQuantityValue(quantityValue - 1); 
            
        }
        removeItem(value)

        if( quantityValue === 1) {
            setIsTyping(false)
            removeItem(value)
        }
    };

    const handleIncreaseQuantity = () => {
        setQuantityValue(quantityValue + 1); 
        addItem(value)
    };

    return (
        <Container>
            <CartIcon name="cart-variant"/>
            <Contant >
                <Title>{title}</Title>
                <SubTitle>{quantity} {measurements}</SubTitle>
            </Contant>
            <Contant style={{ justifyContent: 'center', alignItems: 'center' }}>
                {isTyping ? ( 
                    <ContainerQuantity>
                        <Button onPress={handleDecreaseQuantity}>
                            <Icon name="minus" />
                        </Button>
                        <Title>{quantityValue}</Title>
                        <Button onPress={handleIncreaseQuantity}>
                            <Icon name="plus" />
                        </Button>
                    </ContainerQuantity>
                ) : (
                    <Button onPress={handleClickAddItem}>
                        <Icon name="circle-with-plus" />
                    </Button>
                )}
                <Title style={{ textAlign: 'center', width: 100 }}>{value}</Title>
            </Contant>
        </Container>
    );
}
