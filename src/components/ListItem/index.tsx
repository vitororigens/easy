
import { useState } from "react";
import { Icon, Title, Container, Button, ListItemStyleProps } from "./styles";
import { View } from "react-native";
type ListItemProps = {
    title: string;
}

export function ListItem({ title }: ListItemProps) {
    const [isCheck, setIsCheck] = useState(false)
    function handlewCheck() {
        if (isCheck) {
            setIsCheck(false)
        } else {
            setIsCheck(true)
        }
    }
    return (
        <Container>
            <Button onPress={handlewCheck}>
                <Icon type={isCheck ? 'PRIMARY' : 'SECONDARY'} name={isCheck ? "checkbox-marked-circle-outline" : "checkbox-blank-circle-outline"} />

                <Title type={isCheck ? 'PRIMARY' : 'SECONDARY'}>{title}</Title>
                </Button>
                <View style={{
                    flexDirection:'row'
                }}>
                    <Icon type="SECONDARY" name="pencil" />
                    <Icon type="SECONDARY" name="trash-can" />
                </View>
         
        </Container>
    )
}