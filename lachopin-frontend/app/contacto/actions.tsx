"use server";

import { Resend } from "resend";
import { ContactTemplate } from "@/components/emails/ContactTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { error: "Por favor completa todos los campos." };
  }

  try {
    const { data, error } = await resend.emails.send({
      // Cambiar a "LaChopin <hola@lachopin.com>" cuando verifiques tu dominio en Resend
      from: "LaChopin <onboarding@resend.dev>",
      to: ["hola@lachopin.com"],
      replyTo: email,
      subject: `Nuevo mensaje de ${name}`,
      react: <ContactTemplate name={name} email={email} message={message} />,
    });

    if (error) {
      console.error("Error API Resend:", error);
      return { error: "No se pudo enviar el mensaje. Intenta más tarde." };
    }

    return { success: true };
  } catch (error) {
    console.error("Error crítico:", error);
    return { error: "Error interno del servidor." };
  }
}