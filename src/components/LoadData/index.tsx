import {Container, StyledImage, SubTitle, Title,   } from "./styles";
import PersonBlack from '../../assets/personblack.png'
import PersonWhite from '../../assets/personwhite.png'

type ImageTypeProps = 'PRIMARY' | 'SECONDARY';

type LoadDataProps ={
    title?: string;
    subtitle?: string;
    image?: ImageTypeProps;
}


export function LoadData({image = 'PRIMARY', title, subtitle}: LoadDataProps){
    

    return(
        <Container>
             <Title>
                {title}
            </Title>
            <StyledImage source={image === 'PRIMARY' ? PersonWhite : PersonBlack}/>
           
            <SubTitle>
                {subtitle}
            </SubTitle>
        </Container>
    )
}