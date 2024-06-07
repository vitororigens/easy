import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { Toast } from "react-native-toast-notifications";
//
import { ButtonForgetPassword, Container, Span, Text, Title } from "./styles";
//
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";

const formSchema = z.object({
  email: z.string().email("Formato inválido").min(1, "Email é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

type FormSchemaType = z.infer<typeof formSchema>;

export function SingIn() {
  const navigation = useNavigation();

  // Hooks
  const { control, handleSubmit, reset } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Functions
  function handleForgetPassword() {
    navigation.navigate("forgetPassword");
  }
  function handleSingIn({ email, password }: FormSchemaType) {
    auth()
      .signInWithEmailAndPassword(email.trim(), password.trim())
      .then(() => {
        Toast.show("Login realizado com sucesso!", { type: "success" });
        reset();
        navigation.navigate("tabroutes");
      })
      .catch(() =>
        Toast.show("Verifique se seu e-mail ou senha estão corretos.", {
          type: "danger",
        })
      );
  }

  const onInvalid = () => {
    Toast.show("Por favor, preencha todos os campos.", { type: "danger" });
  };

  return (
    <Container>
      <Title>
        Entre e faça o controle de suas <Span>finanças pessoais</Span>.
      </Title>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            name="envelope"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            showIcon
            placeholder="Email"
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            name="lock"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            showIcon
            placeholder="Senha"
            passwordType
          />
        )}
      />

      <Button
        title={"Entrar"}
        onPress={handleSubmit(handleSingIn, onInvalid)}
      />
      <ButtonForgetPassword onPress={handleForgetPassword}>
        <Text>Esqueceu a senha?</Text>
      </ButtonForgetPassword>
    </Container>
  );
}
