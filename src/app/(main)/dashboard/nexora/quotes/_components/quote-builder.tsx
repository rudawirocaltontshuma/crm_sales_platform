"use client";

import * as React from "react";

import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/nexora-format";

export interface BuilderProduct {
  id: string;
  name: string;
  price: number;
}

interface LineItem {
  key: string;
  productId: string;
  quantity: number;
  discount: number;
}

const TAX_RATE = 0.08;

/** Client-side quote builder. Totals recalculate live; submitting only raises a toast. */
export function QuoteBuilder({ products, companies }: { products: BuilderProduct[]; companies: string[] }) {
  const [open, setOpen] = React.useState(false);
  const [company, setCompany] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [lines, setLines] = React.useState<LineItem[]>([
    { key: "line-1", productId: products[0]?.id ?? "", quantity: 1, discount: 0 },
  ]);

  const priceOf = React.useCallback(
    (productId: string) => products.find((product) => product.id === productId)?.price ?? 0,
    [products],
  );

  const subtotal = lines.reduce((sum, line) => sum + priceOf(line.productId) * line.quantity, 0);
  const discountTotal = lines.reduce(
    (sum, line) => sum + (priceOf(line.productId) * line.quantity * line.discount) / 100,
    0,
  );
  const tax = (subtotal - discountTotal) * TAX_RATE;
  const total = subtotal - discountTotal + tax;

  function updateLine(key: string, patch: Partial<LineItem>) {
    setLines((current) => current.map((line) => (line.key === key ? { ...line, ...patch } : line)));
  }

  function reset() {
    setCompany("");
    setTitle("");
    setNotes("");
    setLines([{ key: "line-1", productId: products[0]?.id ?? "", quantity: 1, discount: 0 }]);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus data-icon="inline-start" />
          Build quote
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[88svh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Quote builder</DialogTitle>
          <DialogDescription>
            Assemble line items and preview totals. Nothing is sent — this demo has no backend.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="quote-company">Company</Label>
              <Select value={company} onValueChange={setCompany}>
                <SelectTrigger id="quote-company" className="w-full">
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {companies.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quote-title">Quote title</Label>
              <Input
                id="quote-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Platform rollout proposal"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm">Line items</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setLines((current) => [
                    ...current,
                    {
                      key: `line-${current.length + 1}-${Date.now()}`,
                      productId: products[0]?.id ?? "",
                      quantity: 1,
                      discount: 0,
                    },
                  ])
                }
              >
                <Plus data-icon="inline-start" />
                Add line
              </Button>
            </div>

            <div className="w-full overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-48">Product</TableHead>
                    <TableHead className="w-24">Qty</TableHead>
                    <TableHead className="w-28">Discount %</TableHead>
                    <TableHead className="w-32 text-right">Total</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lines.map((line) => (
                    <TableRow key={line.key}>
                      <TableCell>
                        <Select
                          value={line.productId}
                          onValueChange={(value) => updateLine(line.key, { productId: value })}
                        >
                          <SelectTrigger size="sm" className="w-full">
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {products.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name} — {formatCurrency(product.price)}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={1}
                          value={line.quantity}
                          onChange={(event) => updateLine(line.key, { quantity: Number(event.target.value) || 1 })}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={line.discount}
                          onChange={(event) => updateLine(line.key, { discount: Number(event.target.value) || 0 })}
                        />
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCurrency(priceOf(line.productId) * line.quantity * (1 - line.discount / 100))}
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Remove line item"
                          onClick={() => setLines((current) => current.filter((item) => item.key !== line.key))}
                        >
                          <Trash2 />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="quote-notes">Notes</Label>
              <Textarea
                id="quote-notes"
                rows={4}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Terms, validity, onboarding scope..."
              />
            </div>
            <dl className="space-y-2 rounded-md border p-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="tabular-nums">{formatCurrency(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Discount</dt>
                <dd className="tabular-nums">-{formatCurrency(discountTotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Tax (8%)</dt>
                <dd className="tabular-nums">{formatCurrency(tax)}</dd>
              </div>
              <div className="flex justify-between border-t pt-2 font-medium">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatCurrency(total)}</dd>
              </div>
            </dl>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={() => {
              setOpen(false);
              reset();
              toast.success("Quote saved as draft", {
                description: "Demo mode — quotes are not stored or sent to anyone.",
              });
            }}
          >
            Save draft
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
