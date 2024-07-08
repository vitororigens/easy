import auth from "@react-native-firebase/auth";
import { ActivityIndicator } from "react-native";
import { Toast } from "react-native-toast-notifications";
import { useTheme } from "styled-components/native";
//
import { Container, Span, TextError, Title } from "./styles";
//
//
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";

const formSchema = z
  .object({
    name: z
      .string()
      .min(1, "O nome é obrigatório.")
      .refine(
        (value) => {
          return value.trim().split(" ").length >= 2;
        },
        {
          message: "O nome completo deve conter pelo menos um sobrenome.",
        }
      ),
    email: z
      .string()
      .min(1, "O email é obrigatório.")
      .email("Formato inválido"),
    password: z
      .string()
      .min(1, { message: "A senha é obrigatória." })
      .min(6, { message: "A senha deve conter pelo menos 6 caracteres." }),
    confirmPassword: z.string().min(1, "Confirme sua senha."),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: "As senhas não coincidem",
      path: ["confirmPassword"],
    }
  );

type FormSchemaType = z.infer<typeof formSchema>;

export function SingUp() {
  const { COLORS } = useTheme();

  // Hooks
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Functions

  function handleLogout() {
    auth()
      .signOut()
      .then(() => console.log("User signed out"));
  }

  function handleRegister({ name, email, password }: FormSchemaType) {
    auth()
      .createUserWithEmailAndPassword(email.trim(), password.trim())
      .then((userCredential) => {
        const { uid } = userCredential.user;
        userCredential.user
          .updateProfile({
            displayName: name.trim(),
          })
          .then(() => {
            Toast.show("Conta cadastrada com sucesso!", { type: "success" });
            handleLogout();
          });
      })
      .catch((error) => {
        console.error("Erro ao criar conta:", error);
        Toast.show("Não foi possível cadastrar sua conta, verifique.", {
          type: "danger",
        });
      })
      .finally(() => {
        reset();
      });
  }

  return (
    <Container>
      <Title>
        Entre e faça o controle de suas <Span>finanças pessoais</Span>.
      </Title>

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            name="user"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            showIcon
            placeholder="Nome*"
          />
        )}
      />

      {errors.name && (
        <TextError
          style={{ color: COLORS.RED_700, marginBottom: 20, marginLeft: 10 }}
        >
          {errors.name.message}
        </TextError>
      )}

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
            placeholder="Email*"
          />
        )}
      />

      {errors.email && (
        <TextError
          style={{ color: COLORS.RED_700, marginBottom: 20, marginLeft: 10 }}
        >
          {errors.email.message}
        </TextError>
      )}

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
            placeholder="Senha*"
            passwordType
          />
        )}
      />

      {errors.password && (
        <TextError
          style={{ color: COLORS.RED_700, marginBottom: 20, marginLeft: 10 }}
        >
          {errors.password.message}
        </TextError>
      )}

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            name="lock"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            showIcon
            placeholder="Confirme a sua senha*"
            passwordType
          />
        )}
      />

      {errors.confirmPassword && (
        <TextError
          style={{ color: COLORS.RED_700, marginBottom: 20, marginLeft: 10 }}
        >
          {errors.confirmPassword.message}
        </TextError>
      )}
      <Button
        title={isSubmitting ? <ActivityIndicator /> : "Cadastrar"}
        onPress={handleSubmit(handleRegister)}
        disabled={isSubmitting}
      />
    </Container>
  );
}
