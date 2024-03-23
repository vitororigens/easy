import { Modal } from 'react-native';
import { Container, ContainerButton, Title, TitleButton, Button, ModalContainer } from "./styles";

type CustomModalProps = {
    title: string;
    visible: boolean;
    onClose: () => void;
    onConfirme: () => void;
    onCancel: () => void;
    animationType: string; 
    transparent: boolean; 
}


export function CustomModal({ title, visible, onClose, onConfirme, onCancel }: CustomModalProps) {
    return (
        <Modal visible={visible} onRequestClose={onClose}>
            <Container>
             <ModalContainer>
                    <Title>{title}</Title>
                <ContainerButton>
                    <Button type="PRIMARY" onPress={() => {
                        onConfirme(); 
                        onClose(); 
                    }}>
                        <TitleButton>
                            SIM
                        </TitleButton>
                    </Button>
                    <Button type="SECONDARY" onPress={() => {
                        onCancel();
                        onClose(); 
                    }}>
                        <TitleButton>
                            Cancelar
                        </TitleButton>
                    </Button>
                </ContainerButton>
             </ModalContainer>
            </Container>
        </Modal>
    )
}
