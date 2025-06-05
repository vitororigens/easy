import { AntDesign } from "@expo/vector-icons";
import {
  Container,
  Content,
  ContentItems,
  Icon,
  Separator,
  SubTitle,
  Title,
} from "./styles";
import { formatPrice } from "../../../utils/price";
import { format } from "date-fns";
import { IMarket } from "../../../interfaces/IMarket";

interface IMarketHistoryItem {
  market: IMarket;
}

export const MarketHistoryItem = ({ market }: IMarketHistoryItem) => {
  const totalValue = (market.quantity || 0) * (market.price || 0);
  return (
    <Container>
      <Icon type="primary">
        <AntDesign name="infocirlce" size={24} color="white" />
      </Icon>
      <Content>
        <ContentItems>
          <Title type="primary">{market.name}</Title>
          <Title type="primary">{formatPrice(totalValue)}</Title>
        </ContentItems>
        <Separator />
        <ContentItems>
          <SubTitle>{format(market.createdAt.toDate(), "dd/mm/yyyy")}</SubTitle>
          <SubTitle>Pago</SubTitle>
        </ContentItems>
      </Content>
    </Container>
  );
};
