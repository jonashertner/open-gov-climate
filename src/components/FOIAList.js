import React, { useState, useEffect } from 'react';
import lunr from 'lunr';
import styled, { ThemeProvider } from 'styled-components';
import { useI18n } from '../i18n';
import { theme } from '../theme';

const Section = styled.section`
  padding:${props=>props.theme.spacing(4)} 16px;
`;
const Title = styled.h2`
  font-size:1.5rem; margin-bottom:${props=>props.theme.spacing(2)};
`;
const SearchInput = styled.input`
  width:100%; padding:8px; font-size:1rem; margin-bottom:${props=>props.theme.spacing(3)};
  border:1px solid #ccc; border-radius:4px;
`;
const List = styled.div``;
const Entry = styled.div`
  margin-bottom:${props=>props.theme.spacing(4)};
  border-bottom:1px solid #eee; padding-bottom:${props=>props.theme.spacing(2)};
`;
const EntryTitle = styled.h3`
  font-size:1.25rem; margin-bottom:${props=>props.theme.spacing(1)};
`;
const TabBar = styled.div`
  margin-bottom:${props=>props.theme.spacing(1)};
`;
const TabButton = styled.button`
  background:transparent; border:none; padding:4px 8px; margin-right:8px; font-size:0.9rem; cursor:pointer;
  ${props=>props.active?'font-weight:bold; text-decoration:underline;':''}
`;
const Paragraph = styled.p`
  margin-bottom:${props=>props.theme.spacing(1)};
`;
const LinkStyled = styled.a`
  color:${props=>props.theme.colors.primary}; display:block; margin-bottom:${props=>props.theme.spacing(1)};
`;

export default function FOIAList(){
  const { t } = useI18n();
  const [data, setData] = useState([]);
  const [index, setIndex] = useState(null);
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(()=>{
    fetch('/data/foia.json')
      .then(r=>r.json())
      .then(items=>{
        setData(items);
        const idx = lunr(function(){
          this.ref('id'); this.field('title'); this.field('summary'); this.field('request'); this.field('response');
          items.forEach(item=>this.add({
            id:item.id, title:item.title.en, summary:item.summary.en,
            request:item.request_text, response:item.response_text
          }));
        });
        setIndex(idx);
        setResults(items);
      });
  },[]);

  useEffect(()=>{
    if(index && search){
      try{
        const matched = index.search(search)
          .map(r=>data.find(d=>d.id===r.ref))
          .filter(Boolean);
        setResults(matched);
      } catch {
        setResults(data);
      }
    } else {
      setResults(data);
    }
  }, [search, index, data]);

  return (
    <ThemeProvider theme={theme}>
      <Section id="foia">
        <Title>{t.header.foia}</Title>
        <SearchInput
          type="text" placeholder={t.foia.searchPlaceholder}
          value={search} onChange={e=>setSearch(e.target.value)}
        />
        <List>
          {results.map(item=>(
            <Entry key={item.id}>
              <FOIAEntry entry={item} t={t.foia} />
            </Entry>
          ))}
        </List>
      </Section>
    </ThemeProvider>
  );
}

function FOIAEntry({entry, t}) {
  const [lang, setLang] = useState('en');
  return (
    <>
      <EntryTitle>{entry.title[lang]}</EntryTitle>
      <TabBar>
        {['en','de','fr','it'].map(l=>(
          <TabButton key={l} active={l===lang} onClick={()=>setLang(l)}>
            {l.toUpperCase()}
          </TabButton>
        ))}
      </TabBar>
      <Paragraph>{entry.summary[lang]}</Paragraph>
      <Paragraph><strong>{t.requestLabel}:</strong> {entry.request_text.slice(0,150)}...</Paragraph>
      <LinkStyled href={entry.request_pdf}>{t.downloadRequest}</LinkStyled>
      <Paragraph><strong>{t.responseLabel}:</strong> {entry.response_text.slice(0,150)}...</Paragraph>
      <LinkStyled href={entry.response_pdf}>{t.downloadResponse}</LinkStyled>
    </>
  );
}
