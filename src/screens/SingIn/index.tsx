import { Toast } from "react-native-toast-notifications";
import { Button } from "../../components/Button";
import { ButtonIcon } from "../../components/ButtonIcon";
import { Input } from "../../components/Input";
import auth from "@react-native-firebase/auth";
import { Container, Content, ContentIcon, Divider, Span, SubTitle, Text, Title } from "./styles";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

export function SingIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigation = useNavigation()

    function handleRegister() {
        navigation.navigate('home')
    }
    function handleSingIn() {
        if (!email || !password) {
            Toast.show('Por favor, preencha todos os campos.', { type: 'danger' });
            return;
        }

        auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
                Toast.show('Login realizado com sucesso!', { type: 'success' })
                setEmail("")
                setPassword("")
                handleRegister()
                
            })
            .catch(() => Toast.show('Verifique se seu e-mail ou senha estão corretos.', { type: 'danger' }))
    }
    return (
        <Container>
            <Title>
                Entre e faça o controle de suas <Span>finanças pessoais</Span>.
            </Title>
            <Input name="envelope" value={email} onChangeText={setEmail} showIcon placeholder="Email" />
            <Input name="lock" value={password} onChangeText={setPassword}  showIcon  placeholder="Senha" passwordType />
            <Button title={'Entrar'} onPress={handleSingIn} />
            <Text>
                Esqueceu a senha?
            </Text>
            <Content>
                <Divider />
                <SubTitle>
                    Conect-se
                </SubTitle>
                <Divider />
            </Content>
            <ContentIcon>
                <ButtonIcon name="microsoft" color="#00a1f1" />
                <ButtonIcon name="apple" color="#7200b5" />
                <ButtonIcon name="google" color="#dc3c2a" />
                <ButtonIcon name="facebook" color="#0863f7" />
            </ContentIcon>
        </Container>
    )
}