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
const List = styled.ul`
  list-style:none; padding:0; margin:0;
`;
const Item = styled.li`
  margin-bottom:${props=>props.theme.spacing(1)};
`;
const Link = styled.a`
  color:${props=>props.theme.colors.primary};
`;

export default function Disclosures(){
  const { t } = useI18n();
  return (
    <ThemeProvider theme={theme}>
      <Section>
        <Title>{t.disclosures.title}</Title>
        <List>
          {t.disclosures.items.map((item,i)=>(
            <Item key={i}><Link href={item.url}>{item.text}</Link></Item>
          ))}
        </List>
      </Section>
    </ThemeProvider>
  );
}
