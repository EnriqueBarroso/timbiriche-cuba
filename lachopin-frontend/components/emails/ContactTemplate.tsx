// src/components/emails/ContactTemplate.tsx
import * as React from 'react';

interface ContactTemplateProps {
  name: string;
  email: string;
  message: string;
}

// ❌ INCORRECTO (Lo que causa el error):
// export default async function ContactTemplate(...) { ... }

// ✅ CORRECTO (Síncrono):
export const ContactTemplate: React.FC<Readonly<ContactTemplateProps>> = ({
  name,
  email,
  message,
}) => (
  <div style={{ fontFamily: 'sans-serif', padding: '20px', color: '#333' }}>
    <h1 style={{ color: '#2563eb' }}>Nuevo mensaje - LaChopin</h1>
    <p><strong>De:</strong> {name} ({email})</p>
    <hr style={{ borderColor: '#eee', margin: '20px 0' }} />
    <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
      {message}
    </p>
  </div>
);

export default ContactTemplate;