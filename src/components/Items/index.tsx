import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { Popover } from "react-native-popper";
import { useTheme } from "styled-components/native";
import { Button } from "../ItemTask/styles";
import {
  Container,
  ContainerMenu,
  Content,
  ContentItems,
  Divider,
  Icon,
  IconMenu,
  SubTitle,
  Title,
} from "./styles";

type ItemsProps = {
  category?: string;
  date?: string;
  valueTransaction?: string;
  repeat?: boolean;
  status?: boolean;
  alert?: boolean;
  type?: string;
  customStatusText?: string;
  showItemPiggyBank?: boolean;
  showItemTask?: boolean;
  showItemTaskRevenue?: boolean;
  hasEdit?: boolean;
  hasAction?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
};

export function Items({
  category,
  date,
  valueTransaction,
  repeat,
  alert,
  status,
  type,
  showItemPiggyBank,
  showItemTaskRevenue,
  showItemTask,
  customStatusText,
  onDelete,
  onEdit,
  hasEdit = true,
  hasAction = true,
}: ItemsProps) {
  const transactionType = repeat ? "Renda fixa" : "Renda variável";
  const { COLORS } = useTheme();
  const textStatus = customStatusText
    ? customStatusText
    : status
    ? "Pago"
    : "Pendente";
  const typeMode = type === "input" ? transactionType : textStatus;
  const dateToday = formatDate(new Date());

  function formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function isPastDue(date: string): boolean {
    const [day, month, year] = date.split("/").map(Number);
    const itemDate = new Date(year, month - 1, day);
    return itemDate < new Date() && !status;
  }

  return (
    <>
      <Container>
        {showItemTask && isPastDue(date ?? new Date().toISOString()) && (
          <>
            <Icon type="SECONDARY">
              <AntDesign name="infocirlce" size={24} color="white" />
            </Icon>
            <Content>
              <ContentItems>
                <Title type="SECONDARY">{category}</Title>
                <Title type="SECONDARY">{valueTransaction}</Title>
              </ContentItems>
              <Divider />
              <ContentItems>
                <SubTitle>{date}</SubTitle>
                <SubTitle>Atrasado</SubTitle>
              </ContentItems>
            </Content>
            <Popover
              trigger={
                <TouchableOpacity>
                  <IconMenu type="SECONDARY" name="dots-three-vertical" />
                </TouchableOpacity>
              }
            >
              <Popover.Backdrop />
              <Popover.Content>
                <ContainerMenu>
                  <Button onPress={onDelete}>
                    <IconMenu type="SECONDARY" name="trash" />
                    <Title type="SECONDARY">Excluir</Title>
                  </Button>
                  <Button onPress={onEdit}>
                    <IconMenu type="SECONDARY" name="pencil" />
                    <Title type="SECONDARY">Editar</Title>
                  </Button>
                  <Button onPress={onEdit}>
                    <IconMenu type="SECONDARY" name="pencil" />
                    <Title type="SECONDARY">Pagar</Title>
                  </Button>
                </ContainerMenu>
              </Popover.Content>
            </Popover>
          </>
        )}
        {showItemTask &&
          !isPastDue(date ?? new Date().toISOString()) &&
          !status && (
            <>
              <Icon type="TERTIARY">
                <AntDesign name="infocirlce" size={24} color="white" />
              </Icon>
              <Content>
                <ContentItems>
                  <Title type="TERTIARY">{category}</Title>
                  <Title type="TERTIARY">{valueTransaction}</Title>
                </ContentItems>
                <Divider />
                <ContentItems>
                  <SubTitle>{date}</SubTitle>
                  <SubTitle>{typeMode}</SubTitle>
                </ContentItems>
              </Content>
              <Popover
                trigger={
                  <TouchableOpacity>
                    <IconMenu type="TERTIARY" name="dots-three-vertical" />
                  </TouchableOpacity>
                }
              >
                <Popover.Backdrop />
                <Popover.Content>
                  <ContainerMenu>
                    <Button onPress={onDelete}>
                      <IconMenu type="TERTIARY" name="trash" />
                      <Title type="TERTIARY">Excluir</Title>
                    </Button>
                    <Button onPress={onEdit}>
                      <IconMenu type="TERTIARY" name="pencil" />
                      <Title type="TERTIARY">Editar</Title>
                    </Button>
                  </ContainerMenu>
                </Popover.Content>
              </Popover>
            </>
          )}
        {showItemTask && status && (
          <>
            <Icon type="PRIMARY">
              <AntDesign name="infocirlce" size={24} color="white" />
            </Icon>
            <Content>
              <ContentItems>
                <Title type="PRIMARY">{category}</Title>
                <Title type="PRIMARY">{valueTransaction}</Title>
              </ContentItems>
              <Divider />
              <ContentItems>
                <SubTitle>{date}</SubTitle>
                <SubTitle>{typeMode}</SubTitle>
              </ContentItems>
            </Content>
            {hasAction && (
              <Popover
                trigger={
                  <TouchableOpacity>
                    <IconMenu type="PRIMARY" name="dots-three-vertical" />
                  </TouchableOpacity>
                }
              >
                <Popover.Backdrop />
                <Popover.Content>
                  <ContainerMenu>
                    <Button onPress={onDelete}>
                      <IconMenu type="PRIMARY" name="trash" />
                      <Title type="PRIMARY">Excluir</Title>
                    </Button>
                    {hasEdit && (
                      <Button onPress={onEdit}>
                        <IconMenu type="PRIMARY" name="pencil" />
                        <Title type="PRIMARY">Editar</Title>
                      </Button>
                    )}
                  </ContainerMenu>
                </Popover.Content>
              </Popover>
            )}
          </>
        )}
        {showItemTaskRevenue && (
          <>
            <Icon type="PRIMARY">
              <AntDesign name="infocirlce" size={24} color="white" />
            </Icon>
            <Content>
              <ContentItems>
                <Title type="PRIMARY">{category}</Title>
                <Title type="PRIMARY">{valueTransaction}</Title>
              </ContentItems>
              <Divider />
              <ContentItems>
                <SubTitle>{date}</SubTitle>
                <SubTitle>{transactionType}</SubTitle>
              </ContentItems>
            </Content>
            <Popover
              trigger={
                <TouchableOpacity>
                  <IconMenu type="PRIMARY" name="dots-three-vertical" />
                </TouchableOpacity>
              }
            >
              <Popover.Backdrop />
              <Popover.Content>
                <ContainerMenu>
                  <Button onPress={onDelete}>
                    <IconMenu type="PRIMARY" name="trash" />
                    <Title type="PRIMARY">Excluir</Title>
                  </Button>
                  <Button onPress={onEdit}>
                    <IconMenu type="PRIMARY" name="pencil" />
                    <Title type="PRIMARY">Editar</Title>
                  </Button>
                </ContainerMenu>
              </Popover.Content>
            </Popover>
          </>
        )}
      </Container>
      {showItemPiggyBank && (
        <Container>
          <Icon style={{ backgroundColor: COLORS.GREEN_700 }} type="PRIMARY">
            <AntDesign name="infocirlce" size={24} color="white" />
          </Icon>
          <Content>
            <ContentItems>
              <Title style={{ color: COLORS.GREEN_700 }} type="PRIMARY">
                {category}
              </Title>
              <Title style={{ color: COLORS.GREEN_700 }} type="PRIMARY">
                {valueTransaction}
              </Title>
            </ContentItems>
            <Divider />
            <ContentItems>
              <SubTitle>{date}</SubTitle>
              <SubTitle>Economizou</SubTitle>
            </ContentItems>
          </Content>
          <Popover
            trigger={
              <TouchableOpacity>
                <IconMenu type="PRIMARY" name="dots-three-vertical" />
              </TouchableOpacity>
            }
          >
            <Popover.Backdrop />
            <Popover.Content>
              <ContainerMenu>
                <Button onPress={onDelete}>
                  <IconMenu type="PRIMARY" name="trash" />
                  <Title type="PRIMARY">Excluir</Title>
                </Button>
                <Button onPress={onEdit}>
                  <IconMenu type="PRIMARY" name="pencil" />
                  <Title type="PRIMARY">Editar</Title>
                </Button>
              </ContainerMenu>
            </Popover.Content>
          </Popover>
        </Container>
      )}
    </>
  );
}
