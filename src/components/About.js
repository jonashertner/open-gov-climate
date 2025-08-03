import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useI18n } from '../i18n';
import { theme } from '../theme';

const Section = styled.section`
  padding:${props=>props.theme.spacing(4)} 16px;
`;
const Title = styled.h2`
  font-size:1.5rem; margin-bottom:${props=>props.theme.spacing(2)};
`;
const Text = styled.p``;

export default function About(){
  const { t } = useI18n();
  return (
    <ThemeProvider theme={theme}>
      <Section id="about">
        <Title>{t.about.title}</Title>
        <Text>{t.about.text}</Text>
      </Section>
    </ThemeProvider>
  );
}
