import { AuthWrapper } from "@app/components/auth/auth-wrapper";
import { SettingContent } from "@app/components/settings/setting-content";
import { Suspense } from "react";

export default function SettingsPage() {
  return (
    <Suspense>
      <AuthWrapper>
        <SettingContent />
      </AuthWrapper>
    </Suspense>
  );
}
