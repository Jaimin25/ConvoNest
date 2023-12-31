import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import ProfileList from "./profiles-list";

export default function Profiles() {
  return (
    <div className="w-full flex items-center justify-center">
      <Card className="dark:bg-black/50 border-0 h-5/6 sm:h-5/6 px-4">
        <CardHeader>
          <CardTitle>Profiles</CardTitle>
        </CardHeader>
        <CardContent className="h-5/6 sm:h-5/6">
          <ProfileList />
        </CardContent>
      </Card>
    </div>
  );
}
