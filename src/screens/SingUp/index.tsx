import { ActivityIndicator } from "react-native";
import auth from "@react-native-firebase/auth";
import { useState } from "react";
import { Toast } from "react-native-toast-notifications";
import { useTheme } from "styled-components/native";
//
import { Container, Span, Text, Title } from "./styles";
//
import { database } from "../../services";
//
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";

export function SingUp() {
    const { COLORS } = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({
        nameError: '',
        emailError: '',
        passwordError: '',
        confirmPasswordError: ''
    });

    function validateForm() {
        let isValid = true;

        if (!user.name.trim()) {
            setErrors(prevState => ({
                ...prevState,
                nameError: 'O nome é obrigatório.'
            }));
            isValid = false;
        } else if (!user.name.trim().includes(' ')) {
            setErrors(prevState => ({
                ...prevState,
                nameError: 'O nome completo deve conter pelo menos um sobrenome.'
            }));
            isValid = false;
        } else {
            setErrors(prevState => ({ ...prevState, nameError: '' }));
        }

        if (!user.email.trim()) {
            setErrors(prevState => ({
                ...prevState,
                emailError: 'O email é obrigatório.'
            }));
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(user.email)) {
            setErrors(prevState => ({
                ...prevState,
                emailError: 'O email deve ser válido.'
            }));
            isValid = false;
        } else {
            setErrors(prevState => ({ ...prevState, emailError: '' }));
        }

        if (!user.password.trim()) {
            setErrors(prevState => ({
                ...prevState,
                passwordError: 'A senha é obrigatória.'
            }));
            isValid = false;
        } else if (user.password.length < 6) {
            setErrors(prevState => ({
                ...prevState,
                passwordError: 'A senha deve conter pelo menos 6 caracteres.'
            }));
            isValid = false;
        } else {
            setErrors(prevState => ({ ...prevState, passwordError: '' }));
        }

        if (!user.confirmPassword.trim()) {
            setErrors(prevState => ({
                ...prevState,
                confirmPasswordError: 'Confirme sua senha.'
            }));
            isValid = false;
        } else if (user.password.trim() !== user.confirmPassword.trim()) {
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

    function handleLogout() {
        auth()
          .signOut()
          .then(() => console.log('User signed out'));
    }

    function handleRegister() {
        setIsLoading(true);
        if (validateForm()) {
            auth()
                .createUserWithEmailAndPassword(user.email.trim(), user.password.trim())
                .then((userCredential) => {
                    const { uid } = userCredential.user;
                    userCredential.user.updateProfile({
                        displayName: user.name.trim()
                    }).then(() => {
                        Toast.show("Conta cadastrada com sucesso!", { type: 'success' });
                        handleLogout()
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
            
            <Input 
                name="user" 
                value={user.name} 
                onChangeText={name => setUser({ ...user, name })} 
                showIcon 
                placeholder="Nome*" 
            />
            {errors.nameError && <Text style={{ color: COLORS.RED_700, marginBottom: 20, marginLeft: 10 }}>{errors.nameError}</Text>}
            <Input 
                name="envelope" 
                value={user.email} 
                onChangeText={email => setUser({ ...user, email })} 
                showIcon 
                placeholder="Email*" 
            />
            {errors.emailError && <Text style={{ color: COLORS.RED_700, marginBottom: 20, marginLeft: 10 }}>{errors.emailError}</Text>}
            <Input 
                name="lock" 
                value={user.password} 
                onChangeText={password => setUser({ ...user, password })} 
                showIcon 
                placeholder="Senha*" 
                passwordType 
            />
            {errors.passwordError && <Text style={{ color: COLORS.RED_700, marginBottom: 20, marginLeft: 10 }}>{errors.passwordError}</Text>}
            <Input 
                name="lock" 
                value={user.confirmPassword} 
                onChangeText={confirmPassword => setUser({ ...user, confirmPassword })} 
                showIcon 
                placeholder="Confirme a sua senha*" 
                passwordType 
            />
            {errors.confirmPasswordError && <Text style={{ color: COLORS.RED_700, marginBottom: 20, marginLeft: 10 }}>{errors.confirmPasswordError}</Text>}
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
