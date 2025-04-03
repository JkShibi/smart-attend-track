
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronUp, Database } from "lucide-react";

interface Query {
  id: string;
  sql: string;
  timestamp: string;
  duration: number;
}

const QueryLog = () => {
  const [open, setOpen] = useState(false);
  const [queries, setQueries] = useState<Query[]>([]);

  // Mock queries for demonstration
  useEffect(() => {
    const mockQueries = [
      {
        id: "1",
        sql: "SELECT * FROM students WHERE class_id = 'CS101'",
        timestamp: new Date().toISOString(),
        duration: 45,
      },
      {
        id: "2",
        sql: "INSERT INTO attendance (student_id, class_id, date, status) VALUES ('S123', 'CS101', '2023-11-10', 'present')",
        timestamp: new Date().toISOString(),
        duration: 78,
      },
      {
        id: "3",
        sql: "SELECT COUNT(*) as present_count FROM attendance WHERE class_id = 'CS101' AND date = '2023-11-10' AND status = 'present'",
        timestamp: new Date().toISOString(),
        duration: 35,
      },
    ];
    setQueries(mockQueries);
  }, []);

  // Add a new query to the log (would be called by API functions)
  const addQuery = (query: Omit<Query, "id" | "timestamp">) => {
    const newQuery = {
      ...query,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
    };
    setQueries((prev) => [newQuery, ...prev]);
  };

  return (
    <div className="mt-8 bg-card rounded-lg shadow-sm border">
      <Collapsible open={open} onOpenChange={setOpen} className="w-full">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full flex items-center justify-between p-4 text-left"
          >
            <div className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              <span className="font-medium">Query Log</span>
              <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {queries.length}
              </span>
            </div>
            {open ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="p-4 pt-0">
            <ScrollArea className="h-[300px]">
              {queries.length > 0 ? (
                <div className="space-y-3">
                  {queries.map((query) => (
                    <div
                      key={query.id}
                      className="p-3 bg-muted rounded-md text-sm"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs text-muted-foreground">
                          {new Date(query.timestamp).toLocaleTimeString()}
                        </div>
                        <div className="text-xs font-medium bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">
                          {query.duration}ms
                        </div>
                      </div>
                      <pre className="whitespace-pre-wrap break-all font-mono text-xs">
                        {query.sql}
                      </pre>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  No queries logged yet
                </div>
              )}
            </ScrollArea>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default QueryLog;
