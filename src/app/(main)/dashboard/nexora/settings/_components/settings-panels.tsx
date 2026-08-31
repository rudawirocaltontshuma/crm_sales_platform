"use client";

import * as React from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { DEAL_STAGES } from "@/data/nexora";

interface ToggleDef {
  id: string;
  label: string;
  description: string;
  defaultChecked?: boolean;
}

const NOTIFICATION_TOGGLES: ToggleDef[] = [
  {
    id: "deal-won",
    label: "Deal won",
    description: "Notify the team channel when a deal moves to Won.",
    defaultChecked: true,
  },
  {
    id: "stage-change",
    label: "Stage changes",
    description: "Alert deal owners when a stage changes.",
    defaultChecked: true,
  },
  { id: "task-due", label: "Task reminders", description: "Daily digest of tasks due in the next 24 hours." },
  {
    id: "ticket-sla",
    label: "Support SLA breaches",
    description: "Escalate tickets that miss first-response targets.",
    defaultChecked: true,
  },
];

const AUTOMATION_TOGGLES: ToggleDef[] = [
  {
    id: "lead-routing",
    label: "Round-robin lead routing",
    description: "Distribute inbound leads evenly across the team.",
    defaultChecked: true,
  },
  {
    id: "scoring",
    label: "Predictive lead scoring",
    description: "Recalculate lead scores nightly from engagement signals.",
    defaultChecked: true,
  },
  {
    id: "duplicates",
    label: "Duplicate detection",
    description: "Flag likely duplicate contacts and companies on create.",
  },
  {
    id: "forecast",
    label: "Weighted forecast rollup",
    description: "Roll deal probability into the team forecast automatically.",
  },
];

function ToggleList({ items }: { items: ToggleDef[] }) {
  return (
    <div className="divide-y">
      {items.map((item) => (
        <div key={item.id} className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
          <div className="space-y-0.5">
            <Label htmlFor={item.id} className="text-sm">
              {item.label}
            </Label>
            <p className="text-muted-foreground text-sm">{item.description}</p>
          </div>
          <Switch id={item.id} defaultChecked={item.defaultChecked} />
        </div>
      ))}
    </div>
  );
}

export function SettingsPanels() {
  const [currency, setCurrency] = React.useState("USD");
  const [fiscalStart, setFiscalStart] = React.useState("January");

  function save(section: string) {
    toast.success(`${section} saved`, { description: "Demo mode — settings reset on reload." });
  }

  return (
    <Tabs defaultValue="workspace" className="gap-4">
      <div className="w-full overflow-x-auto">
        <TabsList>
          <TabsTrigger value="workspace">Workspace</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="workspace">
        <Card>
          <CardHeader>
            <CardTitle>Workspace</CardTitle>
            <CardDescription>Organization defaults applied across the NEXORA CRM workspace.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="workspace-name">Workspace name</Label>
              <Input id="workspace-name" defaultValue="NEXORA CRM" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workspace-domain">Primary domain</Label>
              <Input id="workspace-domain" defaultValue="nexora.example" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workspace-currency">Reporting currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="workspace-currency" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {["USD", "EUR", "GBP", "AUD", "SGD"].map((code) => (
                      <SelectItem key={code} value={code}>
                        {code}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="workspace-fiscal">Fiscal year starts</Label>
              <Select value={fiscalStart} onValueChange={setFiscalStart}>
                <SelectTrigger id="workspace-fiscal" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {["January", "April", "July", "October"].map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="workspace-signature">Default email signature</Label>
              <Textarea id="workspace-signature" rows={4} defaultValue={"— The NEXORA revenue team\nnexora.example"} />
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button onClick={() => save("Workspace settings")}>Save changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="pipeline">
        <Card>
          <CardHeader>
            <CardTitle>Pipeline stages</CardTitle>
            <CardDescription>Default probability applied when a deal enters each stage.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {DEAL_STAGES.map((stage, index) => (
              <div key={stage} className="flex items-center justify-between gap-4">
                <Label htmlFor={`stage-${stage}`} className="text-sm">
                  {stage}
                </Label>
                <Input
                  id={`stage-${stage}`}
                  type="number"
                  min={0}
                  max={100}
                  className="w-24"
                  defaultValue={[10, 25, 40, 60, 78, 100, 0][index]}
                />
              </div>
            ))}
            <Separator />
            <p className="text-muted-foreground text-sm">
              Stage automation is disabled in this demo build — values reset when the page reloads.
            </p>
          </CardContent>
          <CardFooter className="justify-end">
            <Button onClick={() => save("Pipeline settings")}>Save changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Choose which revenue events generate alerts.</CardDescription>
          </CardHeader>
          <CardContent>
            <ToggleList items={NOTIFICATION_TOGGLES} />
          </CardContent>
          <CardFooter className="justify-end">
            <Button onClick={() => save("Notification preferences")}>Save changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="automation">
        <Card>
          <CardHeader>
            <CardTitle>Automation</CardTitle>
            <CardDescription>Routing, scoring, and hygiene rules for the workspace.</CardDescription>
          </CardHeader>
          <CardContent>
            <ToggleList items={AUTOMATION_TOGGLES} />
          </CardContent>
          <CardFooter className="justify-end">
            <Button onClick={() => save("Automation rules")}>Save changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
