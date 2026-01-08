"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HomePage = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back! Here’s what’s happening today.
          </p>
        </div>

        <Button>Create document</Button>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">238</p>
            <p className="text-xs text-muted-foreground">
              Total documents in system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Signatures</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">12</p>
            <p className="text-xs text-muted-foreground">Waiting for signers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organizations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">4</p>
            <p className="text-xs text-muted-foreground">You are a member of</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
