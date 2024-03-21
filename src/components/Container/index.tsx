import { ContainerTypeStyleProps, Content, Header, Icon, Title } from "./styles";

type ContainerProps= {
    title?: string;
    name?: string;
    color?:string;
    type?:ContainerTypeStyleProps;
}

export function Container({ title, name, type = 'PRIMARY'}: ContainerProps){
    return(
      <Content>
          <Header type={type}>
            <Icon name={name}/>
            <Title>
                {title}
            </Title>
          </Header>
      </Content>
    )
}