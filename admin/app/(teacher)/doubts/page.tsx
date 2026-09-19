"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { MessageSquare, Clock, CheckCircle2, User, Search, Send } from "lucide-react";

const INITIAL_DOUBTS = [
  {
    id: "dbt_101",
    student: "Rahul Sharma",
    batch: "MERN Cohort 04",
    topic: "React Strict Mode Double Invocation",
    question: "Why does useEffect run twice in React 18 Strict Mode and how does cleanup handle it in production builds?",
    time: "30 mins ago",
    status: "Pending",
  },
  {
    id: "dbt_102",
    student: "Ananya Patel",
    batch: "Next.js Mastery",
    topic: "Server Actions & Revalidation",
    question: "How to handle Server Actions revalidation when cookie auth expires mid-request? Does revalidatePath throw 401?",
    time: "1 hour ago",
    status: "Pending",
  },
  {
    id: "dbt_103",
    student: "Vikas Reddy",
    batch: "Full Stack Cohort 03",
    topic: "JWT Refresh Rotation",
    question: "Difference between JWT refresh token rotation and sliding session timeouts?",
    time: "3 hours ago",
    status: "Resolved",
  },
];

export default function DoubtsPage() {
  const [doubts, setDoubts] = React.useState(INITIAL_DOUBTS);
  const [activeDoubt, setActiveDoubt] = React.useState<any | null>(null);
  const [replyText, setReplyText] = React.useState("");
  const { addToast } = useToast();

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDoubt) return;

    setDoubts((prev) =>
      prev.map((d) => (d.id === activeDoubt.id ? { ...d, status: "Resolved" } : d))
    );

    addToast({
      type: "success",
      title: "Doubt Answered",
      message: `Reply sent to ${activeDoubt.student}. Notification pushed via FCM.`,
    });

    setReplyText("");
    setActiveDoubt(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Student Doubts & Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Resolve student technical questions, code review requests, and curriculum inquiries.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="warning">
            {doubts.filter((d) => d.status === "Pending").length} Pending
          </Badge>
          <Badge variant="success">
            {doubts.filter((d) => d.status === "Resolved").length} Resolved
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        {doubts.map((doubt) => (
          <Card key={doubt.id} className="hover:border-slate-300 dark:hover:border-slate-700 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center font-bold text-xs">
                  {doubt.student.slice(0, 1)}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {doubt.student}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {doubt.batch} • {doubt.topic}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {doubt.time}
                </span>
                <Badge variant={doubt.status === "Resolved" ? "success" : "warning"}>
                  {doubt.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg leading-relaxed">
                {doubt.question}
              </p>
              <div className="flex justify-end gap-2">
                {doubt.status === "Pending" ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setActiveDoubt(doubt)}
                    leftIcon={<MessageSquare className="w-4 h-4" />}
                  >
                    Reply & Resolve
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" disabled leftIcon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}>
                    Resolved
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reply Modal */}
      <Modal
        isOpen={!!activeDoubt}
        onClose={() => setActiveDoubt(null)}
        title={`Reply to ${activeDoubt?.student}`}
        description={`Topic: ${activeDoubt?.topic} (${activeDoubt?.batch})`}
        footer={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setActiveDoubt(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleResolve} rightIcon={<Send className="w-4 h-4" />}>
              Send Solution
            </Button>
          </div>
        }
      >
        <form onSubmit={handleResolve} className="space-y-4">
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs text-slate-600 dark:text-slate-300">
            <strong>Question:</strong> {activeDoubt?.question}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Your Answer / Code Snippet
            </label>
            <textarea
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Explain concept clearly or provide code solution..."
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-brand-navy-dark p-3 text-xs focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue focus:outline-none"
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
