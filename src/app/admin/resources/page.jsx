"use client";

import AdminSidebar from "../../../../components/dashboardcomponents/adminsidebar";
import { BookOpen, ExternalLink, FileText, GraduationCap, Shield } from "lucide-react";

const RESOURCE_GROUPS = [
  {
    title: "Policies & compliance",
    icon: Shield,
    items: [
      {
        title: "ICF code of ethics",
        description: "Reference for coach conduct and professional standards.",
        url: "https://coachingfederation.org/ethics/code-of-ethics",
      },
      {
        title: "Platform acceptable use",
        description: "Guidelines for coaches, clients, and admins using WANAC.",
        url: "https://www.wanac.org/",
      },
    ],
  },
  {
    title: "Program & cohort operations",
    icon: GraduationCap,
    items: [
      {
        title: "Cohort lifecycle checklist",
        description: "Suggested steps from intake through graduation and alumni follow-up.",
        url: "https://www.smartsheet.com/blog/essential-guide-writing-smart-goals",
      },
      {
        title: "Session scheduling best practices",
        description: "Tips for reducing no-shows and keeping calendars aligned across time zones.",
        url: "https://www.mindtools.com/pages/article/newLDR_78.htm",
      },
    ],
  },
  {
    title: "Coaching practice",
    icon: BookOpen,
    items: [
      {
        title: "Coaching tools & templates",
        description: "Worksheets and frameworks you can share with clients.",
        url: "https://www.coachingtoolscompany.com/free-coaching-tools/",
      },
      {
        title: "Goal-setting frameworks",
        description: "SMART and alternative models for measurable client outcomes.",
        url: "https://www.smartsheet.com/blog/essential-guide-writing-smart-goals",
      },
    ],
  },
  {
    title: "Product & training",
    icon: FileText,
    items: [
      {
        title: "WANAC help center",
        description: "End-user help articles and FAQs (replace with your live help URL when ready).",
        url: "/pages/helpcenter",
      },
      {
        title: "Release notes template",
        description: "Internal template for communicating feature updates to coaches and clients.",
        url: "https://www.atlassian.com/software/jira/templates/release-notes",
      },
    ],
  },
];

export default function AdminResourcesPage() {
  return (
    <div className="h-screen flex bg-white font-body overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="bg-gradient-to-r from-[#002147] to-[#003366] text-white px-8 py-6 shadow-sm shrink-0">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8 opacity-90" />
            Admin resources
          </h1>
          <p className="text-blue-100 mt-1">
            Curated links for administrators—policies, operations, and coaching support. Replace or extend
            this list with your internal wiki or CMS.
          </p>
        </div>

        <main className="flex-1 overflow-y-auto bg-gray-50 px-8 py-6">
          <div className="max-w-5xl space-y-10">
            {RESOURCE_GROUPS.map((group) => {
              const Icon = group.icon;
              return (
                <section key={group.title}>
                  <div className="flex items-center gap-2 mb-4">
                    <Icon className="h-5 w-5 text-[#002147]" />
                    <h2 className="text-lg font-semibold text-[#002147]">{group.title}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {group.items.map((resource) => {
                      const isInternal = resource.url.startsWith("/");
                      return (
                        <a
                          key={resource.title}
                          href={resource.url}
                          {...(isInternal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                          className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex flex-col gap-2 hover:border-[#002147]/30 hover:shadow-md transition group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-gray-900 group-hover:text-[#002147]">
                              {resource.title}
                            </h3>
                            <ExternalLink className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                          </div>
                          <p className="text-sm text-gray-600 flex-1">{resource.description}</p>
                          <span className="text-xs font-medium text-[#002147]">
                            {isInternal ? "Open in app →" : "Visit resource →"}
                          </span>
                        </a>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
