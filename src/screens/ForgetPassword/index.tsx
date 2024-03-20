import { Toast } from "react-native-toast-notifications";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import auth from "@react-native-firebase/auth";
import { Container, LogoContainer, Span, Title } from "./styles";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { DefaultContainer } from "../../components/DefaultContainer";
import { Logo } from "../../components/Logo";

export function ForgetPassword() {
    const [email, setEmail] = useState("");
    const navigation = useNavigation()

    function handleRegister() {
        navigation.navigate('login')
    }
    function handleForgetPassword() {


        auth()
            .sendPasswordResetEmail(email)
            .then(() => {
                Toast.show('Um link foi enviado ao seu email', { type: 'success' })
                setEmail("")

                handleRegister()

            })
            .catch(() => Toast.show('Verifique se seu e-mail está correto.', { type: 'danger' }))
    }
    return (
        <DefaultContainer backButton>
            <Container>
                <Title>
                    Digite seu email para podermos enviar um link de recuperação de senha!
                </Title>
                <Input name="envelope" value={email} onChangeText={setEmail} showIcon placeholder="Email" />

                <Button title={'Enviar'} onPress={handleForgetPassword} />


            </Container>
            <LogoContainer>
                <Logo />
            </LogoContainer>
        </DefaultContainer>
    )
}