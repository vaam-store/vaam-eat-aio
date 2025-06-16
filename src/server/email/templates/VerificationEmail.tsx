import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Section,
  Text,
} from "@react-email/components";
import React from "react";

interface VerificationEmailProps {
  verificationLink: string;
}

export const VerificationEmail = ({
  verificationLink,
}: VerificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Text style={heading}>Verify your email address</Text>
            <Text style={paragraph}>
              Please click the button below to verify your email address.
            </Text>
            <Section style={buttonContainer}>
              <Button style={button} href={verificationLink}>
                Verify Email
              </Button>
            </Section>
            <Text style={footer}>This link will expire in 1 hour.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  border: "1px solid #e6e6e6",
  borderRadius: "4px",
  maxWidth: "500px",
};

const box = {
  padding: "0 48px",
};

const heading = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "400",
  color: "#488aec",
  textAlign: "center" as const,
};

const paragraph = {
  fontSize: "15px",
  lineHeight: "1.4",
  color: "#444",
  marginTop: "20px",
  textAlign: "center" as const,
};

const buttonContainer = {
  textAlign: "center" as const,
  marginTop: "30px",
};

const button = {
  backgroundColor: "#488aec",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "10px 20px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  marginTop: "20px",
  textAlign: "center" as const,
};
