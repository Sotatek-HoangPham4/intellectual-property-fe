import React from "react";
import SignatureBar from "./SignatureBar";
import { AppWindowIcon, CodeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignatureTable } from "./SignatureTable";

const SignaturePageLayout = () => {
  return (
    <div className="">
      <div className="p-6 space-y-6">
        <SignatureBar />
        <div className="min-h-screen w-full bg-white border rounded-lg p-4 flex flex-col">
          {/* <DocumentSection title="Recent documents" />
          <DocumentSection title="Share with you" /> */}

          <p className="text-lg font-semibold">Signatures</p>
          <SignatureTable />
        </div>
      </div>
    </div>
  );
};

export default SignaturePageLayout;
