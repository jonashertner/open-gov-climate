import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useI18n } from '../i18n';
import { theme } from '../theme';

const Section = styled.section`
  background:#fafafa; text-align:center; padding:${props=>props.theme.spacing(4)} 0; border-bottom:1px solid #e5e5e5; font-size:1.1rem;
`;

export default function Banner(){
  const { t } = useI18n();
  return (
    <ThemeProvider theme={theme}>
      <Section>{t.banner}</Section>
    </ThemeProvider>
  );
}
