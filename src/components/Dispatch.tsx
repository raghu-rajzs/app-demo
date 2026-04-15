import React, { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import {
  Plus,
  Trash2,
  Search,
  AlertOctagon,
  Check,
  ChevronDown,
  ArrowLeft,
  Pencil,
} from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

interface FieldQuantityRow {
  id: string;
  fieldNumber: string;
  quantity: string;
  partFull?: string;
  harvest?: string;
  moisture?: string;
  bags?: string;
}

interface DispatchEntity {
  id: string;
  vendor?: string;
  lrNumber: string;
  truckNumber: string;
  maxFreight?: string;
  productLocation?: string;
  dispatchTime?: string;
  rows: FieldQuantityRow[];
  isSaved: boolean;
  isExpanded: boolean;
}

type NewEntityFieldRow = {
  id: string;
  fieldNumber: string;
  quantity: string;
  partFull: string;
  harvest: string;
  moisture: string;
  bags: string;
};

type TransportFieldKey =
  | "vendor"
  | "truckNumber"
  | "lrNumber"
  | "maxFreight"
  | "productLocation"
  | "dispatchTime";

type FieldRowFieldKey =
  | "fieldNumber"
  | "quantity"
  | "partFull"
  | "harvest"
  | "moisture"
  | "bags";

const toDateTimeLocalValue = (value: string) => {
  if (!value?.trim()) return "";

  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(trimmed)) {
    return trimmed.slice(0, 16);
  }

  const match = trimmed.match(
    /^(\d{2})\/(\d{2})\/(\d{4}),?\s*(\d{2}):(\d{2})$/,
  );
  if (match) {
    const [, dd, mm, yyyy, hh, min] = match;
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  }

  const asDate = new Date(trimmed);
  if (!Number.isNaN(asDate.getTime())) {
    const yyyy = String(asDate.getFullYear());
    const mm = String(asDate.getMonth() + 1).padStart(2, "0");
    const dd = String(asDate.getDate()).padStart(2, "0");
    const hh = String(asDate.getHours()).padStart(2, "0");
    const min = String(asDate.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  }

  return "";
};

const toDateValue = (value: string) => {
  if (!value?.trim()) return "";
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  const match = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (match) {
    const [, dd, mm, yyyy] = match;
    return `${yyyy}-${mm}-${dd}`;
  }

  const asDate = new Date(trimmed);
  if (!Number.isNaN(asDate.getTime())) {
    const yyyy = String(asDate.getFullYear());
    const mm = String(asDate.getMonth() + 1).padStart(2, "0");
    const dd = String(asDate.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  return "";
};

const formatHarvestDate = (value: string) => {
  if (!value?.trim()) return "-";
  const asDate = new Date(value);
  if (Number.isNaN(asDate.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(asDate);
};

const formatDispatchTime = (value: string) => {
  if (!value?.trim()) return "-";
  const asDate = new Date(value);
  if (Number.isNaN(asDate.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(asDate);
};

export function Dispatch() {
  const [dispatchEntities, setDispatchEntities] = useState<DispatchEntity[]>(
    [],
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem("dispatchEntities");
      if (!raw) return;
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        setDispatchEntities(parsed as DispatchEntity[]);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "dispatchEntities",
        JSON.stringify(dispatchEntities),
      );
    } catch {
      // ignore
    }
  }, [dispatchEntities]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [addDialogTab, setAddDialogTab] = useState("transport");
  const [editingEntityId, setEditingEntityId] = useState<string>("");
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [viewingEntityId, setViewingEntityId] = useState<string>("");
  const [detailsExpandedRowIds, setDetailsExpandedRowIds] = useState<string[]>(
    [],
  );
  const [isDeleteFieldConfirmOpen, setIsDeleteFieldConfirmOpen] =
    useState(false);
  const [pendingDeleteFieldRowId, setPendingDeleteFieldRowId] =
    useState<string>("");

  const [isEditingDetailsTransport, setIsEditingDetailsTransport] =
    useState(false);
  const [detailsTransportDraft, setDetailsTransportDraft] = useState({
    vendor: "",
    truckNumber: "",
    lrNumber: "",
    maxFreight: "",
    productLocation: "",
    dispatchTime: "",
  });

  const [editingDetailsFieldRowId, setEditingDetailsFieldRowId] = useState("");
  const [detailsFieldRowDraft, setDetailsFieldRowDraft] = useState({
    fieldNumber: "",
    quantity: "",
    partFull: "",
    harvest: "",
    moisture: "",
    bags: "",
  });

  const [isAddingDetailsFieldRow, setIsAddingDetailsFieldRow] = useState(false);
  const [detailsNewFieldRowDraft, setDetailsNewFieldRowDraft] = useState({
    fieldNumber: "",
    quantity: "",
    partFull: "",
    harvest: "",
    moisture: "",
    bags: "",
  });
  const [detailsNewFieldRowErrors, setDetailsNewFieldRowErrors] = useState<
    Partial<Record<FieldRowFieldKey, string>>
  >({});

  const fieldNumberOptions = useMemo(() => {
    const unique = new Set<string>();
    dispatchEntities.forEach((entity: DispatchEntity) => {
      entity.rows.forEach((row: FieldQuantityRow) => {
        if (row.fieldNumber?.trim()) unique.add(row.fieldNumber.trim());
      });
    });

    const options = Array.from(unique);
    if (options.length > 0) return options;
    return ["Field 1", "Field 2", "Field 3", "Field 4", "Field 5"];
  }, [dispatchEntities]);

  const viewingEntity = useMemo(() => {
    if (!viewingEntityId) return undefined;
    return dispatchEntities.find(
      (entity: DispatchEntity) => entity.id === viewingEntityId,
    );
  }, [dispatchEntities, viewingEntityId]);

  const viewingEntityTotalQty = useMemo(() => {
    if (!viewingEntity) return 0;
    return viewingEntity.rows.reduce((sum: number, row: FieldQuantityRow) => {
      const val = Number(row.quantity);
      return sum + (Number.isFinite(val) ? val : 0);
    }, 0);
  }, [viewingEntity]);

  // Form state for new entity
  const [newEntityForm, setNewEntityForm] = useState({
    vendor: "",
    lrNumber: "",
    truckNumber: "",
    maxFreight: "",
    productLocation: "",
    dispatchTime: "",
  });

  const [newEntityFieldRows, setNewEntityFieldRows] = useState<
    Array<NewEntityFieldRow>
  >([]);
  const [expandedFieldRowId, setExpandedFieldRowId] = useState<string>("");

  const [isDeleteCreateFieldConfirmOpen, setIsDeleteCreateFieldConfirmOpen] =
    useState(false);
  const [pendingDeleteCreateFieldRowId, setPendingDeleteCreateFieldRowId] =
    useState<string>("");

  const [transportFieldErrors, setTransportFieldErrors] = useState<
    Partial<Record<TransportFieldKey, string>>
  >({});
  const [fieldRowErrors, setFieldRowErrors] = useState<
    Record<string, Partial<Record<FieldRowFieldKey, string>>>
  >({});

  const getFieldRowValidationErrors = (row: NewEntityFieldRow) => {
    const rowErr: Partial<Record<FieldRowFieldKey, string>> = {};
    if (!row.fieldNumber.trim())
      rowErr.fieldNumber = "Field number is required";
    if (!row.quantity.trim()) rowErr.quantity = "Quantity is required";
    if (!row.partFull.trim()) rowErr.partFull = "Part/Full is required";
    if (!row.harvest.trim()) rowErr.harvest = "Harvest is required";
    if (!row.moisture.trim()) rowErr.moisture = "Moisture is required";
    return rowErr;
  };

  const totalQuantity = useMemo(() => {
    return dispatchEntities.reduce((sum: number, entity: DispatchEntity) => {
      const entityQty = entity.rows.reduce(
        (rowSum: number, row: FieldQuantityRow) => {
          const val = Number.parseFloat(row.quantity);
          return rowSum + (Number.isFinite(val) ? val : 0);
        },
        0,
      );
      return sum + entityQty;
    }, 0);
  }, [dispatchEntities]);

  // Handle adding a new dispatch entity
  const handleAddDispatchEntity = () => {
    setEditingEntityId("");
    setNewEntityForm({
      vendor: "",
      lrNumber: "",
      truckNumber: "",
      maxFreight: "",
      productLocation: "",
      dispatchTime: "",
    });
    const firstRowId = `row-${Date.now()}`;
    setNewEntityFieldRows([
      {
        id: firstRowId,
        fieldNumber: "",
        quantity: "",
        partFull: "",
        harvest: "",
        moisture: "",
        bags: "",
      },
    ]);
    setExpandedFieldRowId(firstRowId);
    setTransportFieldErrors({});
    setFieldRowErrors({});
    setAddDialogTab("transport");
    setIsAddDialogOpen(true);
  };

  const isEditing = Boolean(editingEntityId);

  const handleOpenDetails = (entityId: string) => {
    const entity = dispatchEntities.find(
      (e: DispatchEntity) => e.id === entityId,
    );
    setDetailsExpandedRowIds(
      entity ? entity.rows.map((r: FieldQuantityRow) => r.id) : [],
    );

    setIsEditingDetailsTransport(false);
    setDetailsTransportDraft({
      vendor: entity?.vendor ?? "",
      truckNumber: entity?.truckNumber ?? "",
      lrNumber: entity?.lrNumber ?? "",
      maxFreight: entity?.maxFreight ?? "",
      productLocation: entity?.productLocation ?? "",
      dispatchTime: toDateTimeLocalValue(entity?.dispatchTime ?? ""),
    });

    setEditingDetailsFieldRowId("");
    setDetailsFieldRowDraft({
      fieldNumber: "",
      quantity: "",
      partFull: "",
      harvest: "",
      moisture: "",
      bags: "",
    });

    setIsAddingDetailsFieldRow(false);
    setDetailsNewFieldRowDraft({
      fieldNumber: "",
      quantity: "",
      partFull: "",
      harvest: "",
      moisture: "",
      bags: "",
    });
    setDetailsNewFieldRowErrors({});

    setViewingEntityId(entityId);
    setIsDetailsDialogOpen(true);
  };

  const handleModifyDispatchEntity = (
    entityId: string,
    opts?: {
      initialTab?: "transport" | "field";
      focusRowId?: string;
    },
  ) => {
    const entity = dispatchEntities.find(
      (e: DispatchEntity) => e.id === entityId,
    );
    if (!entity) return;

    setEditingEntityId(entity.id);
    setNewEntityForm({
      vendor: entity.vendor ?? "",
      lrNumber: entity.lrNumber,
      truckNumber: entity.truckNumber,
      maxFreight: entity.maxFreight ?? "",
      productLocation: entity.productLocation ?? "",
      dispatchTime: entity.dispatchTime ?? "",
    });
    setNewEntityFieldRows(
      entity.rows.map((row: FieldQuantityRow) => ({
        id: row.id,
        fieldNumber: row.fieldNumber,
        quantity: row.quantity,
        partFull: row.partFull ?? "",
        harvest: row.harvest ?? "",
        moisture: row.moisture ?? "",
        bags: row.bags ?? "",
      })),
    );
    if (opts?.focusRowId) {
      setExpandedFieldRowId(opts.focusRowId);
    } else {
      setExpandedFieldRowId(entity.rows.length > 0 ? entity.rows[0].id : "");
    }
    setTransportFieldErrors({});
    setFieldRowErrors({});
    setAddDialogTab(opts?.initialTab ?? "field");
    setIsAddDialogOpen(true);
  };

  // Validate and save new entity
  const handleSaveNewEntity = () => {
    const nextTransportErrors: Partial<Record<TransportFieldKey, string>> = {};
    const nextFieldRowErrors: Record<
      string,
      Partial<Record<FieldRowFieldKey, string>>
    > = {};

    if (!newEntityForm.vendor.trim())
      nextTransportErrors.vendor = "Vendor is required";
    if (!newEntityForm.truckNumber.trim())
      nextTransportErrors.truckNumber = "Truck Number is required";
    if (!newEntityForm.lrNumber.trim())
      nextTransportErrors.lrNumber = "LR Number is required";
    if (!newEntityForm.maxFreight.trim())
      nextTransportErrors.maxFreight = "Max Freight is required";
    if (!newEntityForm.productLocation.trim())
      nextTransportErrors.productLocation = "Product location is required";
    if (!newEntityForm.dispatchTime.trim())
      nextTransportErrors.dispatchTime = "Dispatch time is required";

    if (newEntityFieldRows.length === 0) {
      setAddDialogTab("field");
      setExpandedFieldRowId("");
      setTransportFieldErrors(nextTransportErrors);
      setFieldRowErrors({});
      return;
    }

    newEntityFieldRows.forEach((row: NewEntityFieldRow) => {
      const rowErr: Partial<Record<FieldRowFieldKey, string>> = {};
      if (!row.fieldNumber.trim())
        rowErr.fieldNumber = "Field number is required";
      if (!row.quantity.trim()) rowErr.quantity = "Quantity is required";
      if (!row.partFull.trim()) rowErr.partFull = "Part/Full is required";
      if (!row.harvest.trim()) rowErr.harvest = "Harvest is required";
      if (!row.moisture.trim()) rowErr.moisture = "Moisture is required";
      if (Object.keys(rowErr).length > 0) nextFieldRowErrors[row.id] = rowErr;
    });

    setTransportFieldErrors(nextTransportErrors);
    setFieldRowErrors(nextFieldRowErrors);

    const hasTransportErrors = Object.keys(nextTransportErrors).length > 0;
    const fieldErrorRowIds = Object.keys(nextFieldRowErrors);
    const hasFieldErrors = fieldErrorRowIds.length > 0;

    if (hasTransportErrors) {
      setAddDialogTab("transport");
      return;
    }

    if (hasFieldErrors) {
      setAddDialogTab("field");
      setExpandedFieldRowId(fieldErrorRowIds[0]);
      return;
    }

    const newEntity: DispatchEntity = {
      id: editingEntityId || `entity-${Date.now()}`,
      vendor: newEntityForm.vendor,
      lrNumber: newEntityForm.lrNumber,
      truckNumber: newEntityForm.truckNumber,
      maxFreight: newEntityForm.maxFreight,
      productLocation: newEntityForm.productLocation,
      dispatchTime: newEntityForm.dispatchTime,
      rows: newEntityFieldRows.map((row: NewEntityFieldRow) => ({
        id: row.id,
        fieldNumber: row.fieldNumber,
        quantity: row.quantity,
        partFull: row.partFull,
        harvest: row.harvest,
        moisture: row.moisture,
        bags: row.bags,
      })),
      isSaved: true,
      isExpanded: true,
    };

    setDispatchEntities(
      editingEntityId
        ? dispatchEntities.map((entity: DispatchEntity) =>
            entity.id === editingEntityId ? newEntity : entity,
          )
        : [...dispatchEntities, newEntity],
    );
    setIsAddDialogOpen(false);
    setEditingEntityId("");
    setTransportFieldErrors({});
    setFieldRowErrors({});
    setNewEntityForm({
      vendor: "",
      lrNumber: "",
      truckNumber: "",
      maxFreight: "",
      productLocation: "",
      dispatchTime: "",
    });
    setNewEntityFieldRows([]);
    setExpandedFieldRowId("");
  };

  // Add a new row to an existing entity
  const handleAddRowToEntity = (
    entityId: string,
    fieldNumber: string,
    quantity: string,
  ) => {
    if (!fieldNumber.trim() || !quantity.trim()) {
      alert("Please fill in both Field Number and Quantity");
      return;
    }

    setDispatchEntities(
      dispatchEntities.map((entity: DispatchEntity) => {
        if (entity.id === entityId) {
          return {
            ...entity,
            rows: [
              ...entity.rows,
              {
                id: `row-${Date.now()}`,
                fieldNumber,
                quantity,
              },
            ],
          };
        }
        return entity;
      }),
    );
  };

  // Delete a row from an entity
  const handleDeleteRow = (entityId: string, rowId: string) => {
    setDispatchEntities(
      dispatchEntities.map((entity: DispatchEntity) => {
        if (entity.id === entityId) {
          return {
            ...entity,
            rows: entity.rows.filter((row) => row.id !== rowId),
          };
        }
        return entity;
      }),
    );
  };

  // Delete entire entity
  const handleDeleteEntity = (entityId: string) => {
    setDispatchEntities(
      dispatchEntities.filter(
        (entity: DispatchEntity) => entity.id !== entityId,
      ),
    );
  };

  // Toggle expanded state of entity
  const handleToggleExpanded = (entityId: string) => {
    setDispatchEntities(
      dispatchEntities.map((entity: DispatchEntity) => {
        if (entity.id === entityId) {
          return {
            ...entity,
            isExpanded: !entity.isExpanded,
          };
        }
        return entity;
      }),
    );
  };
  const filteredEntities = useMemo(() => {
    if (!searchQuery.trim()) return dispatchEntities;

    const query = searchQuery.toLowerCase();
    return dispatchEntities.filter((entity: DispatchEntity) => {
      const matchesLR = entity.lrNumber.toLowerCase().includes(query);
      const matchesTruck = entity.truckNumber.toLowerCase().includes(query);
      const matchesField = entity.rows.some((row) =>
        row.fieldNumber.toLowerCase().includes(query),
      );
      return matchesLR || matchesTruck || matchesField;
    });
  }, [dispatchEntities, searchQuery]);

  const filteredEntitiesWithTotals = useMemo(() => {
    return filteredEntities.map((entity: DispatchEntity) => {
      const totalQty = entity.rows.reduce(
        (sum: number, row: FieldQuantityRow) => {
          const val = Number.parseFloat(row.quantity);
          return sum + (Number.isFinite(val) ? val : 0);
        },
        0,
      );
      return { entity, totalQty };
    });
  }, [filteredEntities]);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header with Add Button */}
      <div className="px-2 pt-3 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Dispatch</h2>
            <p className="text-sm text-slate-500">Manage dispatch</p>
          </div>
          <button
            className="flex items-center gap-1.5 bg-[#4CAF50] hover:bg-[#388E3C] text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
            onClick={handleAddDispatchEntity}
          >
            <Plus className="h-3.5 w-3.5" />
            Create Dispatch Entity
          </button>
        </div>
      </div>

      {/* Search Bar - Show only if entities exist */}
      {dispatchEntities.length > 0 && (
        <div className="px-2 pb-3">
          <div className="flex gap-2 items-center px-2 py-1 rounded-lg border shadow-sm">
            <Search className="h-4 w-4 text-slate-400 shrink-0" />
            <Input
              placeholder="Search by LR Number, Truck Number, Field Number..."
              className="h-8 text-xs border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
            />
          </div>
        </div>
      )}

      {/* Dispatch Entities List */}
      <div className="flex-1 overflow-y-auto px-2 pb-20 space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {dispatchEntities.length > 0 && (
          <div className="px-2 flex items-center justify">
            <div className="flex items-center justify">
              <div className="text-sm text-slate-500">Total Dispatch</div>
              <div className="text-sm font-semibold text-slate-900 ml-2">
                {dispatchEntities.length}
              </div>
            </div>
            <div className="flex items-center justify ml-5">
              <div className="text-sm text-slate-500">Total Quantity</div>
              <div className="text-sm font-semibold text-slate-900 ml-2">
                {totalQuantity} kg
              </div>
            </div>
          </div>
        )}

        {filteredEntities.length === 0 && dispatchEntities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-slate-400 mb-2">No dispatch entities yet</div>
            {/* <Button
              variant="outline"
              size="sm"
              onClick={handleAddDispatchEntity}
            >
              Create your first entity
            </Button> */}
          </div>
        ) : filteredEntities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertOctagon className="h-8 w-8 text-slate-300 mb-2" />
            <div className="text-slate-400">No matching dispatch entities</div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEntitiesWithTotals.map(
              ({
                entity,
                totalQty,
              }: {
                entity: DispatchEntity;
                totalQty: number;
              }) => (
                <Card
                  key={entity.id}
                  className="overflow-hidden cursor-pointer"
                  onClick={() => handleOpenDetails(entity.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-slate-500">
                          DISPATCH ID
                        </div>
                        <div className="text-sm font-bold text-slate-900 truncate">
                          {entity.id}
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <div>
                            <div className="text-xs text-slate-500">
                              TRUCK NO.
                            </div>
                            <div className="text-sm font-medium text-slate-900">
                              {entity.truckNumber}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500">LR NO.</div>
                            <div className="text-sm font-medium text-slate-900">
                              {entity.lrNumber}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500">
                              TOTAL QTY.
                            </div>
                            <div className="text-sm font-medium text-slate-900">
                              {totalQty} kg
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ),
            )}
          </div>
        )}
      </div>

      {/* Dispatch Details Dialog */}
      <Dialog
        open={isDetailsDialogOpen}
        onOpenChange={(open: boolean) => {
          setIsDetailsDialogOpen(open);
          if (!open) {
            setViewingEntityId("");
            setDetailsExpandedRowIds([]);
            setIsDeleteFieldConfirmOpen(false);
            setPendingDeleteFieldRowId("");
            setIsEditingDetailsTransport(false);
            setEditingDetailsFieldRowId("");
            setIsAddingDetailsFieldRow(false);
            setDetailsNewFieldRowErrors({});
          }
        }}
      >
        <DialogContent
          hideCloseButton
          className="max-w-full h-full m-0 rounded-none p-0 flex flex-col"
        >
          <div className="px-4 py-3 border-b bg-[rgb(76,175,80)] text-white flex items-center gap-3 flex-shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-white hover:text-white hover:bg-white/10"
              onClick={() => setIsDetailsDialogOpen(false)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <div className="text-base font-bold truncate">
                Dispatch Details
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 pb-5 space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {viewingEntity && (
              <>
                <div className="space-y-1">
                  <div className="text-xs text-slate-500">DISPATCH ID</div>
                  <div className="text-sm font-bold text-slate-900">
                    {viewingEntity.id}
                  </div>
                </div>

                <Card className="overflow-hidden">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-slate-900">
                        Transport & Freight
                      </div>
                      {isEditingDetailsTransport ? (
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8"
                            onClick={() => {
                              setIsEditingDetailsTransport(false);
                              setDetailsTransportDraft({
                                vendor: viewingEntity.vendor ?? "",
                                truckNumber: viewingEntity.truckNumber ?? "",
                                lrNumber: viewingEntity.lrNumber ?? "",
                                maxFreight: viewingEntity.maxFreight ?? "",
                                productLocation:
                                  viewingEntity.productLocation ?? "",
                                dispatchTime: toDateTimeLocalValue(
                                  viewingEntity.dispatchTime ?? "",
                                ),
                              });
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            className="h-8 bg-[#4CAF50] hover:bg-[#388E3C] text-white"
                            onClick={() => {
                              setDispatchEntities(
                                dispatchEntities.map(
                                  (entity: DispatchEntity) =>
                                    entity.id === viewingEntity.id
                                      ? {
                                          ...entity,
                                          vendor: detailsTransportDraft.vendor,
                                          truckNumber:
                                            detailsTransportDraft.truckNumber,
                                          lrNumber:
                                            detailsTransportDraft.lrNumber,
                                          maxFreight:
                                            detailsTransportDraft.maxFreight,
                                          productLocation:
                                            detailsTransportDraft.productLocation,
                                          dispatchTime:
                                            detailsTransportDraft.dispatchTime,
                                        }
                                      : entity,
                                ),
                              );
                              setIsEditingDetailsTransport(false);
                            }}
                          >
                            Update
                          </Button>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setIsEditingDetailsTransport(true);
                            setDetailsTransportDraft({
                              vendor: viewingEntity.vendor ?? "",
                              truckNumber: viewingEntity.truckNumber ?? "",
                              lrNumber: viewingEntity.lrNumber ?? "",
                              maxFreight: viewingEntity.maxFreight ?? "",
                              productLocation:
                                viewingEntity.productLocation ?? "",
                              dispatchTime: toDateTimeLocalValue(
                                viewingEntity.dispatchTime ?? "",
                              ),
                            });
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-slate-500">VENDOR</div>
                        {isEditingDetailsTransport ? (
                          <Input
                            className="h-10 text-sm"
                            value={detailsTransportDraft.vendor}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) =>
                              setDetailsTransportDraft({
                                ...detailsTransportDraft,
                                vendor: e.target.value,
                              })
                            }
                          />
                        ) : (
                          <div className="text-sm font-medium text-slate-900">
                            {viewingEntity.vendor || "-"}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">TRUCK NO.</div>
                        {isEditingDetailsTransport ? (
                          <Input
                            className="h-10 text-sm"
                            value={detailsTransportDraft.truckNumber}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) =>
                              setDetailsTransportDraft({
                                ...detailsTransportDraft,
                                truckNumber: e.target.value,
                              })
                            }
                          />
                        ) : (
                          <div className="text-sm font-medium text-slate-900">
                            {viewingEntity.truckNumber}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">LR NO.</div>
                        {isEditingDetailsTransport ? (
                          <Input
                            className="h-10 text-sm"
                            value={detailsTransportDraft.lrNumber}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) =>
                              setDetailsTransportDraft({
                                ...detailsTransportDraft,
                                lrNumber: e.target.value,
                              })
                            }
                          />
                        ) : (
                          <div className="text-sm font-medium text-slate-900">
                            {viewingEntity.lrNumber}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">
                          MAX FREIGHT
                        </div>
                        {isEditingDetailsTransport ? (
                          <Input
                            className="h-10 text-sm"
                            value={detailsTransportDraft.maxFreight}
                            type="number"
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) =>
                              setDetailsTransportDraft({
                                ...detailsTransportDraft,
                                maxFreight: e.target.value,
                              })
                            }
                          />
                        ) : (
                          <div className="text-sm font-medium text-slate-900">
                            {viewingEntity.maxFreight
                              ? viewingEntity.maxFreight + " kg"
                              : "-"}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">
                          PRODUCT LOCATION
                        </div>
                        {isEditingDetailsTransport ? (
                          <Input
                            className="h-10 text-sm"
                            value={detailsTransportDraft.productLocation}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) =>
                              setDetailsTransportDraft({
                                ...detailsTransportDraft,
                                productLocation: e.target.value,
                              })
                            }
                          />
                        ) : (
                          <div className="text-sm font-medium text-slate-900">
                            {viewingEntity.productLocation || "-"}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">
                          DISPATCH TIME
                        </div>
                        {isEditingDetailsTransport ? (
                          <Input
                            type="datetime-local"
                            lang="en-GB"
                            className="h-10 text-sm pr-10 bg-white text-slate-900 [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:p-1"
                            value={detailsTransportDraft.dispatchTime}
                            onClick={(
                              e: React.MouseEvent<HTMLInputElement>,
                            ) => {
                              const el = e.currentTarget as unknown as {
                                showPicker?: () => void;
                              };
                              el.showPicker?.();
                            }}
                            onFocus={(
                              e: React.FocusEvent<HTMLInputElement>,
                            ) => {
                              const el = e.currentTarget as unknown as {
                                showPicker?: () => void;
                              };
                              el.showPicker?.();
                            }}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) =>
                              setDetailsTransportDraft({
                                ...detailsTransportDraft,
                                dispatchTime: e.target.value,
                              })
                            }
                          />
                        ) : (
                          <div className="text-sm font-medium text-slate-900">
                            {formatDispatchTime(
                              viewingEntity.dispatchTime ?? "",
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      {/* <div className="pt-2 border-t"> */}
                      <div className="text-xs text-slate-500">TOTAL QTY.</div>
                      <div className="text-sm font-bold text-slate-900">
                        {viewingEntityTotalQty}
                      </div>
                      {/* </div> */}
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-slate-900">
                        Fields
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1"
                        onClick={() => {
                          setEditingDetailsFieldRowId("");
                          setIsAddingDetailsFieldRow(true);
                          setDetailsNewFieldRowDraft({
                            fieldNumber: "",
                            quantity: "",
                            partFull: "",
                            harvest: toDateValue(""),
                            moisture: "",
                            bags: "",
                          });
                          setDetailsNewFieldRowErrors({});
                        }}
                      >
                        <Plus className="h-4 w-4" />
                        Add
                      </Button>
                    </div>

                    {isAddingDetailsFieldRow && (
                      <Card className="overflow-hidden border border-slate-200">
                        <div className="px-4 py-3 bg-slate-50 border-b flex items-center justify-between">
                          <div className="min-w-0">
                            <div className="text-xs text-slate-500">
                              NEW FIELD
                            </div>
                            <div className="text-sm font-medium text-slate-900 truncate">
                              Add field details
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-8"
                              onClick={() => {
                                setIsAddingDetailsFieldRow(false);
                                setDetailsNewFieldRowDraft({
                                  fieldNumber: "",
                                  quantity: "",
                                  partFull: "",
                                  harvest: toDateValue(""),
                                  moisture: "",
                                  bags: "",
                                });
                                setDetailsNewFieldRowErrors({});
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              className="h-8 bg-[#4CAF50] hover:bg-[#388E3C] text-white"
                              onClick={() => {
                                if (!viewingEntity) return;
                                const nextErrors: Partial<
                                  Record<FieldRowFieldKey, string>
                                > = {};
                                if (!detailsNewFieldRowDraft.fieldNumber.trim())
                                  nextErrors.fieldNumber =
                                    "Field number is required";
                                if (!detailsNewFieldRowDraft.quantity.trim())
                                  nextErrors.quantity = "Quantity is required";
                                if (!detailsNewFieldRowDraft.partFull.trim())
                                  nextErrors.partFull = "Part/Full is required";
                                if (!detailsNewFieldRowDraft.harvest.trim())
                                  nextErrors.harvest = "Harvest is required";
                                if (!detailsNewFieldRowDraft.moisture.trim())
                                  nextErrors.moisture = "Moisture is required";

                                setDetailsNewFieldRowErrors(nextErrors);
                                if (Object.keys(nextErrors).length > 0) return;

                                const newRowId = `row-${Date.now()}`;
                                const newRow: FieldQuantityRow = {
                                  id: newRowId,
                                  fieldNumber:
                                    detailsNewFieldRowDraft.fieldNumber,
                                  quantity: detailsNewFieldRowDraft.quantity,
                                  partFull: detailsNewFieldRowDraft.partFull,
                                  harvest: detailsNewFieldRowDraft.harvest,
                                  moisture: detailsNewFieldRowDraft.moisture,
                                  bags: detailsNewFieldRowDraft.bags,
                                };

                                setDispatchEntities(
                                  dispatchEntities.map(
                                    (entity: DispatchEntity) =>
                                      entity.id === viewingEntity.id
                                        ? {
                                            ...entity,
                                            rows: [...entity.rows, newRow],
                                          }
                                        : entity,
                                  ),
                                );
                                setDetailsExpandedRowIds((prev: string[]) =>
                                  prev.includes(newRowId)
                                    ? prev
                                    : [...prev, newRowId],
                                );
                                setIsAddingDetailsFieldRow(false);
                                setDetailsNewFieldRowDraft({
                                  fieldNumber: "",
                                  quantity: "",
                                  partFull: "",
                                  harvest: "",
                                  moisture: "",
                                  bags: "",
                                });
                                setDetailsNewFieldRowErrors({});
                              }}
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <div className="text-xs text-slate-500">
                                FIELD NO.
                              </div>
                              <Select
                                value={detailsNewFieldRowDraft.fieldNumber}
                                onValueChange={(value: string) =>
                                  setDetailsNewFieldRowDraft({
                                    ...detailsNewFieldRowDraft,
                                    fieldNumber: value,
                                  })
                                }
                              >
                                <SelectTrigger className="h-10 text-sm">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  {fieldNumberOptions.map((option: string) => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {detailsNewFieldRowErrors.fieldNumber && (
                                <div className="text-xs text-red-600 mt-1">
                                  {detailsNewFieldRowErrors.fieldNumber}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="text-xs text-slate-500">QTY.</div>
                              <Input
                                type="number"
                                className="h-10 text-sm"
                                value={detailsNewFieldRowDraft.quantity}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>,
                                ) =>
                                  setDetailsNewFieldRowDraft({
                                    ...detailsNewFieldRowDraft,
                                    quantity: e.target.value,
                                  })
                                }
                              />
                              {detailsNewFieldRowErrors.quantity && (
                                <div className="text-xs text-red-600 mt-1">
                                  {detailsNewFieldRowErrors.quantity}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="text-xs text-slate-500">
                                PART/FULL
                              </div>
                              <Select
                                value={detailsNewFieldRowDraft.partFull}
                                onValueChange={(value: string) =>
                                  setDetailsNewFieldRowDraft({
                                    ...detailsNewFieldRowDraft,
                                    partFull: value,
                                  })
                                }
                              >
                                <SelectTrigger className="h-10 text-sm">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Part">Part</SelectItem>
                                  <SelectItem value="Full">Full</SelectItem>
                                </SelectContent>
                              </Select>
                              {detailsNewFieldRowErrors.partFull && (
                                <div className="text-xs text-red-600 mt-1">
                                  {detailsNewFieldRowErrors.partFull}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="text-xs text-slate-500">
                                HARVEST
                              </div>
                              <Input
                                type="date"
                                className="h-10 text-sm pr-10 bg-white text-slate-900 [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:p-1"
                                value={detailsNewFieldRowDraft.harvest}
                                onClick={(
                                  e: React.MouseEvent<HTMLInputElement>,
                                ) => {
                                  const el = e.currentTarget as unknown as {
                                    showPicker?: () => void;
                                  };
                                  el.showPicker?.();
                                }}
                                onFocus={(
                                  e: React.FocusEvent<HTMLInputElement>,
                                ) => {
                                  const el = e.currentTarget as unknown as {
                                    showPicker?: () => void;
                                  };
                                  el.showPicker?.();
                                }}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>,
                                ) =>
                                  setDetailsNewFieldRowDraft({
                                    ...detailsNewFieldRowDraft,
                                    harvest: e.target.value,
                                  })
                                }
                              />
                              {detailsNewFieldRowErrors.harvest && (
                                <div className="text-xs text-red-600 mt-1">
                                  {detailsNewFieldRowErrors.harvest}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="text-xs text-slate-500">
                                MOISTURE
                              </div>
                              <Input
                                className="h-10 text-sm"
                                value={detailsNewFieldRowDraft.moisture}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>,
                                ) =>
                                  setDetailsNewFieldRowDraft({
                                    ...detailsNewFieldRowDraft,
                                    moisture: e.target.value,
                                  })
                                }
                              />
                              {detailsNewFieldRowErrors.moisture && (
                                <div className="text-xs text-red-600 mt-1">
                                  {detailsNewFieldRowErrors.moisture}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="text-xs text-slate-500">BAGS</div>
                              <Input
                                type="number"
                                className="h-10 text-sm"
                                value={detailsNewFieldRowDraft.bags}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>,
                                ) =>
                                  setDetailsNewFieldRowDraft({
                                    ...detailsNewFieldRowDraft,
                                    bags: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <div className="space-y-2">
                      {viewingEntity.rows.map((row: FieldQuantityRow) => {
                        const isExpanded = detailsExpandedRowIds.includes(
                          row.id,
                        );
                        return (
                          <Card key={row.id} className="overflow-hidden">
                            <div
                              className="px-4 py-3 bg-slate-50 border-b flex items-center justify-between cursor-pointer"
                              onClick={() =>
                                setDetailsExpandedRowIds((prev: string[]) =>
                                  prev.includes(row.id)
                                    ? prev.filter((id: string) => id !== row.id)
                                    : [...prev, row.id],
                                )
                              }
                            >
                              <div className="min-w-0">
                                <div className="text-xs text-slate-500">
                                  FIELD
                                </div>
                                <div className="text-sm font-medium text-slate-900 truncate">
                                  {row.fieldNumber || "-"}
                                </div>
                              </div>

                              <div className="flex items-center gap-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={(
                                    e: React.MouseEvent<HTMLButtonElement>,
                                  ) => {
                                    e.stopPropagation();
                                    setEditingDetailsFieldRowId(row.id);
                                    setDetailsFieldRowDraft({
                                      fieldNumber: row.fieldNumber ?? "",
                                      quantity: row.quantity ?? "",
                                      partFull: row.partFull ?? "",
                                      harvest: toDateValue(row.harvest ?? ""),
                                      moisture: row.moisture ?? "",
                                      bags: row.bags ?? "",
                                    });
                                    if (
                                      !detailsExpandedRowIds.includes(row.id)
                                    ) {
                                      setDetailsExpandedRowIds([
                                        ...detailsExpandedRowIds,
                                        row.id,
                                      ]);
                                    }
                                  }}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={(
                                    e: React.MouseEvent<HTMLButtonElement>,
                                  ) => {
                                    e.stopPropagation();
                                    setPendingDeleteFieldRowId(row.id);
                                    setIsDeleteFieldConfirmOpen(true);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                                <ChevronDown
                                  className={`h-4 w-4 text-slate-500 transition-transform ${
                                    isExpanded ? "rotate-180" : ""
                                  }`}
                                />
                              </div>
                            </div>

                            {isExpanded && (
                              <CardContent className="px-4 pt-2 pb-4">
                                {editingDetailsFieldRowId === row.id && (
                                  <div className="flex justify-end gap-2 mb-3">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      className="h-8"
                                      onClick={() => {
                                        setEditingDetailsFieldRowId("");
                                        setDetailsFieldRowDraft({
                                          fieldNumber: "",
                                          quantity: "",
                                          partFull: "",
                                          harvest: "",
                                          moisture: "",
                                          bags: "",
                                        });
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      type="button"
                                      size="sm"
                                      className="h-8 bg-[#4CAF50] hover:bg-[#388E3C] text-white"
                                      onClick={() => {
                                        setDispatchEntities(
                                          dispatchEntities.map(
                                            (entity: DispatchEntity) =>
                                              entity.id === viewingEntity.id
                                                ? {
                                                    ...entity,
                                                    rows: entity.rows.map(
                                                      (r: FieldQuantityRow) =>
                                                        r.id === row.id
                                                          ? {
                                                              ...r,
                                                              fieldNumber:
                                                                detailsFieldRowDraft.fieldNumber,
                                                              quantity:
                                                                detailsFieldRowDraft.quantity,
                                                              partFull:
                                                                detailsFieldRowDraft.partFull,
                                                              harvest:
                                                                detailsFieldRowDraft.harvest,
                                                              moisture:
                                                                detailsFieldRowDraft.moisture,
                                                              bags: detailsFieldRowDraft.bags,
                                                            }
                                                          : r,
                                                    ),
                                                  }
                                                : entity,
                                          ),
                                        );
                                        setEditingDetailsFieldRowId("");
                                      }}
                                    >
                                      Update
                                    </Button>
                                  </div>
                                )}

                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <div className="text-xs text-slate-500">
                                      FIELD NO.
                                    </div>
                                    {editingDetailsFieldRowId === row.id ? (
                                      <Select
                                        value={detailsFieldRowDraft.fieldNumber}
                                        onValueChange={(value: string) =>
                                          setDetailsFieldRowDraft({
                                            ...detailsFieldRowDraft,
                                            fieldNumber: value,
                                          })
                                        }
                                      >
                                        <SelectTrigger className="h-10 text-sm">
                                          <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {fieldNumberOptions.map(
                                            (option: string) => (
                                              <SelectItem
                                                key={option}
                                                value={option}
                                              >
                                                {option}
                                              </SelectItem>
                                            ),
                                          )}
                                        </SelectContent>
                                      </Select>
                                    ) : (
                                      <div className="text-sm font-medium text-slate-900">
                                        {row.fieldNumber || "-"}
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <div className="text-xs text-slate-500">
                                      QTY.
                                    </div>
                                    {editingDetailsFieldRowId === row.id ? (
                                      <Input
                                        type="number"
                                        className="h-10 text-sm"
                                        value={detailsFieldRowDraft.quantity}
                                        onChange={(
                                          e: React.ChangeEvent<HTMLInputElement>,
                                        ) =>
                                          setDetailsFieldRowDraft({
                                            ...detailsFieldRowDraft,
                                            quantity: e.target.value,
                                          })
                                        }
                                      />
                                    ) : (
                                      <div className="text-sm font-medium text-slate-900">
                                        {row.quantity || "-"}
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <div className="text-xs text-slate-500">
                                      PART/FULL
                                    </div>
                                    {editingDetailsFieldRowId === row.id ? (
                                      <Select
                                        value={detailsFieldRowDraft.partFull}
                                        onValueChange={(value: string) =>
                                          setDetailsFieldRowDraft({
                                            ...detailsFieldRowDraft,
                                            partFull: value,
                                          })
                                        }
                                      >
                                        <SelectTrigger className="h-10 text-sm">
                                          <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Part">
                                            Part
                                          </SelectItem>
                                          <SelectItem value="Full">
                                            Full
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    ) : (
                                      <div className="text-sm font-medium text-slate-900">
                                        {row.partFull || "-"}
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <div className="text-xs text-slate-500">
                                      HARVEST
                                    </div>
                                    {editingDetailsFieldRowId === row.id ? (
                                      <Input
                                        type="date"
                                        className="h-10 text-sm pr-10 bg-white text-slate-900 [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:p-1"
                                        value={detailsFieldRowDraft.harvest}
                                        onClick={(
                                          e: React.MouseEvent<HTMLInputElement>,
                                        ) => {
                                          const el =
                                            e.currentTarget as unknown as {
                                              showPicker?: () => void;
                                            };
                                          el.showPicker?.();
                                        }}
                                        onFocus={(
                                          e: React.FocusEvent<HTMLInputElement>,
                                        ) => {
                                          const el =
                                            e.currentTarget as unknown as {
                                              showPicker?: () => void;
                                            };
                                          el.showPicker?.();
                                        }}
                                        onChange={(
                                          e: React.ChangeEvent<HTMLInputElement>,
                                        ) =>
                                          setDetailsFieldRowDraft({
                                            ...detailsFieldRowDraft,
                                            harvest: e.target.value,
                                          })
                                        }
                                      />
                                    ) : (
                                      <div className="text-sm font-medium text-slate-900">
                                        {formatHarvestDate(row.harvest ?? "")}
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <div className="text-xs text-slate-500">
                                      MOISTURE
                                    </div>
                                    {editingDetailsFieldRowId === row.id ? (
                                      <Input
                                        className="h-10 text-sm"
                                        value={detailsFieldRowDraft.moisture}
                                        onChange={(
                                          e: React.ChangeEvent<HTMLInputElement>,
                                        ) =>
                                          setDetailsFieldRowDraft({
                                            ...detailsFieldRowDraft,
                                            moisture: e.target.value,
                                          })
                                        }
                                      />
                                    ) : (
                                      <div className="text-sm font-medium text-slate-900">
                                        {row.moisture || "-"}
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <div className="text-xs text-slate-500">
                                      BAGS
                                    </div>
                                    {editingDetailsFieldRowId === row.id ? (
                                      <Input
                                        type="number"
                                        className="h-10 text-sm"
                                        value={detailsFieldRowDraft.bags}
                                        onChange={(
                                          e: React.ChangeEvent<HTMLInputElement>,
                                        ) =>
                                          setDetailsFieldRowDraft({
                                            ...detailsFieldRowDraft,
                                            bags: e.target.value,
                                          })
                                        }
                                      />
                                    ) : (
                                      <div className="text-sm font-medium text-slate-900">
                                        {row.bags || "-"}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            )}
                          </Card>
                        );
                      })}
                    </div>

                    {/* <div className="pt-2 border-t">
                      <div className="text-xs text-slate-500">TOTAL QTY.</div>
                      <div className="text-sm font-bold text-slate-900">
                        {viewingEntityTotalQty}
                      </div>
                    </div> */}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDeleteCreateFieldConfirmOpen}
        onOpenChange={(open: boolean) => {
          setIsDeleteCreateFieldConfirmOpen(open);
          if (!open) setPendingDeleteCreateFieldRowId("");
        }}
      >
        <DialogContent
          overlayClassName="z-[60]"
          className="w-[calc(90%-1rem)] max-w-sm z-[60]"
        >
          <DialogHeader>
            <DialogTitle className="text-base">Delete Field</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this field?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteCreateFieldConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                if (!pendingDeleteCreateFieldRowId) return;
                const next = newEntityFieldRows.filter(
                  (r: NewEntityFieldRow) =>
                    r.id !== pendingDeleteCreateFieldRowId,
                );
                setNewEntityFieldRows(next);

                setFieldRowErrors(
                  (
                    prev: Record<
                      string,
                      Partial<Record<FieldRowFieldKey, string>>
                    >,
                  ) => {
                    const { [pendingDeleteCreateFieldRowId]: _, ...rest } =
                      prev;
                    return rest;
                  },
                );

                if (expandedFieldRowId === pendingDeleteCreateFieldRowId) {
                  setExpandedFieldRowId(
                    next.length > 0 ? next[next.length - 1].id : "",
                  );
                }
                setIsDeleteCreateFieldConfirmOpen(false);
                setPendingDeleteCreateFieldRowId("");
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDeleteFieldConfirmOpen}
        onOpenChange={(open: boolean) => {
          setIsDeleteFieldConfirmOpen(open);
          if (!open) setPendingDeleteFieldRowId("");
        }}
      >
        <DialogContent
          overlayClassName="z-[60]"
          className="w-[calc(90%-1rem)] max-w-sm z-[60]"
        >
          <DialogHeader>
            <DialogTitle className="text-base">Delete Field</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this field?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteFieldConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                if (!viewingEntityId || !pendingDeleteFieldRowId) return;
                handleDeleteRow(viewingEntityId, pendingDeleteFieldRowId);
                setDetailsExpandedRowIds((prev: string[]) =>
                  prev.filter((id: string) => id !== pendingDeleteFieldRowId),
                );
                setIsDeleteFieldConfirmOpen(false);
                setPendingDeleteFieldRowId("");
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Entity Dialog */}
      <Dialog
        open={isAddDialogOpen}
        onOpenChange={(open: boolean) => {
          setIsAddDialogOpen(open);
          if (!open) {
            setEditingEntityId("");
            setTransportFieldErrors({});
            setFieldRowErrors({});
            setIsDeleteCreateFieldConfirmOpen(false);
            setPendingDeleteCreateFieldRowId("");
          }
        }}
      >
        <DialogContent className="max-w-full h-full m-0 rounded-none p-0 flex flex-col">
          <DialogTitle className="sr-only">Add Dispatch Entity</DialogTitle>
          <DialogDescription className="sr-only">
            Create a new dispatch entity with LR number, truck number, and items
          </DialogDescription>

          {/* Green Header */}
          <div className="px-4 py-3 border-b bg-[rgb(76,175,80)] text-white flex justify-between items-center flex-shrink-0">
            <div className="flex-1">
              <h2 className="text-lg font-bold leading-none">
                {isEditing
                  ? "Update Dispatch Entity"
                  : "Create Dispatch Entity"}
              </h2>
              <p className="text-xs text-[rgb(255,255,255)] mt-1">
                Fill in the dispatch details
              </p>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-4 pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <Tabs value={addDialogTab} onValueChange={setAddDialogTab}>
              <TabsList className="w-full gap-2">
                <TabsTrigger
                  value="transport"
                  className="data-[state=active]:bg-[#4CAF50] data-[state=active]:text-white"
                >
                  Transport
                </TabsTrigger>
                <TabsTrigger
                  value="field"
                  className="data-[state=active]:bg-[#4CAF50] data-[state=active]:text-white"
                >
                  Field
                </TabsTrigger>
              </TabsList>

              <TabsContent value="transport">
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label className="text-base font-medium">
                      Vendor <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      placeholder="Enter vendor"
                      className="h-12 text-base"
                      value={newEntityForm.vendor}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewEntityForm({
                          ...newEntityForm,
                          vendor: e.target.value,
                        })
                      }
                    />
                    {transportFieldErrors.vendor && (
                      <div className="text-sm text-red-600">
                        {transportFieldErrors.vendor}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-medium">
                      Truck Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      placeholder="Enter truck number"
                      className="h-12 text-base"
                      value={newEntityForm.truckNumber}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewEntityForm({
                          ...newEntityForm,
                          truckNumber: e.target.value,
                        })
                      }
                    />
                    {transportFieldErrors.truckNumber && (
                      <div className="text-sm text-red-600">
                        {transportFieldErrors.truckNumber}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-medium">
                      LR Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      placeholder="Enter LR number"
                      className="h-12 text-base"
                      value={newEntityForm.lrNumber}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewEntityForm({
                          ...newEntityForm,
                          lrNumber: e.target.value,
                        })
                      }
                    />
                    {transportFieldErrors.lrNumber && (
                      <div className="text-sm text-red-600">
                        {transportFieldErrors.lrNumber}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-medium">
                      Max Freight <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      placeholder="Enter max freight"
                      type="number"
                      className="h-12 text-base"
                      value={newEntityForm.maxFreight}
                      required
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewEntityForm({
                          ...newEntityForm,
                          maxFreight: e.target.value,
                        })
                      }
                    />
                    {transportFieldErrors.maxFreight && (
                      <div className="text-sm text-red-600">
                        {transportFieldErrors.maxFreight}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-medium">
                      Product location <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      placeholder="Enter product location"
                      className="h-12 text-base"
                      value={newEntityForm.productLocation}
                      required
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewEntityForm({
                          ...newEntityForm,
                          productLocation: e.target.value,
                        })
                      }
                    />
                    {transportFieldErrors.productLocation && (
                      <div className="text-sm text-red-600">
                        {transportFieldErrors.productLocation}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-medium">
                      Dispatch time <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="datetime-local"
                      lang="en-GB"
                      className="h-12 text-base"
                      value={newEntityForm.dispatchTime}
                      required
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewEntityForm({
                          ...newEntityForm,
                          dispatchTime: e.target.value,
                        })
                      }
                    />
                    {transportFieldErrors.dispatchTime && (
                      <div className="text-sm text-red-600">
                        {transportFieldErrors.dispatchTime}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="field">
                <div className="space-y-4 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 gap-2 border-slate-200 hover:bg-slate-50"
                    onClick={() => {
                      if (newEntityFieldRows.length > 0) {
                        const lastRow =
                          newEntityFieldRows[newEntityFieldRows.length - 1];
                        const lastRowErrors =
                          getFieldRowValidationErrors(lastRow);
                        if (Object.keys(lastRowErrors).length > 0) {
                          setAddDialogTab("field");
                          setExpandedFieldRowId(lastRow.id);
                          setFieldRowErrors(
                            (
                              prev: Record<
                                string,
                                Partial<Record<FieldRowFieldKey, string>>
                              >,
                            ) => ({
                              ...prev,
                              [lastRow.id]: lastRowErrors,
                            }),
                          );
                          return;
                        }
                      }

                      const id = `row-${Date.now()}`;
                      setNewEntityFieldRows([
                        ...newEntityFieldRows,
                        {
                          id,
                          fieldNumber: "",
                          quantity: "",
                          partFull: "",
                          harvest: "",
                          moisture: "",
                          bags: "",
                        },
                      ]);
                      setExpandedFieldRowId(id);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    Add Field
                  </Button>

                  <div className="space-y-3">
                    {newEntityFieldRows.map(
                      (row: NewEntityFieldRow, index: number) => {
                        const isExpanded = expandedFieldRowId === row.id;
                        return (
                          <Card key={row.id} className="overflow-hidden">
                            <div
                              className="px-4 py-3 bg-slate-50 border-b flex items-center justify-between cursor-pointer"
                              onClick={() =>
                                setExpandedFieldRowId(isExpanded ? "" : row.id)
                              }
                            >
                              <div className="min-w-0">
                                <div className="text-xs text-slate-500 font-semibold">
                                  FIELD {index + 1}
                                </div>
                                <div className="text-sm font-medium text-slate-900 truncate">
                                  {row.fieldNumber?.trim()
                                    ? row.fieldNumber
                                    : "Select field"}
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={(
                                    e: React.MouseEvent<HTMLButtonElement>,
                                  ) => {
                                    e.stopPropagation();
                                    setPendingDeleteCreateFieldRowId(row.id);
                                    setIsDeleteCreateFieldConfirmOpen(true);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                                <ChevronDown
                                  className={`h-4 w-4 text-slate-500 transition-transform ${
                                    isExpanded ? "rotate-180" : ""
                                  }`}
                                />
                              </div>
                            </div>

                            {isExpanded && (
                              <CardContent className="p-4 space-y-4">
                                <div className="space-y-2">
                                  <Label className="text-base font-medium">
                                    Field number{" "}
                                    <span className="text-red-500">*</span>
                                  </Label>
                                  <Select
                                    value={row.fieldNumber}
                                    onValueChange={(value: string) =>
                                      setNewEntityFieldRows(
                                        newEntityFieldRows.map(
                                          (r: NewEntityFieldRow) =>
                                            r.id === row.id
                                              ? { ...r, fieldNumber: value }
                                              : r,
                                        ),
                                      )
                                    }
                                  >
                                    <SelectTrigger className="h-12 text-base">
                                      <SelectValue placeholder="Select field number" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {fieldNumberOptions.map(
                                        (option: string) => (
                                          <SelectItem
                                            key={option}
                                            value={option}
                                          >
                                            {option}
                                          </SelectItem>
                                        ),
                                      )}
                                    </SelectContent>
                                  </Select>
                                  {fieldRowErrors[row.id]?.fieldNumber && (
                                    <div className="text-sm text-red-600">
                                      {fieldRowErrors[row.id]?.fieldNumber}
                                    </div>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-base font-medium">
                                    Quantity{" "}
                                    <span className="text-red-500">*</span>
                                  </Label>
                                  <Input
                                    placeholder="Enter quantity"
                                    type="number"
                                    className="h-12 text-base"
                                    value={row.quantity}
                                    onChange={(
                                      e: React.ChangeEvent<HTMLInputElement>,
                                    ) =>
                                      setNewEntityFieldRows(
                                        newEntityFieldRows.map(
                                          (r: NewEntityFieldRow) =>
                                            r.id === row.id
                                              ? {
                                                  ...r,
                                                  quantity: e.target.value,
                                                }
                                              : r,
                                        ),
                                      )
                                    }
                                  />
                                  {fieldRowErrors[row.id]?.quantity && (
                                    <div className="text-sm text-red-600">
                                      {fieldRowErrors[row.id]?.quantity}
                                    </div>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-base font-medium">
                                    Part/Full{" "}
                                    <span className="text-red-500">*</span>
                                  </Label>
                                  <Select
                                    value={row.partFull}
                                    onValueChange={(value: string) =>
                                      setNewEntityFieldRows(
                                        newEntityFieldRows.map(
                                          (r: NewEntityFieldRow) =>
                                            r.id === row.id
                                              ? { ...r, partFull: value }
                                              : r,
                                        ),
                                      )
                                    }
                                  >
                                    <SelectTrigger className="h-12 text-base">
                                      <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Part">Part</SelectItem>
                                      <SelectItem value="Full">Full</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  {fieldRowErrors[row.id]?.partFull && (
                                    <div className="text-sm text-red-600">
                                      {fieldRowErrors[row.id]?.partFull}
                                    </div>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-base font-medium">
                                    Harvest{" "}
                                    <span className="text-red-500">*</span>
                                  </Label>
                                  <Input
                                    type="date"
                                    className="h-12 text-base"
                                    value={row.harvest}
                                    onChange={(
                                      e: React.ChangeEvent<HTMLInputElement>,
                                    ) =>
                                      setNewEntityFieldRows(
                                        newEntityFieldRows.map(
                                          (r: NewEntityFieldRow) =>
                                            r.id === row.id
                                              ? {
                                                  ...r,
                                                  harvest: e.target.value,
                                                }
                                              : r,
                                        ),
                                      )
                                    }
                                  />
                                  {fieldRowErrors[row.id]?.harvest && (
                                    <div className="text-sm text-red-600">
                                      {fieldRowErrors[row.id]?.harvest}
                                    </div>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-base font-medium">
                                    Moisture{" "}
                                    <span className="text-red-500">*</span>
                                  </Label>
                                  <Input
                                    placeholder="Enter moisture"
                                    value={row.moisture}
                                    onChange={(
                                      e: React.ChangeEvent<HTMLInputElement>,
                                    ) =>
                                      setNewEntityFieldRows(
                                        newEntityFieldRows.map(
                                          (r: NewEntityFieldRow) =>
                                            r.id === row.id
                                              ? {
                                                  ...r,
                                                  moisture: e.target.value,
                                                }
                                              : r,
                                        ),
                                      )
                                    }
                                    className="h-12 text-base"
                                  />
                                  {fieldRowErrors[row.id]?.moisture && (
                                    <div className="text-sm text-red-600">
                                      {fieldRowErrors[row.id]?.moisture}
                                    </div>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-base font-medium">
                                    Bags
                                  </Label>
                                  <Input
                                    placeholder="Enter bags"
                                    type="number"
                                    value={row.bags}
                                    onChange={(
                                      e: React.ChangeEvent<HTMLInputElement>,
                                    ) =>
                                      setNewEntityFieldRows(
                                        newEntityFieldRows.map(
                                          (r: NewEntityFieldRow) =>
                                            r.id === row.id
                                              ? { ...r, bags: e.target.value }
                                              : r,
                                        ),
                                      )
                                    }
                                    className="h-12 text-base"
                                  />
                                </div>
                              </CardContent>
                            )}
                          </Card>
                        );
                      },
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Footer Buttons */}
          <DialogFooter className="px-4 py-4 border-t bg-white flex-shrink-0">
            <div className="flex gap-2 w-full">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-10 text-sm"
                onClick={() => {
                  setIsAddDialogOpen(false);
                  setEditingEntityId("");
                  setTransportFieldErrors({});
                  setFieldRowErrors({});
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="flex-1 h-10 bg-[#4CAF50] hover:bg-[#388E3C] text-sm text-white"
                onClick={handleSaveNewEntity}
              >
                <Check className="h-4 w-4 mr-1" />
                {isEditing ? "Update" : "Create"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Sub-component for adding rows to an entity
interface EntityAddRowProps {
  entityId: string;
  onAddRow: (entityId: string, fieldNumber: string, quantity: string) => void;
}

function EntityAddRow({ entityId, onAddRow }: EntityAddRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [fieldNumber, setFieldNumber] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleAddRow = () => {
    onAddRow(entityId, fieldNumber, quantity);
    setFieldNumber("");
    setQuantity("");
    setIsExpanded(false);
  };

  return (
    <div className="space-y-2">
      {isExpanded ? (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Field Number</Label>
              <Input
                placeholder="Enter field number"
                value={fieldNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFieldNumber(e.target.value)
                }
                className="h-10 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Quantity</Label>
              <Input
                placeholder="Enter quantity"
                type="number"
                value={quantity}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setQuantity(e.target.value)
                }
                className="h-10 text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 h-9 text-sm"
              onClick={() => {
                setIsExpanded(false);
                setFieldNumber("");
                setQuantity("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddRow}
              className="flex-1 h-9 bg-[#4CAF50] hover:bg-[#388E3C] text-white text-sm gap-1"
            >
              <Plus className="h-3 w-3" />
              Add
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full h-10 gap-2 border-blue-200 hover:bg-blue-50 text-blue-600"
          onClick={() => setIsExpanded(true)}
        >
          <Plus className="h-4 w-4" />
          Add Field & Quantity
        </Button>
      )}
    </div>
  );
}
