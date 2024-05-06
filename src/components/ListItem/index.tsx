
import { Icon, Title, Container } from "./styles";
type ListItemProps = {
    title: string;
} 

export function ListItem({title}: ListItemProps){
    return(
        <Container>
            <Icon name="checkbox-marked-circle-outline"/>
            <Title>{title}</Title>
        </Container>
    )
}