"use client";

import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  useCreateSignatureMutation,
  useRecreateSignatureMutation,
} from "@/features/signature/infrastructure/api/signatureApi";

export function DrawingSignaturePane({
  isRecreate,
  onSaved,
}: {
  isRecreate?: boolean;
  onSaved?: () => void;
}) {
  const sigRef = useRef<SignatureCanvas | null>(null);
  const [hasDrawn, setHasDrawn] = useState(false);

  const [createSignature, { isLoading }] = useCreateSignatureMutation();
  const [recreateSignature] = useRecreateSignatureMutation();

  const clear = () => {
    sigRef.current?.clear();
    setHasDrawn(false);
  };

  const onSave = async () => {
    const pad = sigRef.current;
    if (!pad) return;

    if (pad.isEmpty()) {
      toast.error("Bạn chưa vẽ chữ ký.");
      return;
    }

    const dataUrl = pad.getTrimmedCanvas().toDataURL("image/png");

    const tid = toast.loading("Đang lưu chữ ký...");
    try {
      const action = isRecreate ? recreateSignature : createSignature;

      await action({
        type: "DRAWN",
        signatureImageBase64: dataUrl,
      }).unwrap();

      toast.success("Đã lưu chữ ký!", { id: tid });
      onSaved?.();
      // clear(); // nếu muốn clear sau khi lưu
    } catch (err: any) {
      toast.error(err?.data?.message ?? err?.message ?? "Save failed", {
        id: tid,
      });
    }
  };

  return (
    <div className="p-0">
      <div className="w-full h-64 bg-muted rounded-xl p-2 relative">
        <Button
          type="button"
          size="icon"
          className="h-8 w-8 absolute left-2 top-2 z-10"
          variant="outline"
          onClick={clear}
          disabled={isLoading}
          title="Clear"
        >
          <Trash2 />
        </Button>

        <div className="w-full h-full rounded-lg overflow-hidden bg-background">
          <SignatureCanvas
            ref={(r) => (sigRef.current = r)}
            penColor="black"
            backgroundColor="white"
            onBegin={() => setHasDrawn(true)}
            canvasProps={{ className: "w-full h-full" }}
          />
        </div>

        {!hasDrawn && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="text-center px-6">
              <p className="text-base font-semibold">Drawing Signature</p>
              <p className="text-muted-foreground text-xs">
                Sign your Drawing Signature here. After saving, you&apos;ll be
                logged out.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={clear}
          disabled={isLoading}
        >
          Clear
        </Button>
        <Button type="button" onClick={onSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Signature"}
        </Button>
      </div>
    </div>
  );
}
