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
const Form = styled.form`
  display:flex; flex-direction:column;
`;
const Textarea = styled.textarea`
  width:100%; height:150px; padding:8px; margin-bottom:${props=>props.theme.spacing(2)};
  border:1px solid #ccc; border-radius:4px;
`;
const Button = styled.button`
  width:120px; padding:8px; font-size:1rem; background:#000; color:#fff; border:none; border-radius:4px; cursor:pointer;
`;

export default function Contact(){
  const { t } = useI18n();

  const handleSubmit = e => {
    e.preventDefault();
    const formData = new URLSearchParams(new FormData(e.target));
    fetch('/', { method:'POST', headers:{ 'Content-Type':'application/x-www-form-urlencoded'}, body:formData.toString() })
      .then(()=>{ alert('Thank you!'); e.target.reset(); })
      .catch(err=>console.error(err));
  };

  return (
    <ThemeProvider theme={theme}>
      <Section id="contact">
        <Title>{t.contact.title}</Title>
        <Form name="contact" method="POST" data-netlify="true" onSubmit={handleSubmit}>
          <input type="hidden" name="form-name" value="contact" />
          <Textarea name="tip" placeholder={t.contact.placeholder} required />
          <Button type="submit">{t.contact.button}</Button>
        </Form>
      </Section>
    </ThemeProvider>
  );
}
