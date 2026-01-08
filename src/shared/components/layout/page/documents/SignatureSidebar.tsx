"use client";

import React from "react";
import {
  BriefcaseBusiness,
  Building,
  Calendar,
  CaseSensitive,
  Mail,
  Signature,
  User,
  UserPlus,
  X,
  Trash2,
} from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  UserSearchItem,
  useSearchUsersByEmailQuery,
} from "@/features/user/infrastructure/api/userApi";

/* =========================
   Utils
========================= */
function useDebouncedValue<T>(value: T, delay = 350) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function getInitials(name?: string) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getRTKErrorMessage(err: unknown) {
  const anyErr = err as any;
  return (
    anyErr?.data?.message ||
    anyErr?.data?.error ||
    anyErr?.error ||
    anyErr?.message ||
    "Something went wrong"
  );
}

function userDisplayName(u: UserSearchItem) {
  return u.fullname ?? u.username ?? u.email ?? "—";
}

/* =========================
   Confirm Dialog
========================= */
function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Remove",
  loading,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => Promise<void> | void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={async () => {
              await onConfirm();
              onOpenChange(false);
            }}
            disabled={loading}
          >
            {loading ? "Removing..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* =========================
   Add/Edit Signers Dialog
   - multi select pending
   - Assign -> commit
========================= */
function EditSignersDialog({
  open,
  onOpenChange,
  assignedSignerIds,
  onAssign,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  assignedSignerIds: string[]; // đã assign ở sidebar
  onAssign: (users: UserSearchItem[]) => Promise<void> | void;
}) {
  // search
  const [query, setQuery] = React.useState("");
  const debounced = useDebouncedValue(query, 350);

  // pending selected (multi)
  const [pendingMap, setPendingMap] = React.useState<
    Record<string, UserSearchItem>
  >({});

  React.useEffect(() => {
    if (open) {
      setQuery("");
      setPendingMap({});
    }
  }, [open]);

  const shouldSearch = debounced.trim().length >= 2;

  const {
    data: raw,
    isLoading: searching,
    isError: searchError,
  } = useSearchUsersByEmailQuery(debounced.trim(), {
    skip: !shouldSearch,
  });

  // ✅ IMPORTANT: API của bạn trả { data: { items: [...] } }
  const suggestions = React.useMemo<UserSearchItem[]>(() => {
    const items = (raw as any)?.data?.items;
    if (Array.isArray(items)) return items;
    // fallback nếu hook transformResponse đã trả thẳng array
    if (Array.isArray(raw)) return raw as any;
    return [];
  }, [raw]);

  // ✅ chỉ hiện những user chưa có trong signers (assigned)
  const filteredSuggestions = React.useMemo(() => {
    const assigned = new Set(assignedSignerIds);
    return suggestions.filter((u) => !assigned.has(u.id));
  }, [suggestions, assignedSignerIds]);

  // toast search error (1 lần mỗi query)
  const lastToastKeyRef = React.useRef<string>("");
  React.useEffect(() => {
    const key = `${debounced.trim()}-${searchError}`;
    if (!shouldSearch) return;
    if (!searchError) return;
    if (lastToastKeyRef.current === key) return;
    lastToastKeyRef.current = key;
    toast.error("Search user failed");
  }, [debounced, searchError, shouldSearch]);

  const pendingList = React.useMemo(
    () => Object.values(pendingMap),
    [pendingMap]
  );

  const togglePending = (u: UserSearchItem) => {
    setPendingMap((prev) => {
      if (prev[u.id]) {
        const next = { ...prev };
        delete next[u.id];
        return next;
      }
      return { ...prev, [u.id]: u };
    });
  };

  const canAssign = pendingList.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[760px]">
        <DialogHeader>
          <DialogTitle>Add/Edit Signers</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-2">
          {/* LEFT: search + suggestions */}
          <div className="space-y-2">
            <div className="space-y-2">
              <p className="text-sm font-medium">Search user (by email)</p>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type email... (vd: will)"
              />
              <p className="text-xs text-muted-foreground">
                Gõ ít nhất 2 ký tự để tìm. Ví dụ:{" "}
                <span className="font-mono">will</span>
              </p>
            </div>

            {shouldSearch && (
              <div className="rounded-md border overflow-hidden">
                {searching ? (
                  <div className="p-3 space-y-2">
                    <Skeleton className="h-4 w-[70%]" />
                    <Skeleton className="h-4 w-[55%]" />
                    <Skeleton className="h-4 w-[60%]" />
                  </div>
                ) : searchError ? (
                  <div className="p-3 text-sm text-red-600">
                    Không tìm được user. Thử lại.
                  </div>
                ) : filteredSuggestions.length === 0 ? (
                  <div className="p-3 text-sm text-muted-foreground">
                    No users found.
                  </div>
                ) : (
                  <div className="max-h-[320px] overflow-auto">
                    {filteredSuggestions.map((u) => {
                      const selected = !!pendingMap[u.id];
                      return (
                        <button
                          key={u.id}
                          type="button"
                          className="w-full text-left flex items-center gap-3 p-2 px-3 hover:bg-muted"
                          onClick={() => togglePending(u)}
                        >
                          <Avatar className="h-7 w-7">
                            <AvatarImage
                              src={(u as any).avatar_url ?? undefined}
                            />
                            <AvatarFallback className="text-xs font-medium">
                              {getInitials(u.fullname ?? u.username ?? "U")}
                            </AvatarFallback>
                          </Avatar>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <div className="min-w-0">
                                <div className="font-medium truncate text-sm">
                                  {userDisplayName(u)}
                                </div>
                                <div className="text-xs text-muted-foreground truncate">
                                  {u.email}
                                </div>
                              </div>

                              <div className="text-xs text-muted-foreground">
                                {selected ? "Selected" : "Select"}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: pending list */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                Selected signers ({pendingList.length})
              </p>
              {pendingList.length > 0 ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPendingMap({})}
                >
                  Clear
                </Button>
              ) : null}
            </div>

            <div className="rounded-md border p-3 min-h-[120px]">
              {pendingList.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Chưa chọn signer nào.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {pendingList.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center justify-between gap-2 rounded-md border px-2 py-2"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-7 w-7">
                          <AvatarImage
                            src={(u as any).avatar_url ?? undefined}
                          />
                          <AvatarFallback className="text-xs font-medium">
                            {getInitials(u.fullname ?? u.username ?? "U")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">
                            {userDisplayName(u)}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {u.email}
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => togglePending(u)}
                        aria-label="Remove from pending"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <p className="text-xs text-muted-foreground">
              Tip: click lại user trong list bên trái để bỏ chọn.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button
            disabled={!canAssign}
            onClick={async () => {
              const t = toast.loading("Assigning signers...");
              try {
                await onAssign(pendingList);
                toast.success("Signers assigned", { id: t });
                onOpenChange(false);
              } catch (err) {
                toast.error(getRTKErrorMessage(err), { id: t });
              }
            }}
          >
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* =========================
   SignatureSidebar
========================= */
const SignatureSidebar = ({
  onClose,
  initialSigners,
  onChange,
}: {
  onClose?: () => void;

  /** optional: signer initial list (from server) */
  initialSigners?: UserSearchItem[];

  /** optional: notify parent signerIds */
  onChange?: (signers: UserSearchItem[]) => void;
}) => {
  // assigned signers state (committed)
  const [signers, setSigners] = React.useState<UserSearchItem[]>(
    initialSigners ?? []
  );

  React.useEffect(() => {
    if (initialSigners) setSigners(initialSigners);
  }, [initialSigners]);

  const signerIds = React.useMemo(() => signers.map((s) => s.id), [signers]);

  const pushChange = React.useCallback(
    (next: UserSearchItem[]) => {
      setSigners(next);
      onChange?.(next);
    },
    [onChange]
  );

  // edit dialog
  const [editOpen, setEditOpen] = React.useState(false);

  // remove confirm
  const [removeTarget, setRemoveTarget] = React.useState<UserSearchItem | null>(
    null
  );
  const [removing, setRemoving] = React.useState(false);

  return (
    <div className="p-4 py-3 flex flex-col gap-4">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Signature size={20} />
          <p className="font-medium">Signature</p>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="w-8 h-8"
          onClick={onClose}
        >
          <X />
        </Button>
      </div>

      {/* Signers section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground ml-3">Signers</p>
          <Badge variant="secondary">{signers.length}</Badge>
        </div>

        {/* Assigned list */}
        <div className=" space-y-2">
          {signers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No signers assigned.
            </p>
          ) : (
            signers.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between gap-2 rounded-md border px-2 py-2"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={(u as any).avatar_url ?? undefined} />
                    <AvatarFallback>
                      {getInitials(u.fullname ?? u.username ?? "U")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">
                      {userDisplayName(u)}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {u.email}
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setRemoveTarget(u)}
                  aria-label="Remove signer"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            ))
          )}
        </div>

        <Button className="w-full" onClick={() => setEditOpen(true)}>
          <UserPlus size={16} />
          <p>Add/Edit Signers</p>
        </Button>
      </div>

      {/* Signature Fields */}
      <div className="space-y-2">
        <p className="text-muted-foreground ml-3">Signature Fields</p>

        <Button className="w-full justify-start" variant="outline">
          <Signature size={16} />
          <p>Signature</p>
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <CaseSensitive size={16} />
          <p>Initials</p>
        </Button>
      </div>

      {/* Require Fields */}
      <div className="space-y-2">
        <p className="text-muted-foreground ml-3">Require Fields</p>

        <Button className="w-full justify-start" variant="outline">
          <Calendar size={16} />
          <p>Date Signed</p>
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <User size={16} />
          <p>Full Name</p>
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <Mail size={16} />
          <p>Email Address</p>
        </Button>

        <Button className="w-full justify-start" variant="outline">
          <BriefcaseBusiness size={16} />
          <p>Title</p>
        </Button>

        <Button className="w-full justify-start" variant="outline">
          <Building size={16} />
          <p>Company</p>
        </Button>
      </div>

      {/* Dialog: Add/Edit Signers */}
      <EditSignersDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        assignedSignerIds={signerIds}
        onAssign={async (users) => {
          // merge unique by id
          const map = new Map<string, UserSearchItem>();
          for (const s of signers) map.set(s.id, s);
          for (const u of users) map.set(u.id, u);

          const next = Array.from(map.values());
          pushChange(next);
        }}
      />

      {/* Confirm remove signer */}
      <ConfirmDialog
        open={!!removeTarget}
        onOpenChange={(v) => !v && setRemoveTarget(null)}
        title="Remove signer?"
        description={
          removeTarget
            ? `Are you sure you want to remove "${userDisplayName(
                removeTarget
              )}" from signers?`
            : ""
        }
        loading={removing}
        onConfirm={async () => {
          if (!removeTarget) return;
          setRemoving(true);
          const t = toast.loading("Removing signer...");
          try {
            // nếu có API remove signer -> gọi ở đây
            // await removeSignerApi({ userId: removeTarget.id }).unwrap()

            pushChange(signers.filter((s) => s.id !== removeTarget.id));
            toast.success("Signer removed", { id: t });
          } catch (err) {
            toast.error(getRTKErrorMessage(err), { id: t });
          } finally {
            setRemoving(false);
            setRemoveTarget(null);
          }
        }}
      />
    </div>
  );
};

export default SignatureSidebar;
