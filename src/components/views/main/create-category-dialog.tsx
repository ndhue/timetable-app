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
import { Category } from "@prisma/client";

interface CategorySelectProps {
  categories: Category[];
  value?: string;
  onChange?: (value: string) => void;
  isLoading?: boolean;
}

export const CreateCategoryDialog = ({
  categories,
  value,
  onChange,
  isLoading
}: CategorySelectProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const handleCreateCategory = () => {
    if (!newCategory.trim()) return;

    // TODO: create category here
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
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name}
            </SelectItem>
          ))}

          <SelectItem value="create_new" className="text-secondary">
            + Create new category
          </SelectItem>
        </SelectContent>
      </Select>

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
            <Button onClick={() => {}}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
