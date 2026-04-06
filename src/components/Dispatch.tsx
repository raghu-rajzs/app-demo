import React, { useState, useMemo } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
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
} from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

interface FieldQuantityRow {
  id: string;
  fieldNumber: string;
  quantity: string;
}

interface DispatchEntity {
  id: string;
  lrNumber: string;
  truckNumber: string;
  rows: FieldQuantityRow[];
  isSaved: boolean;
  isExpanded: boolean;
}

export function Dispatch() {
  const [dispatchEntities, setDispatchEntities] = useState<DispatchEntity[]>(
    [],
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Form state for new entity
  const [newEntityForm, setNewEntityForm] = useState({
    lrNumber: "",
    truckNumber: "",
    fieldNumber: "",
    quantity: "",
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Handle adding a new dispatch entity
  const handleAddDispatchEntity = () => {
    setNewEntityForm({
      lrNumber: "",
      truckNumber: "",
      fieldNumber: "",
      quantity: "",
    });
    setValidationErrors([]);
    setIsAddDialogOpen(true);
  };

  // Validate and save new entity
  const handleSaveNewEntity = () => {
    const errors: string[] = [];
    if (!newEntityForm.lrNumber.trim()) errors.push("LR Number is required");
    if (!newEntityForm.truckNumber.trim())
      errors.push("Truck Number is required");
    if (!newEntityForm.fieldNumber.trim())
      errors.push("Field Number is required");
    if (!newEntityForm.quantity.trim()) errors.push("Quantity is required");

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    const newEntity: DispatchEntity = {
      id: `entity-${Date.now()}`,
      lrNumber: newEntityForm.lrNumber,
      truckNumber: newEntityForm.truckNumber,
      rows: [
        {
          id: `row-${Date.now()}`,
          fieldNumber: newEntityForm.fieldNumber,
          quantity: newEntityForm.quantity,
        },
      ],
      isSaved: true,
      isExpanded: true,
    };

    setDispatchEntities([...dispatchEntities, newEntity]);
    setIsAddDialogOpen(false);
    setNewEntityForm({
      lrNumber: "",
      truckNumber: "",
      fieldNumber: "",
      quantity: "",
    });
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
      dispatchEntities.map((entity) => {
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
      dispatchEntities.map((entity) => {
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
      dispatchEntities.filter((entity) => entity.id !== entityId),
    );
  };

  // Toggle expanded state of entity
  const handleToggleExpanded = (entityId: string) => {
    setDispatchEntities(
      dispatchEntities.map((entity) => {
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
    return dispatchEntities.filter((entity) => {
      const matchesLR = entity.lrNumber.toLowerCase().includes(query);
      const matchesTruck = entity.truckNumber.toLowerCase().includes(query);
      const matchesField = entity.rows.some((row) =>
        row.fieldNumber.toLowerCase().includes(query),
      );
      return matchesLR || matchesTruck || matchesField;
    });
  }, [dispatchEntities, searchQuery]);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header with Add Button */}
      <div className="px-4 py-3">
        <h2 className="text-xl font-bold text-slate-900 mb-3">Dispatch</h2>
        <Button
          onClick={handleAddDispatchEntity}
          className="w-full h-12 bg-[#4CAF50] hover:bg-[#388E3C] text-white gap-2 rounded-lg"
        >
          <Plus className="h-5 w-5" />
          Add Dispatch Entity
        </Button>
      </div>

      {/* Search Bar - Show only if entities exist */}
      {dispatchEntities.length > 0 && (
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by LR Number, Truck Number, Field Number..."
              className="pl-10 h-10 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Dispatch Entities List */}
      <div className="flex-1 overflow-y-auto px-4 pb-20 space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {filteredEntities.length === 0 && dispatchEntities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-slate-400 mb-2">No dispatch entities yet</div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddDispatchEntity}
            >
              Create your first entity
            </Button>
          </div>
        ) : filteredEntities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertOctagon className="h-8 w-8 text-slate-300 mb-2" />
            <div className="text-slate-400">No matching dispatch entities</div>
          </div>
        ) : (
          filteredEntities.map((entity) => (
            <Card key={entity.id} className="overflow-hidden">
              {/* Entity Header - Always Visible and Clickable */}
              <div
                onClick={() => handleToggleExpanded(entity.id)}
                className="bg-gradient-to-r from-green-50 to-blue-50 px-4 py-3 border-b cursor-pointer hover:from-green-100 hover:to-blue-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div>
                        <p className="text-xs text-slate-500 font-semibold">
                          LR NUMBER
                        </p>
                        <p className="font-bold text-slate-900">
                          {entity.lrNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-semibold">
                          TRUCK NUMBER
                        </p>
                        <p className="font-bold text-slate-900">
                          {entity.truckNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-slate-600 transition-transform flex-shrink-0 ml-2 ${
                      entity.isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>

              {/* Entity Rows - Show only when expanded */}
              {entity.isExpanded && (
                <CardContent className="p-4 space-y-3">
                  {entity.rows.map((row, index) => (
                    <div
                      key={row.id}
                      className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs text-slate-500 font-semibold mb-1">
                              FIELD NUMBER
                            </p>
                            <p className="font-medium text-slate-900">
                              {row.fieldNumber}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 font-semibold mb-1">
                              QUANTITY
                            </p>
                            <p className="font-medium text-slate-900">
                              {row.quantity}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                        onClick={() => handleDeleteRow(entity.id, row.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {/* Add Row Form */}
                  <EntityAddRow
                    entityId={entity.id}
                    onAddRow={handleAddRowToEntity}
                  />

                  {/* Delete Entity Button */}
                  <Button
                    variant="outline"
                    className="w-full h-10 text-red-600 border-red-200 hover:bg-red-50 gap-2"
                    onClick={() => handleDeleteEntity(entity.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Entity
                  </Button>

                  {/* Bottom Collapse Button */}
                  <Button
                    variant="outline"
                    className="w-full h-10 gap-2 border-slate-200 hover:bg-slate-50 text-slate-600"
                    onClick={() => handleToggleExpanded(entity.id)}
                  >
                    <ChevronDown className="h-4 w-4 rotate-180" />
                    Collapse
                  </Button>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Add Entity Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-full h-full m-0 rounded-none p-0 flex flex-col">
          <DialogTitle className="sr-only">Add Dispatch Entity</DialogTitle>
          <DialogDescription className="sr-only">
            Create a new dispatch entity with LR number, truck number, and items
          </DialogDescription>

          {/* Green Header */}
          <div className="px-4 py-3 border-b bg-[rgb(76,175,80)] text-white flex justify-between items-center flex-shrink-0">
            <div className="flex-1">
              <h2 className="text-lg font-bold leading-none">
                Add Dispatch Entity
              </h2>
              <p className="text-xs text-[rgb(255,255,255)] mt-1">
                Fill in the dispatch details
              </p>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-4 pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {validationErrors.length > 0 && (
              <Alert className="mb-4 bg-red-50 border-red-200">
                <AlertOctagon className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  {validationErrors.map((error, idx) => (
                    <div key={idx}>{error}</div>
                  ))}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-medium">
                  LR Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Enter LR number"
                  value={newEntityForm.lrNumber}
                  onChange={(e) =>
                    setNewEntityForm({
                      ...newEntityForm,
                      lrNumber: e.target.value,
                    })
                  }
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base font-medium">
                  Truck Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Enter truck number"
                  value={newEntityForm.truckNumber}
                  onChange={(e) =>
                    setNewEntityForm({
                      ...newEntityForm,
                      truckNumber: e.target.value,
                    })
                  }
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base font-medium">
                  Field Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Enter field number"
                  value={newEntityForm.fieldNumber}
                  onChange={(e) =>
                    setNewEntityForm({
                      ...newEntityForm,
                      fieldNumber: e.target.value,
                    })
                  }
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base font-medium">
                  Quantity <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Enter quantity"
                  type="number"
                  value={newEntityForm.quantity}
                  onChange={(e) =>
                    setNewEntityForm({
                      ...newEntityForm,
                      quantity: e.target.value,
                    })
                  }
                  className="h-12 text-base"
                />
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <DialogFooter className="px-4 py-4 border-t bg-white flex-shrink-0">
            <div className="flex gap-2 w-full">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-10 text-sm"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="flex-1 h-10 bg-[#4CAF50] hover:bg-[#388E3C] text-sm text-white"
                onClick={handleSaveNewEntity}
              >
                <Check className="h-4 w-4 mr-1" />
                Create
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
                onChange={(e) => setFieldNumber(e.target.value)}
                className="h-10 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Quantity</Label>
              <Input
                placeholder="Enter quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
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
