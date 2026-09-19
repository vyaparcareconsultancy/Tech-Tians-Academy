"use client";

import * as React from "react";
import { Search, RotateCcw, BookOpen, Filter, ArrowUpDown } from "lucide-react";
import { PageContainer } from "@/components/layout";
import { CourseCard } from "@/components/dashboard";
import { Button, Input, Badge, Card, CardContent } from "@/components/ui";
import { MOCK_ALL_COURSES, Course } from "@/lib/mock/dashboard";

type PriceFilterOption = "all" | "free" | "under-2000" | "2000-5000" | "above-5000";
type SortOption = "popular" | "rating" | "price-asc" | "price-desc";

const PRICE_OPTIONS: { label: string; value: PriceFilterOption }[] = [
  { label: "All Prices", value: "all" },
  { label: "Free Courses", value: "free" },
  { label: "Under ₹2,000", value: "under-2000" },
  { label: "₹2,000 - ₹5,000", value: "2000-5000" },
  { label: "Above ₹5,000", value: "above-5000" },
];

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = React.useState<PriceFilterOption>("all");
  const [sortBy, setSortBy] = React.useState<SortOption>("popular");

  // Derive unique categories from mock courses
  const allCategories = React.useMemo(() => {
    return Array.from(new Set(MOCK_ALL_COURSES.map((c) => c.category))).sort();
  }, []);

  // Category toggle handler
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedPrice("all");
    setSortBy("popular");
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategories.length > 0 ||
    selectedPrice !== "all" ||
    sortBy !== "popular";

  // Filter & Sort Pipeline
  const filteredCourses = React.useMemo(() => {
    return MOCK_ALL_COURSES.filter((course) => {
      // 1. Search Query (Title + Faculty)
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        query === "" ||
        course.title.toLowerCase().includes(query) ||
        course.faculty.toLowerCase().includes(query);

      if (!matchesSearch) return false;

      // 2. Category Filter (Checkboxes)
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(course.category);

      if (!matchesCategory) return false;

      // 3. Price Filter
      if (selectedPrice === "free") return course.price === 0;
      if (selectedPrice === "under-2000") return course.price > 0 && course.price < 2000;
      if (selectedPrice === "2000-5000") return course.price >= 2000 && course.price <= 5000;
      if (selectedPrice === "above-5000") return course.price > 5000;

      return true;
    }).sort((a, b) => {
      // 4. Sort
      if (sortBy === "popular") return b.popularity - a.popularity;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });
  }, [searchQuery, selectedCategories, selectedPrice, sortBy]);

  return (
    <PageContainer className="space-y-8">
          {/* Header */}
          <div className="border-b border-border pb-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-h2 font-bold tracking-tight text-foreground">
                  Explore Courses
                </h1>
                <p className="text-body-sm text-muted-foreground mt-1">
                  Browse {MOCK_ALL_COURSES.length} comprehensive engineering bootcamps, system design tracks, and masterclasses.
                </p>
              </div>

              {hasActiveFilters && (
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetFilters}
                    leftIcon={<RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Search and Sort Toolbar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Input
                type="text"
                placeholder="Search by course title or faculty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />}
                className="w-full"
                aria-label="Search courses by title or faculty"
              />
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="text-body-sm font-medium text-muted-foreground whitespace-nowrap flex items-center gap-1.5">
                <ArrowUpDown className="h-4 w-4 text-brand-blue" aria-hidden="true" />
                Sort by:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded-md border border-border bg-card px-3 py-2 text-body-sm font-medium text-foreground shadow-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Main Layout: Filters Sidebar + Courses Grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Filter Sidebar */}
            <aside className="space-y-6 lg:col-span-1" aria-label="Course Filters">
              <Card variant="default" className="p-5 space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-body font-bold text-foreground flex items-center gap-2">
                    <Filter className="h-4 w-4 text-brand-blue" aria-hidden="true" />
                    Filters
                  </span>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="text-caption text-brand-blue hover:underline font-medium"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Category Filter - Checkboxes */}
                <div className="space-y-3">
                  <h3 className="text-body-sm font-semibold text-foreground">
                    Category
                  </h3>
                  <div className="space-y-2">
                    {allCategories.map((category) => {
                      const isChecked = selectedCategories.includes(category);
                      const count = MOCK_ALL_COURSES.filter((c) => c.category === category).length;

                      return (
                        <label
                          key={category}
                          className="flex items-center justify-between gap-2 cursor-pointer text-body-sm text-muted-foreground hover:text-foreground select-none"
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleCategoryToggle(category)}
                              className="h-4 w-4 rounded border-border text-brand-blue focus:ring-brand-blue accent-brand-blue cursor-pointer"
                            />
                            <span>{category}</span>
                          </div>
                          <span className="text-caption text-muted-foreground/70">
                            ({count})
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Price Filter - Radio Options */}
                <div className="space-y-3 border-t border-border pt-4">
                  <h3 className="text-body-sm font-semibold text-foreground">
                    Price Range
                  </h3>
                  <div className="space-y-2">
                    {PRICE_OPTIONS.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-2.5 cursor-pointer text-body-sm text-muted-foreground hover:text-foreground select-none"
                      >
                        <input
                          type="radio"
                          name="price-filter"
                          value={option.value}
                          checked={selectedPrice === option.value}
                          onChange={() => setSelectedPrice(option.value)}
                          className="h-4 w-4 border-border text-brand-blue focus:ring-brand-blue accent-brand-blue cursor-pointer"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </Card>
            </aside>

            {/* Courses Grid or Empty State */}
            <section className="lg:col-span-3 space-y-4" aria-label="Course Results">
              <div className="flex items-center justify-between text-body-sm text-muted-foreground">
                <p>
                  Showing <span className="font-semibold text-foreground">{filteredCourses.length}</span> of{" "}
                  <span className="font-semibold text-foreground">{MOCK_ALL_COURSES.length}</span> courses
                </p>
                {selectedCategories.length > 0 && (
                  <Badge variant="primary" size="sm">
                    {selectedCategories.length} category active
                  </Badge>
                )}
              </div>

              {filteredCourses.length === 0 ? (
                /* Empty State when no course matches */
                <Card variant="bordered" className="border-dashed border-2 py-16 text-center">
                  <CardContent className="flex flex-col items-center justify-center space-y-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                      <BookOpen className="h-8 w-8" aria-hidden="true" />
                    </div>
                    <div className="max-w-md space-y-1">
                      <h3 className="text-h4 font-bold text-foreground">
                        No courses found
                      </h3>
                      <p className="text-body-sm text-muted-foreground">
                        No courses match your active search or filter criteria. Try clearing some filters or searching for different keywords.
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleResetFilters}
                      leftIcon={<RotateCcw className="h-4 w-4" aria-hidden="true" />}
                    >
                      Clear All Filters
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                /* Responsive Grid: 1-col mobile, 2-col tablet, 3-col desktop */
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      href={`/courses/${course.id}`}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
    </PageContainer>
  );
}
