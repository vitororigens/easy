import { DefaultContainer } from "../../components/DefaultContainer";
import { ItemNotification } from "../../components/ItemNotification";

export function Notifications(){
    return(
        <DefaultContainer title="Notificações" backButton>
            <ItemNotification title="Conta compartilhada" subtitle="Pedro compartilhou conta de Luz com você!" span="`13 Set * 11:23"/>
        </DefaultContainer>
    )
}