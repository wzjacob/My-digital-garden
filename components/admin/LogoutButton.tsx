"use client";

import { adminLogout } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <form action={adminLogout}>
      <Button type="submit" variant="ghost" size="sm" className="text-muted-foreground">
        <LogOut className="h-4 w-4 mr-1.5" />
        登出
      </Button>
    </form>
  );
}
