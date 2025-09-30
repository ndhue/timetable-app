import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";

interface CategorySelectProps {
  categories: string[];
  value?: string;
  onChange?: (value: string) => void;
}

export const CreateCategoryDialog = ({
  categories: initialCategories,
  value,
  onChange,
}: CategorySelectProps) => {
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [openDialog, setOpenDialog] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const handleCreateCategory = () => {
    if (!newCategory.trim()) return;

    setCategories((prev) => [...prev, newCategory.trim()]);
    onChange?.(newCategory.trim());
    setNewCategory("");
    setOpenDialog(false);
  };

  return (
    <>
      <Select
        name="category"
        value={value}
        onValueChange={(val) => {
          if (val === "create_new") {
            setOpenDialog(true);
          } else {
            onChange?.(val);
          }
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}

          <SelectItem value="create_new" className="text-secondary">
            + Create new category
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Dialog tạo category */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[320px]">
          <DialogHeader>
            <DialogTitle>Create a new category</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Input
              placeholder="Category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCategory}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
