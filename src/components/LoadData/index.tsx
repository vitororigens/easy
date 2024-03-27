import {Container, StyledImage, SubTitle, Title,   } from "./styles";
import PersonBlack from '../../assets/personblack.png'


export function LoadData(){
    return(
        <Container>
             <Title>
                Desculpe!
            </Title>
            <StyledImage source={PersonBlack}/>
           
            <SubTitle>
                Você ainda não possui dados para exibir aqui!
            </SubTitle>
        </Container>
    )
}