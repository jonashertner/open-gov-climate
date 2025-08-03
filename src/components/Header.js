import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useI18n } from '../i18n';
import { theme } from '../theme';

const HeaderWrapper = styled.header`
  position: sticky; top:0; background:${props=>props.theme.background}; border-bottom:1px solid #e5e5e5; z-index:100;
`;
const Nav = styled.nav`
  max-width:900px; margin:0 auto; padding: ${props=>props.theme.spacing(2)}; display:flex; justify-content:space-between; align-items:center;
`;
const Logo = styled.div`
  font-size:1.5rem; font-weight:bold;
`;
const Links = styled.div`
  display:flex; align-items:center;
`;
const Link = styled.a`
  margin-left: ${props=>props.theme.spacing(3)}; font-weight:500; cursor:pointer;
`;
const Select = styled.select`
  margin-left: ${props=>props.theme.spacing(2)}; padding:4px; font-size:0.9rem;
`;

export default function Header() {
  const { t, lang, setLang } = useI18n();
  return (
    <ThemeProvider theme={theme}>
      <HeaderWrapper>
        <Nav>
          <Logo>Open Gov Climate</Logo>
          <Links>
            <Link href="#foia">{t.header.foia}</Link>
            <Link href="/articles">{t.header.articles}</Link>
            <Select value={lang} onChange={e=>setLang(e.target.value)}>
              <option value="en">EN</option>
              <option value="de">DE</option>
              <option value="fr">FR</option>
              <option value="it">IT</option>
            </Select>
          </Links>
        </Nav>
      </HeaderWrapper>
    </ThemeProvider>
);
}
