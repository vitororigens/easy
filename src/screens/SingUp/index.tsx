import { useState } from "react";
import { Button } from "../../components/Button";
import { ButtonIcon } from "../../components/ButtonIcon";
import { Input } from "../../components/Input";
import auth from "@react-native-firebase/auth";
import { Container, Content, ContentIcon, Divider, Span, SubTitle, Text, Title } from "./styles";
import { useNavigation } from "@react-navigation/native";
import { Toast } from "react-native-toast-notifications";
import { useTheme } from "styled-components/native";
import { ActivityIndicator } from "react-native";
import { database } from "../../services";

export function SingUp() {
    const { COLORS } = useTheme()
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [errors, setErrors] = useState({
        nameError: '',
        emailError: '',
        passwordError: '',
        confirmPasswordError: ''
    });
    console.log(user)

    function validateForm() {
        let isValid = true;

        if (!user.name.trim().includes(' ')) {
            setErrors(prevState => ({
                ...prevState,
                nameError: 'O nome completo deve conter pelo menos um sobrenome.'
            }));
            isValid = false;
        } else {
            setErrors(prevState => ({ ...prevState, nameError: '' }));
        }

        if (!/\S+@\S+\.\S+/.test(user.email)) {
            setErrors(prevState => ({
                ...prevState,
                emailError: 'O email deve ser válido.'
            }));
            isValid = false;
        } else {
            setErrors(prevState => ({ ...prevState, emailError: '' }));
        }

        if (user.password.length < 6) {
            setErrors(prevState => ({
                ...prevState,
                passwordError: 'A senha deve conter pelo menos 6 caracteres.'
            }));
            isValid = false;
        } else {
            setErrors(prevState => ({ ...prevState, passwordError: '' }));
        }

        if (user.password !== user.confirmPassword) {
            setErrors(prevState => ({
                ...prevState,
                confirmPasswordError: 'As senhas não coincidem.'
            }));
            isValid = false;
        } else {
            setErrors(prevState => ({ ...prevState, confirmPasswordError: '' }));
        }

        return isValid;
    }

    function handleRegister() {
        setIsLoading(true);
        if (validateForm()) {
            auth()
                .createUserWithEmailAndPassword(user.email, user.password)
                .then((userCredential) => {
                    const { uid } = userCredential.user;
                    userCredential.user.updateProfile({
                        displayName: user.name
                    }).then(() => {
                        Toast.show("Conta cadastrada com sucesso!", { type: 'success' });
                        database
                            .collection('Tasks')
                            .doc(uid) 
                            .set({
                                revenue: 0,
                                expense: 0,
                            })
                            .then(() => {
                                console.log('Task adicionada!');
                            })
                            .catch(error => {
                                console.error('Erro ao adicionar a tarefa: ', error);
                            });

                    });
                })
                .catch((error) => {
                    console.error("Erro ao criar conta:", error);
                    Toast.show("Não foi possível cadastrar sua conta, verifique.", { type: 'danger' });
                })
                .finally(() => {
                    setIsLoading(false);
                    setUser({
                        ...user,
                        name: '',
                        email: '',
                        password: '',
                        confirmPassword: ''
                    });
                });
        } else {
            setIsLoading(false);
        }
    }


    return (
        <Container>
            <Title>
                Entre e faça o controle de suas <Span>finanças pessoais</Span>.
            </Title>
            {errors.nameError && <Text style={{ color: COLORS.RED_700, marginBottom: 10, marginLeft: 10 }}>{errors.nameError}</Text>}
            <Input name="user" value={user.name} onChangeText={name => setUser({ ...user, name })} showIcon placeholder="Nome" />
            {errors.emailError && <Text style={{ color: COLORS.RED_700, marginBottom: 10, marginLeft: 10 }}>{errors.emailError}</Text>}
            <Input name="envelope" value={user.email} onChangeText={email => setUser({ ...user, email })} showIcon placeholder="Email" />
            {errors.passwordError && <Text style={{ color: COLORS.RED_700, marginBottom: 10, marginLeft: 10 }}>{errors.passwordError}</Text>}
            <Input name="lock" value={user.password} onChangeText={password => setUser({ ...user, password })} showIcon placeholder="Senha" passwordType />
            {errors.confirmPasswordError && <Text style={{ color: COLORS.RED_700, marginBottom: 10, marginLeft: 10 }}>{errors.confirmPasswordError}</Text>}
            <Input name="lock" value={user.confirmPassword} onChangeText={confirmPassword => setUser({ ...user, confirmPassword })} showIcon placeholder="Confirme a sua senha" passwordType />
            <Button title={isLoading ? <ActivityIndicator /> : "Cadastrar"} onPress={handleRegister} disabled={isLoading} />
            {/* <Content>
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
            </ContentIcon> */}
        </Container>
    );
}