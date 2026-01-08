"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

import {
  useCreateOrganizationMutation,
  useDeleteOrganizationMutation,
  useGetMyOrganizationsQuery,
  useGetOrganizationByIdQuery,
  useUpdateOrganizationMutation,
} from "@/features/organization/infrastructure/api/organizationApi";

import type { Organization } from "@/features/organization/domain/models/organization";
import { OrganizationFormDialog } from "@/features/organization/presentation/components/OrganizationFormDialog";
import { ConfirmDeleteDialog } from "@/features/organization/presentation/components/ConfirmDeleteDialog";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/shared/lib/utils";

function formatDate(iso?: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function getRTKErrorMessage(err: unknown) {
  // RTK Query error shape thường là:
  // { status: number, data: { message?: string } } hoặc FetchBaseQueryError
  const anyErr = err as any;
  return (
    anyErr?.data?.message ||
    anyErr?.error ||
    anyErr?.message ||
    "Something went wrong"
  );
}

/**
 * Row fetcher: lấy Organization detail theo orgId, rồi bắn lên parent
 */
function OrgFetcherRow({
  orgId,
  onData,
}: {
  orgId: string;
  onData: (orgId: string, org?: Organization) => void;
}) {
  const { data, isError } = useGetOrganizationByIdQuery(orgId);

  React.useEffect(() => {
    if (data) onData(orgId, data);
    if (isError) onData(orgId, undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, data, isError]);

  return null;
}

export default function OrganizationsPage() {
  const {
    data: memberships,
    isLoading,
    isError,
    refetch,
  } = useGetMyOrganizationsQuery();

  const router = useRouter();

  const [createOrg, createState] = useCreateOrganizationMutation();
  const [updateOrg, updateState] = useUpdateOrganizationMutation();
  const [deleteOrg, deleteState] = useDeleteOrganizationMutation();

  const [createOpen, setCreateOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Organization | null>(null);
  const [deleting, setDeleting] = React.useState<Organization | null>(null);

  const [orgMap, setOrgMap] = React.useState<
    Record<string, Organization | undefined>
  >({});

  const orgIds = React.useMemo(
    () => (memberships ?? []).map((m) => m.organizationId),
    [memberships]
  );

  const handleOrgData = React.useCallback(
    (orgId: string, org?: Organization) => {
      setOrgMap((prev) => {
        if (prev[orgId] === org) return prev;
        return { ...prev, [orgId]: org };
      });
    },
    []
  );

  const organizations: Organization[] = React.useMemo(() => {
    const items: Organization[] = [];
    for (const id of orgIds) {
      const org = orgMap[id];
      if (org) items.push(org);
    }
    return items;
  }, [orgIds, orgMap]);

  // ===== DataTable state
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns = React.useMemo<ColumnDef<Organization>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            data-no-row-click="true"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "code",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Code <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-mono text-xs">{row.getValue("code")}</div>
        ),
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("name")}</div>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <div className="text-muted-foreground">
            {(row.getValue("description") as string) || "—"}
          </div>
        ),
      },
      {
        accessorKey: "is_active",
        header: "Active",
        cell: ({ row }) => {
          const active = Boolean(row.getValue("is_active"));
          return (
            <Badge
              className={cn(
                active
                  ? "text-green-600 bg-green-600/10"
                  : "text-red-600 bg-red-600/10"
              )}
            >
              {active ? "Active" : "Inactive"}
            </Badge>
          );
        },
      },
      {
        accessorKey: "created_at",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Created <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground">
            {formatDate(row.getValue("created_at") as string)}
          </div>
        ),
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const org = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  data-no-row-click="true"
                >
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>

                <DropdownMenuItem
                  data-no-row-click="true"
                  onClick={() => setEditing(org)}
                >
                  Edit
                </DropdownMenuItem>

                <DropdownMenuItem
                  data-no-row-click="true"
                  onClick={() => setDeleting(org)}
                >
                  Delete
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  data-no-row-click="true"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(org.id);
                      toast.success("Copied organization ID");
                    } catch {
                      toast.error("Cannot copy to clipboard");
                    }
                  }}
                >
                  Copy org ID
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: organizations,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="space-y-4 p-6">
      {/* Trigger fetch org details (ẩn) */}
      {(memberships ?? []).map((m) => (
        <OrgFetcherRow
          key={m.organizationId}
          orgId={m.organizationId}
          onData={handleOrgData}
        />
      ))}

      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Organizations</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={async () => {
              try {
                await refetch().unwrap?.(); // nếu hook có unwrap (tùy RTK version)
                toast.success("Refreshed");
              } catch {
                // refetch thường không throw, nhưng để an toàn:
                toast.error("Refresh failed");
              }
            }}
          >
            Refresh
          </Button>

          <Button onClick={() => setCreateOpen(true)}>New organization</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My organizations</CardTitle>
        </CardHeader>

        <CardContent>
          {isLoading && (
            <div className="space-y-2">
              <Skeleton className="h-6 w-[60%]" />
              <Skeleton className="h-6 w-[80%]" />
              <Skeleton className="h-6 w-[70%]" />
            </div>
          )}

          {isError && (
            <div className="space-y-2">
              <p className="text-sm text-red-600">
                Không tải được danh sách organization.
              </p>
              <Button variant="outline" onClick={() => refetch()}>
                Try again
              </Button>
            </div>
          )}

          {!isLoading && !isError && (
            <>
              {!memberships || memberships.length === 0 ? (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Chưa có organization nào. Tạo organization đầu tiên của bạn.
                  </p>
                  <Button onClick={() => setCreateOpen(true)}>
                    Create organization
                  </Button>
                </div>
              ) : (
                <div className="w-full">
                  <div className="flex items-center gap-2 py-4">
                    <Input
                      placeholder="Filter name..."
                      value={
                        (table.getColumn("name")?.getFilterValue() as string) ??
                        ""
                      }
                      onChange={(event) =>
                        table
                          .getColumn("name")
                          ?.setFilterValue(event.target.value)
                      }
                      className="max-w-sm"
                    />

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                          Columns <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        {table
                          .getAllColumns()
                          .filter((column) => column.getCanHide())
                          .map((column) => (
                            <DropdownMenuCheckboxItem
                              key={column.id}
                              className="capitalize"
                              checked={column.getIsVisible()}
                              onCheckedChange={(value) =>
                                column.toggleVisibility(!!value)
                              }
                            >
                              {column.id}
                            </DropdownMenuCheckboxItem>
                          ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="overflow-hidden rounded-md border">
                    <Table>
                      <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                          <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                              <TableHead key={header.id}>
                                {header.isPlaceholder
                                  ? null
                                  : flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                              </TableHead>
                            ))}
                          </TableRow>
                        ))}
                      </TableHeader>

                      <TableBody>
                        {table.getRowModel().rows?.length ? (
                          table.getRowModel().rows.map((row) => (
                            <TableRow
                              key={row.id}
                              data-state={row.getIsSelected() && "selected"}
                              className="cursor-pointer"
                              onClick={(e) => {
                                const target = e.target as HTMLElement;
                                if (
                                  target.closest(
                                    'button,[role="menuitem"],[data-no-row-click="true"],input'
                                  )
                                )
                                  return;

                                router.push(`/organization/${row.original.id}`);
                              }}
                            >
                              {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                  {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={columns.length}
                              className="h-24 text-center"
                            >
                              {organizations.length < orgIds.length
                                ? "Loading organizations..."
                                : "No results."}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="flex-1 text-sm text-muted-foreground">
                      {table.getFilteredSelectedRowModel().rows.length} of{" "}
                      {table.getFilteredRowModel().rows.length} row(s) selected.
                    </div>
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* CREATE */}
      <OrganizationFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Create organization"
        submitLabel="Create"
        loading={createState.isLoading}
        onSubmit={async (values) => {
          const t = toast.loading("Creating organization...");
          try {
            await createOrg(values).unwrap();
            toast.success("Created organization", { id: t });
            setCreateOpen(false);
            refetch();
          } catch (err) {
            toast.error(getRTKErrorMessage(err), { id: t });
          }
        }}
      />

      {/* UPDATE */}
      <OrganizationFormDialog
        open={!!editing}
        onOpenChange={(v) => !v && setEditing(null)}
        title="Update organization"
        submitLabel="Save"
        loading={updateState.isLoading}
        defaultValues={
          editing
            ? { name: editing.name, description: editing.description ?? "" }
            : undefined
        }
        onSubmit={async (values) => {
          if (!editing) return;
          const t = toast.loading("Saving changes...");
          try {
            await updateOrg({ id: editing.id, body: values }).unwrap();
            toast.success("Updated organization", { id: t });
            setEditing(null);
            refetch();
          } catch (err) {
            toast.error(getRTKErrorMessage(err), { id: t });
          }
        }}
      />

      {/* DELETE */}
      <ConfirmDeleteDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
        title={`Delete "${deleting?.name ?? ""}"?`}
        loading={deleteState.isLoading}
        onConfirm={async () => {
          if (!deleting) return;
          const t = toast.loading("Deleting...");
          try {
            await deleteOrg(deleting.id).unwrap();
            toast.success("Deleted organization", { id: t });
            setDeleting(null);
            refetch();
          } catch (err) {
            toast.error(getRTKErrorMessage(err), { id: t });
          }
        }}
      />
    </div>
  );
}
