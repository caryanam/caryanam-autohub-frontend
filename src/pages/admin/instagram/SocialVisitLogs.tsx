import { useState } from "react";
import { MousePointerClick, Search, RefreshCw, ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useGetAdminAllSocialVisits } from "@/hooks/admin/useAdminSocial";

export default function AdminSocialVisitLogs() {
  const [search, setSearch] = useState("");

  const { data: visits = [], isLoading, isRefetching, refetch, error }
    = useGetAdminAllSocialVisits();

  const filtered = visits.filter(
    (v) =>
      v.vehicleName?.toLowerCase().includes(search.toLowerCase()) ||
      v.dealerName?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDateTime = (iso: string) =>
    new Date(iso).toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <MousePointerClick className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Social Media Visit Logs</h1>
            <p className="text-sm text-muted-foreground">
              All visits from Social Media post caption URLs — {visits.length} total
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isRefetching}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search vehicle or dealer..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Error */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="flex items-center gap-2 p-4 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{error.message}</span>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Visited At</TableHead>
                <TableHead>Vehicle Name</TableHead>
                <TableHead>Dealer</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Social Post</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 6 }).map((__, j) => (
                        <TableCell key={j}><Skeleton className="h-4 w-24" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                : filtered.length === 0
                ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                        No Social Media visits found
                      </TableCell>
                    </TableRow>
                  )
                : filtered.map((v, i) => (
                    <TableRow key={v.id}>
                      <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                      <TableCell className="whitespace-nowrap font-medium">
                        {formatDateTime(v.visitedAt)}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{v.vehicleName || 'Unknown Vehicle'}</span>
                        <br />
                        <span className="text-xs text-muted-foreground">ID: {v.vehicleId}</span>
                      </TableCell>
                      <TableCell>{v.dealerName}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={v.source?.toLowerCase() === "facebook" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"}>
                          {v.source}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {v.postUrl ? (
                          <a
                            href={v.postUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-1 hover:underline text-sm ${v.source?.toLowerCase() === "facebook" ? "text-blue-600" : "text-pink-600"}`}
                          >
                            View Post <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}