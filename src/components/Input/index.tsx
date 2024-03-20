import React, { useState } from "react";
import { TextInputProps } from "react-native";
import { Button, Container, Icon, IconInput, InputContainer } from "./style";

type InputProps = TextInputProps & {
    placeholder: string;
    onChangeText?: (text: string) => void;
    required?: boolean;
    passwordType?: boolean;
    showSearch?: boolean;
    showIcon?: boolean;
    name: string;
    value: string;
}

export function Input({ placeholder, onChangeText, value, showSearch = false, passwordType = false, showIcon = false, name }: InputProps) {
    const [showPassword, setShowPassword] = useState(false);



    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Container>
            {showIcon && (
               <IconInput name={name}/>
            )}
          
            <InputContainer
                placeholder={placeholder}
                onChangeText={onChangeText}
                secureTextEntry={!showPassword && passwordType}
                value={value}
            />
            {passwordType && (
                <Button onPress={togglePasswordVisibility}>
                    <Icon name={showPassword ? 'eye' : 'eye-closed'} />
                </Button>
            )}
            {showSearch && (
                <Button onPress={togglePasswordVisibility}>
                    <Icon name="search" />
                </Button>
            )}
        </Container>
    );
}
