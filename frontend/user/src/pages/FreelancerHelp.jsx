import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import FreelancerSidebar from "../components/dashboard/freelancer/FreelancerSidebar";
import FreelancerNavbar from "../components/dashboard/freelancer/FreelancerNavbar";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { toast } from "react-hot-toast";

export default function FreelancerHelp() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("faq");
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [ticketData, setTicketData] = useState({
    subject: "",
    category: "general",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const faqs = [
    {
      category: "Getting Started",
      items: [
        {
          question: "How do I complete my profile?",
          answer:
            "Go to Settings > Profile to add your skills, bio, portfolio, and profile picture. A complete profile increases your chances of getting hired.",
        },
        {
          question: "How do I find jobs?",
          answer:
            "Visit Browse Jobs to see available projects. Use filters to narrow down opportunities that match your skills and preferences.",
        },
        {
          question: "How do I submit a proposal?",
          answer:
            'Click on a job listing, review the requirements, and click "Submit Proposal". Write a compelling cover letter and set your rate.',
        },
      ],
    },
    {
      category: "Payments",
      items: [
        {
          question: "When do I get paid?",
          answer:
            "Payment is released when the client approves your completed work. Funds are transferred to your wallet and can be withdrawn to your bank account.",
        },
        {
          question: "How do I withdraw funds?",
          answer:
            "Go to Wallet > Withdraw. Enter the amount and your bank details. Withdrawals are processed within 3-5 business days.",
        },
        {
          question: "What are the platform fees?",
          answer:
            "SkillsPocket charges 10% service fee on all completed projects. This fee is automatically deducted from your earnings.",
        },
      ],
    },
    {
      category: "Jobs & Projects",
      items: [
        {
          question: "How do I track my active jobs?",
          answer:
            "Visit My Jobs to see all your active, pending, and completed projects. You can update progress and communicate with clients.",
        },
        {
          question: "Can I cancel a job?",
          answer:
            "You can request cancellation, but this may affect your rating. Contact the client first to resolve any issues.",
        },
        {
          question: "How does the rating system work?",
          answer:
            "Clients can rate your work from 1-5 stars. Your overall rating is the average of all completed jobs. Maintain high ratings for more opportunities.",
        },
      ],
    },
    {
      category: "Account & Security",
      items: [
        {
          question: "How do I change my password?",
          answer:
            "Go to Settings > Security and enter your current password and new password. Make sure to use a strong password.",
        },
        {
          question: "How do I update my notification preferences?",
          answer:
            "Visit Settings > Notifications to customize which emails and alerts you receive from SkillsPocket.",
        },
        {
          question: "Is my data secure?",
          answer:
            "Yes, we use industry-standard encryption and security measures to protect your personal and financial information.",
        },
      ],
    },
  ];

  const quickLinks = [
    {
      icon: "📚",
      title: "Documentation",
      description: "Detailed guides and tutorials",
      action: "View Docs",
    },
    {
      icon: "💬",
      title: "Community Forum",
      description: "Connect with other freelancers",
      action: "Join Forum",
    },
    {
      icon: "🎥",
      title: "Video Tutorials",
      description: "Learn through video guides",
      action: "Watch Now",
    },
    {
      icon: "📧",
      title: "Email Support",
      description: "support@skillspocket.com",
      action: "Send Email",
    },
  ];

  const handleTicketSubmit = async (e) => {
    e.preventDefault();

    if (!ticketData.subject || !ticketData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success(
        "Support ticket submitted successfully! We'll get back to you within 24 hours.",
      );
      setTicketData({ subject: "", category: "general", description: "" });
    } catch (error) {
      toast.error("Failed to submit ticket. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <FreelancerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <FreelancerNavbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Back Button & Header */}
            <div className="max-w-6xl mx-auto mb-6">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-4"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="font-medium">Back</span>
              </button>

              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  Help & Support
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Find answers to common questions or contact our support team
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1">
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 sticky top-6">
                    <nav className="space-y-1">
                      {["faq", "contact", "resources"].map((section) => (
                        <button
                          key={section}
                          onClick={() => setActiveSection(section)}
                          className={`w-full text-left px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                            activeSection === section
                              ? "bg-primary text-white"
                              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                          }`}
                        >
                          {section === "faq" && "❓ FAQs"}
                          {section === "contact" && "📧 Contact Support"}
                          {section === "resources" && "📚 Resources"}
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                  {activeSection === "faq" && (
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                        Frequently Asked Questions
                      </h2>

                      {faqs.map((category, catIndex) => (
                        <div key={catIndex} className="mb-8 last:mb-0">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-primary rounded"></span>
                            {category.category}
                          </h3>
                          <div className="space-y-3">
                            {category.items.map((faq, faqIndex) => {
                              const faqId = `${catIndex}-${faqIndex}`;
                              const isExpanded = expandedFaq === faqId;

                              return (
                                <div
                                  key={faqId}
                                  className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden"
                                >
                                  <button
                                    onClick={() =>
                                      setExpandedFaq(isExpanded ? null : faqId)
                                    }
                                    className="w-full px-5 py-4 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                  >
                                    <span className="font-medium text-slate-900 dark:text-white pr-4">
                                      {faq.question}
                                    </span>
                                    <svg
                                      className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                      />
                                    </svg>
                                  </button>
                                  {isExpanded && (
                                    <div className="px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
                                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {faq.answer}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeSection === "contact" && (
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        Contact Support
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400 mb-6">
                        Can't find what you're looking for? Submit a support
                        ticket and we'll help you out.
                      </p>

                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Your Email
                          </label>
                          <Input
                            type="email"
                            value={user?.email || ""}
                            disabled
                            fullWidth
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Category
                          </label>
                          <select
                            value={ticketData.category}
                            onChange={(e) =>
                              setTicketData({
                                ...ticketData,
                                category: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary"
                          >
                            <option value="general">General Inquiry</option>
                            <option value="technical">Technical Issue</option>
                            <option value="payment">Payment Question</option>
                            <option value="account">Account Issue</option>
                            <option value="job">Job Related</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <Input
                          label="Subject"
                          value={ticketData.subject}
                          onChange={(e) =>
                            setTicketData({
                              ...ticketData,
                              subject: e.target.value,
                            })
                          }
                          placeholder="Brief description of your issue"
                          required
                          fullWidth
                        />

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Description
                          </label>
                          <textarea
                            value={ticketData.description}
                            onChange={(e) =>
                              setTicketData({
                                ...ticketData,
                                description: e.target.value,
                              })
                            }
                            rows={6}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary"
                            placeholder="Please provide as much detail as possible..."
                            required
                          />
                        </div>

                        <Button
                          onClick={handleTicketSubmit}
                          loading={submitting}
                          fullWidth
                        >
                          Submit Ticket
                        </Button>

                        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                          Average response time: 24 hours
                        </p>
                      </div>
                    </div>
                  )}

                  {activeSection === "resources" && (
                    <div className="space-y-6">
                      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                          Helpful Resources
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {quickLinks.map((link, index) => (
                            <div
                              key={index}
                              className="p-5 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-primary dark:hover:border-primary transition-colors cursor-pointer"
                            >
                              <div className="text-3xl mb-3">{link.icon}</div>
                              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                                {link.title}
                              </h3>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                {link.description}
                              </p>
                              <button className="text-primary text-sm font-medium hover:underline">
                                {link.action} →
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-primary to-blue-500 rounded-xl p-6 text-white">
                        <div className="flex items-start gap-4">
                          <div className="text-4xl">💡</div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2">
                              Need Immediate Help?
                            </h3>
                            <p className="mb-4 opacity-90">
                              Our support team is available Monday-Friday, 9 AM
                              - 6 PM EST
                            </p>
                            <div className="flex flex-wrap gap-3">
                              <button className="bg-white text-primary px-4 py-2 rounded-lg font-medium hover:bg-slate-100 transition-colors">
                                Chat with Us
                              </button>
                              <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors">
                                Schedule a Call
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
