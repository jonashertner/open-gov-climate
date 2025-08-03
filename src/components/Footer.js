import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useI18n } from '../i18n';
import { theme } from '../theme';

const FooterWrapper = styled.footer`
  background:${props=>props.theme.colors.footerBg}; color:${props=>props.theme.colors.footerText};
  text-align:center; padding:${props=>props.theme.spacing(3)};
`;
const Text = styled.p``;

export default function Footer(){
  const { t } = useI18n();
  return (
    <ThemeProvider theme={theme}>
      <FooterWrapper>
        <Text>{t.footer}</Text>
      </FooterWrapper>
    </ThemeProvider>
  );
}
