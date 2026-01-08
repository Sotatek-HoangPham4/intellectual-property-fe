"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, ChevronLeft, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Organization } from "@/features/organization/domain/models/organization";
import {
  useGetOrganizationByIdQuery,
  useGetOrganizationMembersQuery,
  useAddOrganizationMemberMutation,
  useRemoveOrganizationMemberMutation,
  useChangeMemberRoleMutation,
  useUpdateOrganizationMutation,
  type OrgMember,
} from "@/features/organization/infrastructure/api/organizationApi";

import { OrganizationDashboardCards } from "@/features/organization/presentation/components/OrganizationDashboardCards";
import { useGetPublicRolesQuery } from "@/features/role/infrastructure/api/roleApi";
import {
  UserSearchItem,
  useSearchUsersByEmailQuery,
} from "@/features/user/infrastructure/api/userApi";
import Link from "next/link";
import { OrganizationOverviewChart } from "@/features/organization/presentation/components/OrganizationOverviewChart";

function formatDate(iso?: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
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

function useDebouncedValue<T>(value: T, delay = 350) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
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

export function AddMemberDialog({
  open,
  onOpenChange,
  roles,
  loading,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  roles: Array<{ id: string; name: string }>;
  loading?: boolean;
  onSubmit: (payload: { userId: string; roleId: string }) => Promise<void>;
}) {
  const [query, setQuery] = React.useState("");
  const debounced = useDebouncedValue(query, 350);

  const [selectedUser, setSelectedUser] = React.useState<UserSearchItem | null>(
    null
  );

  const [roleId, setRoleId] = React.useState<string>("");

  React.useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedUser(null);
      setRoleId(roles[0]?.id ?? "");
    }
  }, [open, roles]);

  const shouldSearch = debounced.trim().length >= 2 && !selectedUser;

  const {
    data: suggestions,
    isLoading: searching,
    isError: searchError,
  } = useSearchUsersByEmailQuery(debounced.trim(), {
    skip: !shouldSearch,
  });

  // optional toast khi search lỗi (chỉ toast 1 lần mỗi lần query)
  const lastToastKeyRef = React.useRef<string>("");
  React.useEffect(() => {
    const key = `${debounced.trim()}-${searchError}`;
    if (!shouldSearch) return;
    if (!searchError) return;
    if (lastToastKeyRef.current === key) return;
    lastToastKeyRef.current = key;
    toast.error("Search user failed");
  }, [debounced, searchError, shouldSearch]);

  const canSubmit = !!selectedUser?.id && !!roleId && !loading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Add member</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2">
          <div className="w-full space-y-2">
            <div className="flex gap-2 items-start">
              <div className="w-full space-y-2">
                <Label>User (search by email)</Label>

                <Input
                  className="lg:w-full"
                  value={selectedUser ? selectedUser.email : query}
                  onChange={(e) => {
                    setSelectedUser(null);
                    setQuery(e.target.value);
                  }}
                  placeholder="Type email... (vd: william)"
                />
                <p className="text-xs text-muted-foreground p-1">
                  Gõ ít nhất 2 ký tự để tìm. Ví dụ:{" "}
                  <span className="font-mono">will</span>
                </p>
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={roleId}
                  onValueChange={setRoleId}
                  disabled={roles.length === 0}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue
                      placeholder={
                        roles.length ? "Select role" : "No roles available"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {roles.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Chưa tải được roles (/roles/public) hoặc roles rỗng.
                  </p>
                )}
              </div>
            </div>

            {selectedUser ? (
              <div className="flex items-center justify-between rounded-md border p-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={selectedUser.avatar_url ?? undefined}
                      alt={selectedUser.email}
                    />
                    <AvatarFallback>
                      {getInitials(
                        selectedUser.fullname ?? selectedUser.username ?? "U"
                      )}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <div className="font-medium truncate">
                      {selectedUser.fullname ?? selectedUser.username ?? "—"}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {selectedUser.email}
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedUser(null);
                    setQuery("");
                  }}
                >
                  Change
                </Button>
              </div>
            ) : (
              <>
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
                    ) : (suggestions?.length ?? 0) === 0 ? (
                      <div className="p-3 text-sm text-muted-foreground">
                        No users found.
                      </div>
                    ) : (
                      <div className="max-h-54 overflow-auto">
                        {(suggestions ?? []).map((u) => (
                          <button
                            key={u.id}
                            type="button"
                            className="w-full text-left flex items-center gap-3 p-2 px-3 hover:bg-muted"
                            onClick={() => {
                              setSelectedUser(u);
                              setQuery("");
                            }}
                          >
                            <Avatar className="h-7 w-7">
                              <AvatarImage src={u.avatar_url ?? undefined} />
                              <AvatarFallback className="text-xs font-medium">
                                {getInitials(u.fullname ?? u.username ?? "U")}
                              </AvatarFallback>
                            </Avatar>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <div className="">
                                  <div className="font-medium truncate text-sm">
                                    {u.fullname ?? u.username ?? "—"}
                                  </div>
                                  <div className="text-xs text-muted-foreground truncate">
                                    {u.email}
                                  </div>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Select
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            disabled={!canSubmit}
            onClick={async () => {
              if (!selectedUser) return;

              const t = toast.loading("Adding member...");
              try {
                await onSubmit({ userId: selectedUser.id, roleId });
                toast.success("Member added", { id: t });
                onOpenChange(false);
              } catch (err) {
                toast.error(getRTKErrorMessage(err), { id: t });
              }
            }}
          >
            {loading ? "Adding..." : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditOrganizationDialog({
  open,
  onOpenChange,
  org,
  loading,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  org: Organization;
  loading?: boolean;
  onSubmit: (payload: {
    code: string;
    name: string;
    description?: string;
    is_active: boolean;
  }) => Promise<void>;
}) {
  const [code, setCode] = React.useState((org as any).code ?? "");
  const [name, setName] = React.useState(org.name ?? "");
  const [description, setDescription] = React.useState(org.description ?? "");
  const [isActive, setIsActive] = React.useState<boolean>(
    Boolean((org as any).is_active)
  );

  React.useEffect(() => {
    if (open) {
      setCode((org as any).code ?? "");
      setName(org.name ?? "");
      setDescription(org.description ?? "");
      setIsActive(Boolean((org as any).is_active));
    }
  }, [open, org]);

  const canSubmit =
    code.trim().length > 0 && name.trim().length > 0 && !loading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit organization</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Code</Label>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="VD: SOTATEK_01"
            />
          </div>

          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Sotatek"
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả ngắn"
            />
          </div>

          <div className="flex items-center justify-between rounded-md border p-3">
            <div className="space-y-1">
              <div className="text-sm font-medium">Active</div>
              <div className="text-xs text-muted-foreground">
                Bật/tắt trạng thái hoạt động của tổ chức
              </div>
            </div>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            disabled={!canSubmit}
            onClick={async () => {
              const t = toast.loading("Saving organization...");
              try {
                await onSubmit({
                  code: code.trim(),
                  name: name.trim(),
                  description: description.trim() || undefined,
                  is_active: isActive,
                });
                toast.success("Organization updated", { id: t });
                onOpenChange(false);
              } catch (err) {
                toast.error(getRTKErrorMessage(err), { id: t });
              }
            }}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function OrganizationDetailPage() {
  const params = useParams<{ id: string }>();
  const orgId = params.id;

  const {
    data: org,
    isLoading: orgLoading,
    isError: orgError,
    refetch: refetchOrg,
  } = useGetOrganizationByIdQuery(orgId);

  const {
    data: members,
    isLoading: membersLoading,
    isError: membersError,
    refetch: refetchMembers,
  } = useGetOrganizationMembersQuery(orgId);

  const {
    data: publicRoles,
    isLoading: rolesLoading,
    isError: rolesError,
    refetch: refetchRoles,
  } = useGetPublicRolesQuery();

  const roleOptions = React.useMemo(
    () => (publicRoles ?? []).map((r) => ({ id: r.id, name: r.name })),
    [publicRoles]
  );

  const [addMember, addState] = useAddOrganizationMemberMutation();
  const [removeMember, removeState] = useRemoveOrganizationMemberMutation();
  const [changeRole, changeRoleState] = useChangeMemberRoleMutation();
  const [updateOrg, updateState] = useUpdateOrganizationMutation();

  const [addOpen, setAddOpen] = React.useState(false);
  const [editOrgOpen, setEditOrgOpen] = React.useState(false);

  const ownerId = (org as any)?.ownerId as string | undefined;
  const isOwnerMember = React.useCallback(
    (userId: string) => !!ownerId && userId === ownerId,
    [ownerId]
  );

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="w-full items-center flex gap-2 ">
          <Link href={"/organization"}>
            <ChevronLeft className="cursor-pointer" />
          </Link>
          <h1 className="text-xl font-semibold">{org?.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={async () => {
              const t = toast.loading("Refreshing...");
              try {
                await Promise.all([
                  refetchOrg(),
                  refetchMembers(),
                  refetchRoles(),
                ]);
                toast.success("Refreshed", { id: t });
              } catch {
                toast.error("Refresh failed", { id: t });
              }
            }}
          >
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview" className="space-y-4">
          <OrganizationDashboardCards
            members={members}
            membersLoading={membersLoading}
          />

          <div className="w-full grid grid-cols-1 gap-4">
            {/* <OrganizationOverviewChart
              title="Dashboard (Users vs Documents)"
              description="Last 6 months"
              data={[
                { label: "Jul", users: 12, documents: 80 },
                { label: "Aug", users: 18, documents: 120 },
                { label: "Sep", users: 16, documents: 95 },
                { label: "Oct", users: 22, documents: 160 },
                { label: "Nov", users: 26, documents: 210 },
                { label: "Dec", users: 30, documents: 240 },
              ]}
            /> */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Organization info</CardTitle>
                <Button
                  variant="outline"
                  onClick={() => setEditOrgOpen(true)}
                  disabled={!org}
                >
                  Edit organization
                </Button>
              </CardHeader>

              <CardContent>
                {orgLoading && (
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-[60%]" />
                    <Skeleton className="h-6 w-[80%]" />
                  </div>
                )}

                {orgError && (
                  <div className="space-y-2">
                    <p className="text-sm text-red-600">
                      Không tải được organization.
                    </p>
                    <Button variant="outline" onClick={() => refetchOrg()}>
                      Try again
                    </Button>
                  </div>
                )}

                {org && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <div className="text-xs text-muted-foreground">ID</div>
                      <div className="font-mono text-xs break-all">
                        {org.id}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-muted-foreground">Code</div>
                      <div className="font-mono text-sm">
                        {(org as any).code ?? "—"}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-muted-foreground">Name</div>
                      <div className="text-sm font-medium">{org.name}</div>
                    </div>

                    <div>
                      <div className="text-xs text-muted-foreground">
                        Active
                      </div>
                      <div className="text-sm">
                        {(org as any).is_active ? (
                          <Badge className="text-green-600 bg-green-600/10 mt-2">
                            Active
                          </Badge>
                        ) : (
                          <Badge className="text-red-600 bg-red-600/10 mt-2">
                            Inactive
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-muted-foreground">
                        Description
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {org.description || "—"}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-muted-foreground mb-1">
                        Owner
                      </div>
                      {(org as any).owner ? (
                        <div className="flex items-center gap-3">
                          <div className="min-w-0">
                            <div className="text-sm font-medium truncate">
                              {(org as any).owner.fullname}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {(org as any).owner.email}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="font-mono text-xs text-muted-foreground">
                          {(org as any).ownerId ?? "—"}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="text-xs text-muted-foreground">
                        Created
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate((org as any).created_at)}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-muted-foreground">
                        Updated
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate((org as any).updated_at)}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Members</CardTitle>
                <Button onClick={() => setAddOpen(true)}>Add member</Button>
              </CardHeader>

              <CardContent>
                {rolesError && (
                  <div className="mb-3 flex items-center justify-between gap-3 rounded-md border p-3">
                    <p className="text-sm text-red-600">
                      Không tải được roles.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast.error("Retry roles...");
                        refetchRoles();
                      }}
                    >
                      Retry roles
                    </Button>
                  </div>
                )}

                {membersLoading && (
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-[60%]" />
                    <Skeleton className="h-6 w-[80%]" />
                  </div>
                )}

                {membersError && (
                  <div className="space-y-2">
                    <p className="text-sm text-red-600">
                      Không tải được members.
                    </p>
                    <Button variant="outline" onClick={() => refetchMembers()}>
                      Try again
                    </Button>
                  </div>
                )}

                {members && (
                  <div className="overflow-hidden rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead className="w-[100px] text-right">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {members.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                              No members.
                            </TableCell>
                          </TableRow>
                        ) : (
                          members.map((m: OrgMember) => {
                            const isOwner = isOwnerMember(m.userId);

                            return (
                              <TableRow key={m.id}>
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage
                                        src={m.user?.avatar_url ?? undefined}
                                      />
                                      <AvatarFallback>
                                        {getInitials(m.user?.username)}
                                      </AvatarFallback>
                                    </Avatar>

                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2">
                                        <div className="font-medium">
                                          {m.user?.username ?? "—"}
                                        </div>
                                        {isOwner && (
                                          <Badge variant="secondary">
                                            Owner
                                          </Badge>
                                        )}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        {m.user?.email ?? "—"}
                                      </div>
                                    </div>
                                  </div>
                                </TableCell>

                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    {isOwner ? (
                                      <span className="text-xs text-muted-foreground">
                                        Owner admin role is fixed
                                      </span>
                                    ) : (
                                      <Select
                                        value={m.roleId}
                                        disabled={
                                          rolesLoading ||
                                          !publicRoles?.length ||
                                          changeRoleState.isLoading
                                        }
                                        onValueChange={async (newRoleId) => {
                                          if (newRoleId === m.roleId) return;

                                          const t =
                                            toast.loading("Updating role...");
                                          try {
                                            await changeRole({
                                              orgId,
                                              userId: m.userId,
                                              roleId: newRoleId,
                                            }).unwrap();

                                            toast.success("Role updated", {
                                              id: t,
                                            });
                                            refetchMembers();
                                          } catch (err) {
                                            toast.error(
                                              getRTKErrorMessage(err),
                                              {
                                                id: t,
                                              }
                                            );
                                          }
                                        }}
                                      >
                                        <SelectTrigger className="h-8 w-[220px]">
                                          <SelectValue
                                            placeholder={
                                              rolesLoading
                                                ? "Loading roles..."
                                                : "Select role"
                                            }
                                          />
                                        </SelectTrigger>

                                        <SelectContent>
                                          {roleOptions.map((r) => (
                                            <SelectItem key={r.id} value={r.id}>
                                              {r.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    )}

                                    {changeRoleState.isLoading && !isOwner && (
                                      <span className="text-xs text-muted-foreground">
                                        Saving...
                                      </span>
                                    )}
                                  </div>
                                </TableCell>

                                <TableCell className="text-sm text-muted-foreground">
                                  {formatDate(m.joinedAt)}
                                </TableCell>

                                <TableCell className="text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        className="h-8 w-8 p-0"
                                        disabled={
                                          isOwner || removeState.isLoading
                                        }
                                      >
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem
                                        className="text-red-600"
                                        disabled={
                                          isOwner || removeState.isLoading
                                        }
                                        onClick={async () => {
                                          if (isOwner) return;

                                          const t =
                                            toast.loading("Removing member...");
                                          try {
                                            await removeMember({
                                              orgId,
                                              userId: m.userId,
                                            }).unwrap();

                                            toast.success("Member removed", {
                                              id: t,
                                            });
                                            refetchMembers();
                                          } catch (err) {
                                            toast.error(
                                              getRTKErrorMessage(err),
                                              {
                                                id: t,
                                              }
                                            );
                                          }
                                        }}
                                      >
                                        Remove
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>

                                  {removeState.isLoading && (
                                    <span className="ml-2 text-xs text-muted-foreground">
                                      Removing...
                                    </span>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            <AddMemberDialog
              open={addOpen}
              onOpenChange={setAddOpen}
              roles={roleOptions}
              loading={addState.isLoading}
              onSubmit={async ({ userId, roleId }) => {
                // toast cho AddMember đã nằm trong dialog (loading/success/error)
                // nhưng để chắc chắn vẫn catch ở đây (nếu bạn muốn remove toast trong dialog)
                await addMember({ orgId, body: { userId, roleId } }).unwrap();
                refetchMembers();
              }}
            />
          </div>

          {org && (
            <EditOrganizationDialog
              open={editOrgOpen}
              onOpenChange={setEditOrgOpen}
              org={org}
              loading={updateState.isLoading}
              onSubmit={async (payload) => {
                await updateOrg({ id: orgId, body: payload }).unwrap();
                refetchOrg();
              }}
            />
          )}
        </TabsContent>

        {/* MEMBERS */}
        <TabsContent value="members">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Members</CardTitle>
              <Button onClick={() => setAddOpen(true)}>Add member</Button>
            </CardHeader>

            <CardContent>
              {rolesError && (
                <div className="mb-3 flex items-center justify-between gap-3 rounded-md border p-3">
                  <p className="text-sm text-red-600">Không tải được roles.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      toast.error("Retry roles...");
                      refetchRoles();
                    }}
                  >
                    Retry roles
                  </Button>
                </div>
              )}

              {membersLoading && (
                <div className="space-y-2">
                  <Skeleton className="h-6 w-[60%]" />
                  <Skeleton className="h-6 w-[80%]" />
                </div>
              )}

              {membersError && (
                <div className="space-y-2">
                  <p className="text-sm text-red-600">
                    Không tải được members.
                  </p>
                  <Button variant="outline" onClick={() => refetchMembers()}>
                    Try again
                  </Button>
                </div>
              )}

              {members && (
                <div className="overflow-hidden rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="w-[100px] text-right">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {members.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="h-24 text-center">
                            No members.
                          </TableCell>
                        </TableRow>
                      ) : (
                        members.map((m: OrgMember) => {
                          const isOwner = isOwnerMember(m.userId);

                          return (
                            <TableRow key={m.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage
                                      src={m.user?.avatar_url ?? undefined}
                                    />
                                    <AvatarFallback>
                                      {getInitials(m.user?.username)}
                                    </AvatarFallback>
                                  </Avatar>

                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                      <div className="font-medium">
                                        {m.user?.username ?? "—"}
                                      </div>
                                      {isOwner && (
                                        <Badge variant="secondary">Owner</Badge>
                                      )}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {m.user?.email ?? "—"}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>

                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {isOwner ? (
                                    <span className="text-xs text-muted-foreground">
                                      Owner admin role is fixed
                                    </span>
                                  ) : (
                                    <Select
                                      value={m.roleId}
                                      disabled={
                                        rolesLoading ||
                                        !publicRoles?.length ||
                                        changeRoleState.isLoading
                                      }
                                      onValueChange={async (newRoleId) => {
                                        if (newRoleId === m.roleId) return;

                                        const t =
                                          toast.loading("Updating role...");
                                        try {
                                          await changeRole({
                                            orgId,
                                            userId: m.userId,
                                            roleId: newRoleId,
                                          }).unwrap();

                                          toast.success("Role updated", {
                                            id: t,
                                          });
                                          refetchMembers();
                                        } catch (err) {
                                          toast.error(getRTKErrorMessage(err), {
                                            id: t,
                                          });
                                        }
                                      }}
                                    >
                                      <SelectTrigger className="h-8 w-[220px]">
                                        <SelectValue
                                          placeholder={
                                            rolesLoading
                                              ? "Loading roles..."
                                              : "Select role"
                                          }
                                        />
                                      </SelectTrigger>

                                      <SelectContent>
                                        {roleOptions.map((r) => (
                                          <SelectItem key={r.id} value={r.id}>
                                            {r.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  )}

                                  {changeRoleState.isLoading && !isOwner && (
                                    <span className="text-xs text-muted-foreground">
                                      Saving...
                                    </span>
                                  )}
                                </div>
                              </TableCell>

                              <TableCell className="text-sm text-muted-foreground">
                                {formatDate(m.joinedAt)}
                              </TableCell>

                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      className="h-8 w-8 p-0"
                                      disabled={
                                        isOwner || removeState.isLoading
                                      }
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>

                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      disabled={
                                        isOwner || removeState.isLoading
                                      }
                                      onClick={async () => {
                                        if (isOwner) return;

                                        const t =
                                          toast.loading("Removing member...");
                                        try {
                                          await removeMember({
                                            orgId,
                                            userId: m.userId,
                                          }).unwrap();

                                          toast.success("Member removed", {
                                            id: t,
                                          });
                                          refetchMembers();
                                        } catch (err) {
                                          toast.error(getRTKErrorMessage(err), {
                                            id: t,
                                          });
                                        }
                                      }}
                                    >
                                      Remove
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>

                                {removeState.isLoading && (
                                  <span className="ml-2 text-xs text-muted-foreground">
                                    Removing...
                                  </span>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          <AddMemberDialog
            open={addOpen}
            onOpenChange={setAddOpen}
            roles={roleOptions}
            loading={addState.isLoading}
            onSubmit={async ({ userId, roleId }) => {
              // toast cho AddMember đã nằm trong dialog (loading/success/error)
              // nhưng để chắc chắn vẫn catch ở đây (nếu bạn muốn remove toast trong dialog)
              await addMember({ orgId, body: { userId, roleId } }).unwrap();
              refetchMembers();
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
