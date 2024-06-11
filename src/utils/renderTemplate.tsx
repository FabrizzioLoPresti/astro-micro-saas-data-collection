// renderTemplate.ts
import ReactDOMServer from "react-dom/server";
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

interface EmailTemplateProps {
  email?: string;
  mercadoPagoUrl?: string;
}

const EmailTemplate = ({ email, mercadoPagoUrl }: EmailTemplateProps) => {
  const previewText = `Gracias ${email} por tu respuesta!`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>

      <Body style={main}>
        <Container style={container}>
          <Section style={{ paddingBottom: "20px" }}>
            <Row>
              <Text style={heading}>¡Gracias por tu respuesta!</Text>
              <Text style={paragraph}>
                Apreciamos mucho el tiempo que te tomaste para completar nuestro
                formulario. Para seguir ofreciéndote el mejor servicio, te
                invitamos a recibir una respuesta generada por IA sobre cómo
                llevar adelante un nuevo negocio basado en tus respuestas.
              </Text>
              <Text style={paragraph}>
                Si deseas recibir esta información en tu correo electrónico, haz
                clic en el botón de abajo que te llevará a un enlace de Mercado
                Pago para completar el proceso de pago.
              </Text>

              <Button style={button} href={mercadoPagoUrl} target="_blank">
                Obtener Ideas de Negocios
              </Button>
            </Row>
          </Section>

          <Hr style={hr} />

          <Section>
            <Row>
              <Text style={footer}>
                Muchas gracias por confiar en nosotros. Si tienes alguna
                pregunta, no dudes en contactarnos.
              </Text>
              <Text style={footer}>Micro-SaaS Ideas, Córdoba Argentina</Text>
              <Link href="[Enlace a la página de contacto]" style={reportLink}>
                Contactar Soporte
              </Link>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export const renderEmailTemplate = (props: EmailTemplateProps) => {
  return ReactDOMServer.renderToStaticMarkup(<EmailTemplate {...props} />);
};

// Styles
const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
  maxWidth: "100%",
};

const heading = {
  fontSize: "32px",
  lineHeight: "1.3",
  fontWeight: "700",
  color: "#484848",
};

const paragraph = {
  fontSize: "18px",
  lineHeight: "1.4",
  color: "#484848",
};

const button = {
  backgroundColor: "rgb(30, 64, 175)",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "18px",
  paddingTop: "19px",
  paddingBottom: "19px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
};

const reportLink = {
  fontSize: "14px",
  color: "#9ca299",
  textDecoration: "underline",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#9ca299",
  fontSize: "14px",
  marginBottom: "10px",
};
