import React, { useState } from 'react';
import { Container, CustomSwitch, Title } from './styles';

type SwitchProps = {
  title?: string;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
};

export function Switch({ title, onValueChange, value, disabled }: SwitchProps) {
  
  return (
    <Container>
      <CustomSwitch 
        onValueChange={onValueChange}
        value={value}
        disabled={disabled}
      />
      <Title>
        {title}
      </Title>
    </Container>
  );
}
