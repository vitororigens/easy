import { ReactNode } from 'react';
import { View } from 'react-native';
import {
  ContainerTypeStyleProps,
  Content,
  Header,
  Icon,
  SubTitle,
  Title,
} from './styles';

type ContainerProps = {
  title?: string | number;
  subtitle?: string | number;
  name?: string;
  color?: string;
  type?: ContainerTypeStyleProps;
  children?: ReactNode;
};

export function Container({
  title,
  subtitle,
  name,
  type = 'PRIMARY',
  children,
}: ContainerProps) {
  return (
    <Content>
      <Header type={type}>
        <Icon name={name} />
        <View style={{alignItems: 'center'}}>
          <Title>{title}</Title>
          {!!subtitle && <SubTitle>{subtitle}</SubTitle>}
        </View>
      </Header>
      {children}
    </Content>
  );
}
