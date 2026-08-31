import { Boxes, Coins, Percent, Star } from "lucide-react";

import { PageHeader } from "@/app/(main)/dashboard/dimension/_components/page-header";
import { StatCard, StatGrid } from "@/app/(main)/dashboard/dimension/_components/stat-card";
import { products } from "@/data/dimension";
import { formatCompactCurrency, formatNumber } from "@/lib/dimension-format";

import { ProductsTable } from "./_components/products-table";

export const metadata = { title: "Products | Dimension CRM" };

export default function Page() {
  const categories = [...new Set(products.map((product) => product.category))].sort();
  const active = products.filter((product) => product.status === "Active");
  const catalogRevenue = products.reduce((sum, product) => sum + product.revenue, 0);
  const averageMargin = Math.round(products.reduce((sum, product) => sum + product.margin, 0) / products.length);
  const averageRating = (products.reduce((sum, product) => sum + product.rating, 0) / products.length).toFixed(1);

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <PageHeader
        title="Products"
        description="The DIMENSION catalog — licenses, add-ons, and services that can be attached to deals and quotes."
      />

      <StatGrid>
        <StatCard
          label="Catalog items"
          value={formatNumber(products.length)}
          icon={Boxes}
          hint={`${active.length} active`}
        />
        <StatCard label="Catalog revenue" value={formatCompactCurrency(catalogRevenue)} delta={13} icon={Coins} />
        <StatCard label="Average margin" value={`${averageMargin}%`} delta={2} icon={Percent} />
        <StatCard label="Average rating" value={averageRating} icon={Star} hint="Customer satisfaction" />
      </StatGrid>

      <ProductsTable products={products} categories={categories} />
    </div>
  );
}
