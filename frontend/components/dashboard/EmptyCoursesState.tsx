import * as React from "react";
import Link from "next/link";
import { BookOpen, Sparkles, Compass } from "lucide-react";
import { Card, CardContent, Button } from "@/components/ui";

export function EmptyCoursesState() {
  return (
    <Card variant="bordered" className="border-dashed border-2 py-10 text-center">
      <CardContent className="flex flex-col items-center justify-center space-y-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue">
          <BookOpen className="h-8 w-8" aria-hidden="true" />
        </div>
        <div className="max-w-md space-y-1">
          <h3 className="text-h4 font-bold text-foreground">
            No courses enrolled yet!
          </h3>
          <p className="text-body-sm text-muted-foreground">
            You haven't enrolled in any courses so far. Explore our top engineering and tech masterclasses to kickstart your learning journey.
          </p>
        </div>
        <div className="pt-2">
          <Link href="/courses">
            <Button
              variant="primary"
              size="md"
              leftIcon={<Compass className="h-4 w-4" aria-hidden="true" />}
            >
              Explore All Courses
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
