import React, { useState } from 'react';
import { TextInputProps } from 'react-native';
import { Button, Container, Icon, IconInput, InputContainer, ErrorText, InputWrapper } from './style';

type InputProps = TextInputProps & {
  placeholder: string;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  editable?: boolean;
  required?: boolean;
  passwordType?: boolean;
  showSearch?: boolean;
  showPlus?: boolean;
  onPress?: () => void;
  showIcon?: boolean;
  name?: string;
  value: string;
  error?: string;
};

export function Input({
  placeholder,
  onChangeText,
  value,
  showSearch = false,
  passwordType = false,
  showIcon = false,
  name,
  editable = true,
  onFocus,
  error,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container>
      <InputWrapper error={!!error}>
        {showIcon && <IconInput name={name} />}

        <InputContainer
          placeholder={placeholder}
          onChangeText={onChangeText}
          onFocus={onFocus}
          secureTextEntry={!showPassword && passwordType}
          value={value}
          editable={editable}
        />
        {passwordType && (
          <Button onPress={togglePasswordVisibility}>
            <Icon name={showPassword ? 'eye' : 'eye-closed'} />
          </Button>
        )}
        {showSearch && (
          <Button onPress={togglePasswordVisibility}>
            <Icon name='search' />
          </Button>
        )}
      </InputWrapper>
      {error && <ErrorText>{error}</ErrorText>}
    </Container>
  );
}
