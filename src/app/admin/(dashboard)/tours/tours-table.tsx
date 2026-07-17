"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Edit, Eye, EyeOff, Search } from "lucide-react";
import { toggleTourActive } from "@/app/actions/admin/tours";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Tour = {
  id: string;
  slug: string;
  title_es: string;
  title_en: string;
  category: string;
  is_active: boolean;
  display_order: number;
  duration_minutes: number | null;
  price_usd: number | null;
  difficulty: string | null;
};

const CATEGORY_LABELS: Record<string, string> = {
  day_park: "Day Park",
  mangrove: "Manglar",
  night_walk: "Night Walk",
};

const CATEGORY_COLORS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  day_park: "default",
  mangrove: "secondary",
  night_walk: "outline",
};

export function ToursTable({ tours }: { tours: Tour[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => {
    return tours.filter((t) => {
      const q = search.toLowerCase();
      const matchesSearch = !search
        ? true
        : t.title_es.toLowerCase().includes(q) ||
          t.title_en?.toLowerCase().includes(q) ||
          t.slug.toLowerCase().includes(q);
      const matchesCategory = category === "all" || t.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [tours, search, category]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          <Input
            placeholder="Buscar tours..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={category} onValueChange={(v) => v && setCategory(v)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="day_park">Day Park</SelectItem>
            <SelectItem value="mangrove">Manglar</SelectItem>
            <SelectItem value="night_walk">Night Walk</SelectItem>
          </SelectContent>
        </Select>
        <Link href="/admin/tours/new" className="ml-auto">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1.5" strokeWidth={2} />
            Nuevo tour
          </Button>
        </Link>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>Título</TableHead>
              <TableHead className="hidden md:table-cell">Slug</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead className="hidden sm:table-cell">Orden</TableHead>
              <TableHead className="hidden lg:table-cell">Duración</TableHead>
              <TableHead className="hidden lg:table-cell">Precio</TableHead>
              <TableHead className="text-right w-20">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((tour) => (
              <TableRow key={tour.id}>
                <TableCell>
                  <span className={`inline-block w-2 h-2 rounded-full ${tour.is_active ? "bg-emerald" : "bg-muted-foreground"}`} />
                </TableCell>
                <TableCell className="font-medium">
                  <div className="truncate max-w-[200px]">{tour.title_es}</div>
                  {tour.title_en && (
                    <div className="text-xs text-muted-foreground truncate">{tour.title_en}</div>
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground font-mono text-xs">
                  {tour.slug}
                </TableCell>
                <TableCell>
                  <Badge variant={CATEGORY_COLORS[tour.category] ?? "outline"}>
                    {CATEGORY_LABELS[tour.category] ?? tour.category}
                  </Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground font-mono text-xs">
                  #{tour.display_order}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground">
                  {tour.duration_minutes
                    ? `${Math.floor(tour.duration_minutes / 60)}h ${tour.duration_minutes % 60}m`
                    : "—"}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground font-mono">
                  {tour.price_usd ? `$${tour.price_usd}` : "—"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-0.5">
                    <form action={toggleTourActive.bind(null, tour.id, !tour.is_active)}>
                      <Button variant="ghost" size="icon" className="h-8 w-8" title={tour.is_active ? "Desactivar" : "Activar"}>
                        {tour.is_active ? <EyeOff className="h-3.5 w-3.5" strokeWidth={1.5} /> : <Eye className="h-3.5 w-3.5" strokeWidth={1.5} />}
                      </Button>
                    </form>
                    <Link href={`/admin/tours/${tour.id}/edit`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Editar">
                        <Edit className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                  {search || category !== "all"
                    ? "No se encontraron tours con esos filtros."
                    : "No hay tours todavía."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground">
        {filtered.length} de {tours.length} tours
      </p>
    </div>
  );
}