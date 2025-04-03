import { useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";
import { ActivityIndicator } from "react-native";
import { Toast } from "react-native-toast-notifications";
import { useTheme } from "styled-components/native";
import { Container, Span, TextError, Title } from "./styles";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { database } from "../../libs/firebase";

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
    userName: z.string().min(1, "Nome de usuario é obrigatorio"),
    email: z
      .string()
      .min(1, "O email é obrigatório.")
      .email("Formato de email inválido"),
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
  const [usernameExists, setUsernameExists] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const checkUsernameExists = async (username: string) => {
    const userRef = database.collection("User");
    const snapshot = await userRef.where("userName", "==", username).get();
    return !snapshot.empty;
  };

  const userName = watch("userName");

  useEffect(() => {
    const checkUsername = async () => {
      if (userName) {
        const exists = await checkUsernameExists(userName.trim());
        setUsernameExists(exists);
      } else {
        setUsernameExists(false);
      }
    };

    checkUsername();
  }, [userName]);

  function handleLogout() {
    auth()
      .signOut()
      .then(() => console.log("User signed out"));
  }

  function handleRegister({ name, email, password, userName }: FormSchemaType) {
    if (usernameExists) {
      Toast.show("Nome de usuário já existe.", { type: "danger" });
      return;
    }

    auth()
      .createUserWithEmailAndPassword(email.trim(), password.trim())
      .then((userCredential) => {
        const { uid } = userCredential.user;
        userCredential.user
          .updateProfile({
            displayName: name.trim(),
          })
          .then(() => {
            database.collection("User").doc(uid).set({
              userName: userName.trim(),
              uid,
            });
            Toast.show("Conta cadastrada com sucesso!", { type: "success" });
          });
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          Toast.show("O email já está em uso por outra conta.", {
            type: "danger",
          });
        } else {
          console.error("Erro ao criar conta:", error);
          Toast.show("Não foi possível cadastrar sua conta, verifique.", {
            type: "danger",
          });
        }
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
        name="userName"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            name="user"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            showIcon
            placeholder="Nome de Usuario*"
          />
        )}
      />

      {usernameExists && (
        <TextError
          style={{ color: COLORS.RED_700, marginBottom: 20, marginLeft: 10 }}
        >
          Nome de usuário já existe.
        </TextError>
      )}

      {errors.userName && (
        <TextError
          style={{ color: COLORS.RED_700, marginBottom: 20, marginLeft: 10 }}
        >
          {errors.userName.message}
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
        disabled={isSubmitting || usernameExists}
      />
    </Container>
  );
}
