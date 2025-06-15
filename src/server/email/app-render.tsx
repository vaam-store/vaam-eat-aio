import { VerificationEmail } from "@app/server/email/templates/VerificationEmail";
import { render } from "@react-email/render";
import { WelcomeEmail } from "@app/server/email/templates/WelcomeEmail";

export type AppEmailTemplate =
  | {
      type: "email-verification";
      verificationLink: string;
    }
  | {
      type: "welcome-user";
      userName: string;
    };

export function helper(data: AppEmailTemplate) {
  switch (data.type) {
    case "email-verification":
      return <VerificationEmail verificationLink={data.verificationLink} />;
    case "welcome-user":
      return <WelcomeEmail userName={data.userName} />;
  }
}

export function appRender(data: AppEmailTemplate) {
  const node = helper(data);
  return render(node);
}
