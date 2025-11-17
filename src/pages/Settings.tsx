import { useState } from "react";
import AppShell from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AcademicBanner from "@/components/AcademicBanner";

const Settings = () => {
  const [organizationName, setOrganizationName] = useState("ElixrLabs");
  const [userEmail] = useState("user@elixrlabs.com");

  return (
    <AppShell>
      <div className="p-6 space-y-6 max-w-2xl">
        <div>
          <h1 className="mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        <Card className="p-6">
          <h3 className="mb-4">Organization Information</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="organizationName">Organization Name</Label>
              <Input
                id="organizationName"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={userEmail} disabled />
              <p className="text-xs text-muted-foreground mt-1">
                Contact information
              </p>
            </div>
          </div>
        </Card>
      </div>
      <AcademicBanner />
    </AppShell>
  );
};

export default Settings;
