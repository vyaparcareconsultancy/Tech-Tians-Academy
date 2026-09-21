"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export default function SettingsPage() {
  const { addToast } = useToast();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      type: "success",
      title: "Settings Saved",
      message: "Academy global settings have been successfully updated.",
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Academy Settings</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Platform branding, backend integrations, notifications, and permissions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organization Info</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <Input label="Academy Name" defaultValue="Tech Tians Academy" />
            <Input label="Support Email" defaultValue="support@techtians.com" />
            <Input label="Backend NestJS API Base" defaultValue="http://localhost:4000/api/v1" />
            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
