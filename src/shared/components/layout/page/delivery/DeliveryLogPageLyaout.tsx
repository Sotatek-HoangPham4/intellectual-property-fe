import React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DeliveryTable } from "./DeliveryTable";
import Image from "next/image";

const DeliveryPageLayout = () => {
  return (
    <div className="">
      <div className="p-6 space-y-6">
        <div className="min-h-screen w-full bg-white border rounded-lg p-4 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Image src={"/icons/file.png"} alt="file" width={30} height={30} />
            <p className="text-lg font-semibold">Financial Overview Report</p>
          </div>

          <div className="">
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPageLayout;
