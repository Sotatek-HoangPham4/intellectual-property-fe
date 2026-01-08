"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Signature,
  Upload,
  File,
  Keyboard,
  Cloud,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

import { DrawingSignaturePane } from "./DrawingSignaturePane";
import {
  useDeleteSignatureMutation,
  useGetMySignatureQuery,
  useLazyGetMySignatureQuery,
} from "@/features/signature/infrastructure/api/signatureApi";

const SignatureBar = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);

  const [triggerGetMySignature, getState] = useLazyGetMySignatureQuery();
  const [deleteSignature, { isLoading: deleting }] =
    useDeleteSignatureMutation();

  const { data: mySignature, isFetching: checkingSignature } =
    useGetMySignatureQuery();

  const signature = getState.data;

  const onGetSignature = async () => {
    const tid = toast.loading("Đang tải chữ ký...");
    try {
      const res = await triggerGetMySignature().unwrap();
      toast.success("Đã tải chữ ký!", { id: tid });

      if (!res) {
        toast("Bạn chưa có chữ ký. Hãy tạo chữ ký trước.");
        return;
      }
      setOpenPreview(true);
    } catch (err: any) {
      toast.error(
        err?.data?.message ?? err?.message ?? "Get signature failed",
        { id: tid }
      );
    }
  };

  const onDeleteSignature = async () => {
    const tid = toast.loading("Đang xoá chữ ký...");
    try {
      await deleteSignature().unwrap();
      toast.success("Đã xoá chữ ký!", { id: tid });
      setOpenPreview(false);
    } catch (err: any) {
      toast.error(err?.data?.message ?? err?.message ?? "Delete failed", {
        id: tid,
      });
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Create Signature */}
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="h-20 w-36 flex-col items-start gap-4"
            disabled={checkingSignature}
          >
            <Plus />
            <p>Create Signature</p>
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px] lg:max-w-[540px]">
          <DialogHeader>
            <DialogTitle>Create Your Signature</DialogTitle>
            <DialogDescription>
              Chọn cách tạo chữ ký. Tab Draw sẽ lưu chữ ký dạng ảnh.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="draw">
            <TabsList>
              <TabsTrigger value="draw">
                <Signature /> Draw
              </TabsTrigger>
              <TabsTrigger value="type">
                <Keyboard /> Type
              </TabsTrigger>
              <TabsTrigger value="upload">
                <Upload /> Upload
              </TabsTrigger>
              <TabsTrigger value="cloud">
                <Cloud /> Cloud
              </TabsTrigger>
            </TabsList>

            <TabsContent value="draw">
              <Card className="p-0 shadow-none border-none">
                <DrawingSignaturePane
                  isRecreate={!!mySignature}
                  onSaved={() => {
                    // sau khi save, bạn có thể đóng dialog hoặc reload preview
                    setOpenCreate(false);
                  }}
                />
              </Card>
            </TabsContent>

            <TabsContent value="type">
              <div className="py-6 text-sm text-muted-foreground">
                (Chưa implement) Tab TYPE: bạn có thể tạo signature HTML rồi
                render thành ảnh.
              </div>
            </TabsContent>

            <TabsContent value="upload">
              <div className="py-6 text-sm text-muted-foreground">
                (Chưa implement) Tab UPLOAD: chọn file PNG/JPG, upload lên BE.
              </div>
            </TabsContent>

            <TabsContent value="cloud">
              <div className="py-6 text-sm text-muted-foreground">
                (Chưa implement) Tab CLOUD: lấy chữ ký từ cloud storage.
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Get Signature */}
      <Button
        variant="outline"
        className="h-20 w-36 flex-col items-start gap-4"
        onClick={onGetSignature}
        disabled={getState.isFetching}
      >
        <File />
        <p>{getState.isFetching ? "Loading..." : "Get Signature"}</p>
      </Button>

      {/* Sign Documents (giữ nguyên, bạn tự handle) */}
      <Button
        variant="outline"
        className="h-20 w-36 flex-col items-start gap-4"
      >
        <Signature />
        <p>Sign Documents</p>
      </Button>

      {/* Preview Signature Dialog */}
      <Dialog open={openPreview} onOpenChange={setOpenPreview}>
        <DialogContent className="sm:max-w-[540px]">
          <DialogHeader>
            <DialogTitle>My Signature</DialogTitle>
            <DialogDescription>
              Xem trước chữ ký hiện tại của bạn.
            </DialogDescription>
          </DialogHeader>

          {!signature ? (
            <div className="text-sm text-muted-foreground">
              Không có chữ ký.
            </div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-lg border bg-muted p-3">
                {/* ưu tiên imageUrl, fallback base64 */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    signature.imageUrl ?? signature.signatureImageBase64 ?? ""
                  }
                  alt="signature"
                  className="w-full h-54 object-contain bg-white rounded-md"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onDeleteSignature}
                  disabled={deleting}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {deleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SignatureBar;
