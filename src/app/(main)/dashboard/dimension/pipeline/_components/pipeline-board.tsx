"use client";

import * as React from "react";

import { CollisionPriority } from "@dnd-kit/abstract";
import { move } from "@dnd-kit/helpers";
import { DragDropProvider, type DragEndEvent, type DragOverEvent, DragOverlay, useDroppable } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { Search } from "lucide-react";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DEAL_STAGES, type Deal, type DealStage } from "@/data/dimension";
import { formatCompactCurrency } from "@/lib/dimension-format";
import { cn } from "@/lib/utils";

import { DealCard } from "./deal-card";

type BoardState = Record<DealStage, Deal[]>;

function buildBoard(deals: Deal[]): BoardState {
  const board = Object.fromEntries(DEAL_STAGES.map((stage) => [stage, [] as Deal[]])) as BoardState;

  for (const deal of deals) {
    board[deal.stage].push(deal);
  }

  return board;
}

function SortableDealCard({ deal, stage, index }: { deal: Deal; stage: DealStage; index: number }) {
  const { isDragging, ref } = useSortable({
    id: deal.id,
    index,
    type: "deal",
    accept: "deal",
    group: stage,
    data: { type: "deal", deal, stage },
  });

  return (
    <div ref={ref} className={cn("touch-none", isDragging && "opacity-30")}>
      <DealCard deal={deal} />
    </div>
  );
}

function PipelineColumn({ stage, deals }: { stage: DealStage; deals: Deal[] }) {
  const dropTarget = useDroppable({
    id: stage,
    type: "deal-container",
    accept: "deal",
    collisionPriority: CollisionPriority.Low,
    data: { type: "deal-container", stage },
  });
  const total = deals.reduce((sum, deal) => sum + deal.value, 0);

  return (
    <section
      className={cn(
        "flex min-h-0 flex-col rounded-xl border bg-muted/40 transition-colors",
        dropTarget.isDropTarget && "bg-muted/70",
      )}
    >
      <div className="flex items-start justify-between gap-3 px-3 pt-3 pb-2">
        <div className="min-w-0">
          <h2 className="truncate font-medium text-sm">{stage}</h2>
          <p className="text-muted-foreground text-xs tabular-nums">
            {deals.length} deals · {formatCompactCurrency(total)}
          </p>
        </div>
      </div>
      <div
        ref={dropTarget.ref}
        className="scrollbar-thin flex min-h-24 flex-1 flex-col gap-2 overflow-y-auto px-2 pb-3 [scrollbar-color:var(--border)_transparent] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar]:w-1"
      >
        {deals.map((deal, index) => (
          <SortableDealCard key={deal.id} deal={deal} stage={stage} index={index} />
        ))}
      </div>
    </section>
  );
}

/** Holds the mutable board. Remounted (via `key`) whenever the filters change. */
function DragBoard({ deals }: { deals: Deal[] }) {
  const [board, setBoard] = React.useState<BoardState>(() => buildBoard(deals));

  function handleDragOver(event: DragOverEvent) {
    if (event.operation.source?.type === "deal") {
      setBoard((current) => move(current, event));
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const source = event.operation.source;

    if (source?.type !== "deal") return;

    // Re-stamp every card with the stage of the column it now lives in.
    setBoard((current) => {
      const next = { ...current };

      for (const stage of DEAL_STAGES) {
        next[stage] = next[stage].map((deal) => (deal.stage === stage ? deal : { ...deal, stage }));
      }

      return next;
    });
  }

  return (
    <DragDropProvider onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <div className="scrollbar-thin min-h-0 flex-1 overflow-x-auto pb-2 [scrollbar-color:var(--border)_transparent] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar]:h-1.5">
        <div className="inline-grid min-w-full grid-cols-[repeat(7,minmax(17rem,1fr))] gap-3">
          {DEAL_STAGES.map((stage) => (
            <PipelineColumn key={stage} stage={stage} deals={board[stage]} />
          ))}
        </div>
      </div>
      <DragOverlay dropAnimation={null}>
        {(source) => {
          const data = source.data as { deal?: Deal } | undefined;

          if (source.type !== "deal" || !data?.deal) return null;

          return (
            <div className="w-72">
              <DealCard deal={data.deal} isOverlay />
            </div>
          );
        }}
      </DragOverlay>
    </DragDropProvider>
  );
}

export function PipelineBoard({ deals, owners }: { deals: Deal[]; owners: { id: string; name: string }[] }) {
  const [query, setQuery] = React.useState("");
  const [owner, setOwner] = React.useState("all");

  const visibleDeals = React.useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return deals.filter(
      (deal) =>
        (owner === "all" || deal.ownerId === owner) &&
        (normalized === "" ||
          deal.name.toLowerCase().includes(normalized) ||
          deal.companyName.toLowerCase().includes(normalized)),
    );
  }, [deals, owner, query]);

  const totalValue = visibleDeals.reduce((sum, deal) => sum + deal.value, 0);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <InputGroup className="sm:w-64">
            <InputGroupInput
              type="search"
              placeholder="Search deals"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
          <Select value={owner} onValueChange={setOwner}>
            <SelectTrigger size="sm" className="sm:w-56">
              <SelectValue placeholder="Owner" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All owners</SelectItem>
                {owners.map((rep) => (
                  <SelectItem key={rep.id} value={rep.id}>
                    {rep.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <p className="text-muted-foreground text-sm tabular-nums">
          {formatCompactCurrency(totalValue)} across {visibleDeals.length} deals
        </p>
      </div>

      <DragBoard key={`${query}|${owner}`} deals={visibleDeals} />
    </div>
  );
}
