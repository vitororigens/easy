
import { useState } from "react";
import { Icon, Title, Container, Button, ListItemStyleProps } from "./styles";
type ListItemProps = {
    title: string;
} 

export function ListItem({title}: ListItemProps){
    const [isCheck, setIsCheck] = useState(false)
    function handlewCheck(){
        if(isCheck){
            setIsCheck(false)
        }else{
            setIsCheck(true)
        }
    } 
    return(
        <Container>
           <Button onPress={handlewCheck}>
           <Icon type={isCheck ? 'PRIMARY' : 'SECONDARY'} name={isCheck ? "checkbox-marked-circle-outline" : "checkbox-blank-circle-outline"}/>
           </Button>
            <Title type={isCheck ? 'PRIMARY' : 'SECONDARY'}>{title}</Title>
        </Container>
    )
}