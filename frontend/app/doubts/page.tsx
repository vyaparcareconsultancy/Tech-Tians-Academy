"use client";

import * as React from "react";
import {
  HelpCircle,
  MessageSquarePlus,
  Send,
  Upload,
  X,
  ChevronDown,
  ChevronUp,
  FileImage,
  CheckCircle2,
  Clock,
  Check,
} from "lucide-react";
import { PageContainer } from "@/components/layout";
import { Card, Badge, Button } from "@/components/ui";
import {
  Doubt,
  DoubtStatus,
  MOCK_DOUBTS,
  DOUBT_SUBJECTS_MAP,
} from "@/lib/mock/doubts";

export default function DoubtsPage() {
  const [doubts, setDoubts] = React.useState<Doubt[]>(MOCK_DOUBTS);
  const [statusFilter, setStatusFilter] = React.useState<"All" | "Pending" | "Answered">("All");

  // Form State
  const [selectedSubject, setSelectedSubject] = React.useState("");
  const [selectedChapter, setSelectedChapter] = React.useState("");
  const [doubtText, setDoubtText] = React.useState("");
  const [selectedFileName, setSelectedFileName] = React.useState("");
  const [formError, setFormError] = React.useState("");
  const [submitSuccess, setSubmitSuccess] = React.useState(false);

  // Expanded Answered Doubts state
  const [expandedDoubts, setExpandedDoubts] = React.useState<Set<string>>(
    new Set(["doubt-1"])
  );

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Available chapters based on subject
  const availableChapters = React.useMemo(() => {
    if (!selectedSubject) return [];
    return DOUBT_SUBJECTS_MAP[selectedSubject] || [];
  }, [selectedSubject]);

  // Handle subject change
  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subj = e.target.value;
    setSelectedSubject(subj);
    setSelectedChapter("");
    setFormError("");
  };

  // Toggle expand for answered doubts
  const toggleExpand = (id: string) => {
    setExpandedDoubts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(false);

    // Basic required checks
    if (!selectedSubject) {
      setFormError("Please select a subject.");
      return;
    }
    if (!selectedChapter) {
      setFormError("Please select a chapter.");
      return;
    }
    if (!doubtText.trim()) {
      setFormError("Please describe your doubt in detail.");
      return;
    }

    setFormError("");

    const newDoubt: Doubt = {
      id: `doubt-${Date.now()}`,
      subject: selectedSubject,
      chapter: selectedChapter,
      doubtText: doubtText.trim(),
      attachedFileName: selectedFileName || undefined,
      submittedDate: "Just now",
      status: "Pending",
    };

    // Console.log payload requirement
    console.log("Submitted Doubt Payload:", newDoubt);

    // Append to list, newest first
    setDoubts((prev) => [newDoubt, ...prev]);

    // Reset form
    setSelectedSubject("");
    setSelectedChapter("");
    setDoubtText("");
    setSelectedFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 4000);
  };

  // Filtered list
  const filteredDoubts = React.useMemo(() => {
    return doubts.filter((d) => {
      if (statusFilter === "All") return true;
      return d.status === statusFilter;
    });
  }, [doubts, statusFilter]);

  // Counts for filter pills
  const pendingCount = doubts.filter((d) => d.status === "Pending").length;
  const answeredCount = doubts.filter((d) => d.status === "Answered").length;

  const getStatusBadgeVariant = (status: DoubtStatus) => {
    switch (status) {
      case "Answered":
        return "success" as const;
      case "Pending":
        return "warning" as const;
      case "Closed":
      default:
        return "default" as const;
    }
  };

  return (
    <PageContainer className="max-w-7xl space-y-8 py-6">
      {/* Page Header */}
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue">
            <HelpCircle className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-h2 font-bold tracking-tight text-foreground sm:text-3xl">
              Doubts & Discussion
            </h1>
            <p className="text-caption text-muted-foreground mt-0.5">
              Submit technical queries and review faculty clarifications across cohort topics
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Submit Form (5 cols) & Doubt Feed (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Ask a Doubt Form Card */}
        <Card variant="default" className="border-border bg-card p-6 space-y-5 shadow-sm lg:col-span-5 sticky top-20">
          <div className="border-b border-border pb-3 flex items-center justify-between">
            <h2 className="text-h4 font-bold text-foreground flex items-center gap-2">
              <MessageSquarePlus className="h-5 w-5 text-brand-blue" />
              Ask a Doubt
            </h2>
            <span className="text-caption text-muted-foreground">Direct Instructor Q&A</span>
          </div>

          {submitSuccess && (
            <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 p-3 text-body-sm text-success">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Doubt posted successfully! Added to the queue.</span>
            </div>
          )}

          {formError && (
            <div className="rounded-lg border border-danger/30 bg-danger/10 p-3 text-body-sm text-danger">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Subject Select */}
            <div className="space-y-1.5">
              <label htmlFor="doubt-subject" className="text-body-sm font-medium text-foreground">
                Subject <span className="text-danger">*</span>
              </label>
              <select
                id="doubt-subject"
                value={selectedSubject}
                onChange={handleSubjectChange}
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-body-sm text-foreground focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
              >
                <option value="">Select a subject...</option>
                {Object.keys(DOUBT_SUBJECTS_MAP).map((subj) => (
                  <option key={subj} value={subj}>
                    {subj}
                  </option>
                ))}
              </select>
            </div>

            {/* Chapter Select */}
            <div className="space-y-1.5">
              <label htmlFor="doubt-chapter" className="text-body-sm font-medium text-foreground">
                Chapter <span className="text-danger">*</span>
              </label>
              <select
                id="doubt-chapter"
                value={selectedChapter}
                onChange={(e) => {
                  setSelectedChapter(e.target.value);
                  setFormError("");
                }}
                disabled={!selectedSubject}
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-body-sm text-foreground focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">
                  {selectedSubject ? "Select a chapter..." : "Select a subject first..."}
                </option>
                {availableChapters.map((chap) => (
                  <option key={chap} value={chap}>
                    {chap}
                  </option>
                ))}
              </select>
            </div>

            {/* Doubt Text Area */}
            <div className="space-y-1.5">
              <label htmlFor="doubt-text" className="text-body-sm font-medium text-foreground">
                Doubt Description <span className="text-danger">*</span>
              </label>
              <textarea
                id="doubt-text"
                rows={4}
                value={doubtText}
                onChange={(e) => {
                  setDoubtText(e.target.value);
                  setFormError("");
                }}
                placeholder="Explain the problem, code snippet, or conceptual hurdle..."
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-body-sm text-foreground placeholder:text-muted-foreground focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue resize-y"
              />
            </div>

            {/* File Attachment */}
            <div className="space-y-1.5">
              <label className="text-body-sm font-medium text-foreground">
                Attach Screenshot / Code Image <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <div className="flex flex-wrap items-center gap-2.5">
                <label className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-3 py-2 text-body-sm font-medium text-foreground hover:bg-muted cursor-pointer transition-colors select-none">
                  <Upload className="h-4 w-4 text-brand-blue" />
                  <span>Choose File</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      setSelectedFileName(file ? file.name : "");
                    }}
                  />
                </label>
                <span className="text-caption text-muted-foreground truncate max-w-[200px]" title={selectedFileName || "No file chosen"}>
                  {selectedFileName || "No file chosen"}
                </span>
                {selectedFileName && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFileName("");
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="rounded p-1 text-muted-foreground hover:text-danger transition-colors"
                    title="Remove attachment"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                leftIcon={<Send className="h-4 w-4" />}
                fullWidth
              >
                Submit Doubt
              </Button>
            </div>
          </form>
        </Card>

        {/* Right: Doubt List Feed (7 cols) */}
        <div className="space-y-5 lg:col-span-7">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
            <div className="inline-flex rounded-lg border border-border bg-muted/30 p-1">
              <button
                type="button"
                onClick={() => setStatusFilter("All")}
                className={`rounded-md px-3.5 py-1.5 text-body-sm font-medium transition-colors ${
                  statusFilter === "All"
                    ? "bg-brand-blue text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All ({doubts.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("Pending")}
                className={`rounded-md px-3.5 py-1.5 text-body-sm font-medium transition-colors ${
                  statusFilter === "Pending"
                    ? "bg-brand-blue text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("Answered")}
                className={`rounded-md px-3.5 py-1.5 text-body-sm font-medium transition-colors ${
                  statusFilter === "Answered"
                    ? "bg-brand-blue text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Answered ({answeredCount})
              </button>
            </div>

            <span className="text-caption text-muted-foreground">
              Showing {filteredDoubts.length} {filteredDoubts.length === 1 ? "doubt" : "doubts"}
            </span>
          </div>

          {/* Empty State */}
          {filteredDoubts.length === 0 && (
            <Card variant="default" className="border-border bg-card p-10 text-center space-y-3 shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted/60 text-muted-foreground">
                <HelpCircle className="h-6 w-6" />
              </div>
              <h3 className="text-body font-bold text-foreground">No Doubts Found</h3>
              <p className="text-caption text-muted-foreground max-w-sm mx-auto">
                {statusFilter === "All"
                  ? "You haven't submitted any doubts yet. Fill out the form on the left to ask a question."
                  : `There are currently no doubts marked as "${statusFilter}".`}
              </p>
              {statusFilter !== "All" && (
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setStatusFilter("All")}
                  >
                    View All Doubts
                  </Button>
                </div>
              )}
            </Card>
          )}

          {/* Doubts Feed */}
          <div className="space-y-4">
            {filteredDoubts.map((doubt) => {
              const isExpanded = expandedDoubts.has(doubt.id);

              return (
                <Card
                  key={doubt.id}
                  variant="default"
                  className="border-border bg-card p-5 space-y-3.5 shadow-sm transition-colors hover:border-brand-blue/30"
                >
                  {/* Top Bar: Subject, Chapter & Status Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge variant="outline" size="sm" className="border-brand-blue/30 text-brand-blue font-medium">
                        {doubt.subject}
                      </Badge>
                      <Badge variant="default" size="sm" className="bg-muted text-muted-foreground font-normal">
                        {doubt.chapter}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-muted-foreground">
                        {doubt.submittedDate}
                      </span>
                      <Badge variant={getStatusBadgeVariant(doubt.status)} size="sm">
                        {doubt.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Doubt Text */}
                  <p className="text-body text-foreground leading-relaxed">
                    {doubt.doubtText}
                  </p>

                  {/* Attached Image Thumbnail Placeholder */}
                  {doubt.attachedFileName && (
                    <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-2.5">
                      <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded bg-brand-navy/70 border border-brand-blue/20 text-brand-cyan">
                        <FileImage className="h-6 w-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-body-xs font-semibold text-foreground truncate">
                          {doubt.attachedFileName}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Attachment placeholder (Preview omitted)
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Answered Teacher Response Section */}
                  {doubt.status === "Answered" && doubt.response && (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => toggleExpand(doubt.id)}
                        className="inline-flex items-center gap-1.5 text-body-sm font-semibold text-brand-blue hover:text-brand-blue-light transition-colors"
                      >
                        <span>{isExpanded ? "Hide Instructor Response" : "View Instructor Response"}</span>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="mt-3 rounded-lg border border-success/30 bg-success/5 p-4 space-y-2.5">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-success/15 pb-2.5">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-blue text-white text-caption font-bold shadow-sm">
                                {doubt.response.avatarInitials}
                              </div>
                              <div>
                                <p className="text-body-sm font-bold text-foreground">
                                  {doubt.response.facultyName}
                                </p>
                                <p className="text-[11px] text-muted-foreground">Faculty Instructor</p>
                              </div>
                            </div>
                            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {doubt.response.responseDate}
                            </span>
                          </div>

                          <p className="text-body-sm text-foreground/90 leading-relaxed">
                            {doubt.response.responseText}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Closed Status Notice */}
                  {doubt.status === "Closed" && (
                    <div className="pt-1 text-[12px] text-muted-foreground flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>This query has been marked as resolved and closed.</span>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
