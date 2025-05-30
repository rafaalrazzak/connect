import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import type { Category } from "@/types/report";

interface FilterPanelProps {
  categories: Category[];
  initialFilters: {
    statuses: string[];
    categories: string[];
    timePeriod: string;
  };
  onApplyFilters: (filters: {
    statuses: string[];
    categories: string[];
    timePeriod: string;
  }) => void;
}

export function FilterPanel({
  categories,
  initialFilters,
  onApplyFilters,
}: FilterPanelProps) {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(
    initialFilters.statuses
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialFilters.categories
  );
  const [timePeriod, setTimePeriod] = useState(initialFilters.timePeriod);

  // Status mapping
  const statusOptions = [
    { id: "pending", label: "Menunggu" },
    { id: "in_progress", label: "Diproses" },
    { id: "completed", label: "Selesai" },
    { id: "rejected", label: "Ditolak" },
  ];

  // Time period options
  const timeOptions = [
    { id: "today", label: "Hari Ini" },
    { id: "week", label: "Minggu Ini" },
    { id: "month", label: "Bulan Ini" },
    { id: "all", label: "Semua Waktu" },
  ];

  // Toggle status selection
  const toggleStatus = (status: string) => {
    setSelectedStatuses((current) =>
      current.includes(status)
        ? current.filter((s) => s !== status)
        : [...current, status]
    );
  };

  // Toggle category selection
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((current) =>
      current.includes(categoryId)
        ? current.filter((c) => c !== categoryId)
        : [...current, categoryId]
    );
  };

  // Reset filters to initial state
  const handleReset = () => {
    setSelectedStatuses(["pending", "in_progress", "completed", "rejected"]);
    setSelectedCategories(categories.map((c) => c.id));
    setTimePeriod("all");
  };

  // Apply filters
  const handleApply = () => {
    onApplyFilters({
      statuses: selectedStatuses,
      categories: selectedCategories,
      timePeriod,
    });
  };

  return (
    <div className="py-4 space-y-6">
      {/* Status filter */}
      <div className="space-y-3">
        <h3 className="font-medium text-sm">Status</h3>
        <div className="grid grid-cols-2 gap-2">
          {statusOptions.map((status) => (
            <div key={status.id} className="flex items-center space-x-2">
              <Checkbox
                id={`status-${status.id}`}
                checked={selectedStatuses.includes(status.id)}
                onCheckedChange={() => toggleStatus(status.id)}
              />
              <Label
                htmlFor={`status-${status.id}`}
                className="text-sm cursor-pointer"
              >
                {status.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Category filter */}
      <div className="space-y-3">
        <h3 className="font-medium text-sm">Kategori</h3>
        <div className="grid grid-cols-2 gap-2 max-h-[180px] overflow-y-auto pr-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
              />
              <Label
                htmlFor={`category-${category.id}`}
                className="truncate text-sm cursor-pointer"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Time period filter */}
      <div className="space-y-3">
        <h3 className="font-medium text-sm">Periode Waktu</h3>
        <RadioGroup value={timePeriod} onValueChange={setTimePeriod}>
          {timeOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={option.id} id={`period-${option.id}`} />
              <Label
                htmlFor={`period-${option.id}`}
                className="text-sm cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          variant="outline"
          className="flex-1 rounded-full"
          onClick={handleReset}
        >
          Reset
        </Button>
        <Button className="flex-1 rounded-full" onClick={handleApply}>
          Terapkan Filter
        </Button>
      </div>
    </div>
  );
}
