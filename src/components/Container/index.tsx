import { ReactNode } from "react";
import { ContainerTypeStyleProps, Content, Header, Icon, Title } from "./styles";

type ContainerProps= {
    title?: string | number;
    name?: string;
    color?:string;
    type?:ContainerTypeStyleProps;
    children?: ReactNode;
}

export function Container({ title, name, type = 'PRIMARY', children}: ContainerProps){
    return(
      <Content>
          <Header type={type}>
            <Icon name={name}/>
            <Title>
                {title}
            </Title>
          </Header>
          {children}
      </Content>
    )
}