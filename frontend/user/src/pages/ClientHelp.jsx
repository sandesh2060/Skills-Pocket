// ============================================
// FILE: frontend/user/src/pages/ClientHelp.jsx
// ============================================
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { 
  Search, HelpCircle, MessageSquare, BookOpen, FileText,
  ChevronDown, ChevronRight, Send, Loader2, Mail, Phone,
  Clock, CheckCircle, AlertCircle, ExternalLink
} from 'lucide-react';
import ClientSidebar from "../components/dashboard/client/ClientSidebar";
import ClientNavbar from "../components/dashboard/client/ClientNavbar";

export default function ClientHelp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [loading, setLoading] = useState(false);

  // Support Ticket Form State
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: '',
    priority: 'normal',
    description: '',
  });

  // Mock FAQ Data
  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          id: 1,
          q: 'How do I post a job?',
          a: 'To post a job, navigate to the Jobs page and click "Post a Job". Fill in the job details including title, description, budget, and required skills. Once submitted, your job will be visible to freelancers.'
        },
        {
          id: 2,
          q: 'How do I find the right freelancer?',
          a: 'Browse our freelancer directory using filters for skills, experience level, and hourly rate. You can also review their profiles, portfolios, and client ratings to make an informed decision.'
        },
        {
          id: 3,
          q: 'What payment methods are accepted?',
          a: 'We accept all major credit cards, debit cards, and PayPal. Payments are processed securely through Stripe.'
        },
      ]
    },
    {
      category: 'Payments & Billing',
      questions: [
        {
          id: 4,
          q: 'How does the payment process work?',
          a: 'When you hire a freelancer, funds are held in escrow. Once the work is completed and approved, the payment is released to the freelancer. This ensures security for both parties.'
        },
        {
          id: 5,
          q: 'Can I get a refund?',
          a: 'Refunds are handled on a case-by-case basis. If you\'re not satisfied with the work, you can dispute the payment through our resolution center. Our team will review and mediate.'
        },
        {
          id: 6,
          q: 'What are the platform fees?',
          a: 'SkillsPocket charges a 3% processing fee on all payments. This covers payment processing, escrow services, and platform maintenance.'
        },
      ]
    },
    {
      category: 'Managing Projects',
      questions: [
        {
          id: 7,
          q: 'How do I communicate with freelancers?',
          a: 'Use our built-in messaging system to communicate with freelancers. You can discuss project details, share files, and track progress all within the platform.'
        },
        {
          id: 8,
          q: 'Can I hire multiple freelancers for one project?',
          a: 'Yes! You can hire multiple freelancers for different aspects of your project. Simply create separate contracts for each freelancer.'
        },
        {
          id: 9,
          q: 'What if I need to cancel a project?',
          a: 'You can cancel a project before work begins without penalty. If work has started, cancellation terms depend on the milestone completion. Contact the freelancer to discuss terms.'
        },
      ]
    },
    {
      category: 'Account & Security',
      questions: [
        {
          id: 10,
          q: 'How do I update my profile?',
          a: 'Go to Settings > Profile to update your information, including contact details, company info, and profile picture.'
        },
        {
          id: 11,
          q: 'Is my payment information secure?',
          a: 'Yes, all payment information is encrypted and processed through Stripe, a PCI-compliant payment processor. We never store your full credit card details.'
        },
        {
          id: 12,
          q: 'How do I enable two-factor authentication?',
          a: 'Two-factor authentication can be enabled in Settings > Security. This adds an extra layer of security to your account.'
        },
      ]
    },
  ];

  // Filter FAQs based on search
  const filteredFaqs = searchQuery
    ? faqs.map(category => ({
        ...category,
        questions: category.questions.filter(
          q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
               q.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.questions.length > 0)
    : faqs;

  // Handle Support Ticket Submission
  const handleTicketSubmit = async (e) => {
    e.preventDefault();

    if (!ticketForm.subject || !ticketForm.category || !ticketForm.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Support ticket submitted successfully! We\'ll respond within 24 hours.');
      
      // Reset form
      setTicketForm({
        subject: '',
        category: '',
        priority: 'normal',
        description: '',
      });
    } catch (error) {
      toast.error('Failed to submit ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { icon: MessageSquare, title: 'Contact Support', desc: 'Get help from our team', action: () => setActiveTab('contact') },
    { icon: BookOpen, title: 'Browse FAQs', desc: 'Find quick answers', action: () => setActiveTab('faq') },
    { icon: FileText, title: 'Documentation', desc: 'Read detailed guides', action: () => window.open('https://docs.skillspocket.com', '_blank') },
    { icon: HelpCircle, title: 'Community Forum', desc: 'Connect with others', action: () => window.open('https://community.skillspocket.com', '_blank') },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] dark:bg-[#0b1219]">
      <ClientSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <ClientNavbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-900 text-white p-6 md:p-8 lg:p-12">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">How can we help you?</h1>
              <p className="text-blue-100 mb-6 max-w-2xl">
                Search our knowledge base or contact support for assistance
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for help articles..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-0 focus:ring-2 focus:ring-blue-400 shadow-lg"
                />
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={action.action}
                    className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all group"
                  >
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                      <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{action.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{action.desc}</p>
                  </button>
                );
              })}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
              {[
                { id: 'faq', label: 'FAQs', icon: HelpCircle },
                { id: 'contact', label: 'Contact Support', icon: MessageSquare },
                { id: 'status', label: 'System Status', icon: CheckCircle },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* FAQ Tab */}
            {activeTab === 'faq' && (
              <div className="space-y-6">
                {filteredFaqs.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">No results found for "{searchQuery}"</p>
                  </div>
                ) : (
                  filteredFaqs.map((category) => (
                    <div key={category.category} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                      <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{category.category}</h2>
                      </div>
                      <div className="divide-y divide-slate-200 dark:divide-slate-700">
                        {category.questions.map((faq) => (
                          <div key={faq.id}>
                            <button
                              onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                              className="w-full flex items-start justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left"
                            >
                              <div className="flex-1 pr-4">
                                <h3 className="font-medium text-slate-900 dark:text-white mb-1">{faq.q}</h3>
                                {expandedFaq === faq.id && (
                                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{faq.a}</p>
                                )}
                              </div>
                              {expandedFaq === faq.id ? (
                                <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Contact Support Tab */}
            {activeTab === 'contact' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Contact Form */}
                <div className="lg:col-span-2">
                  <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Submit a Support Ticket</h2>
                    
                    <form onSubmit={handleTicketSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Subject *
                        </label>
                        <input
                          type="text"
                          value={ticketForm.subject}
                          onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                          placeholder="Brief description of your issue"
                          className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Category *
                          </label>
                          <select
                            value={ticketForm.category}
                            onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          >
                            <option value="">Select a category</option>
                            <option value="technical">Technical Issue</option>
                            <option value="billing">Billing & Payments</option>
                            <option value="account">Account Management</option>
                            <option value="general">General Inquiry</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Priority
                          </label>
                          <select
                            value={ticketForm.priority}
                            onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="low">Low</option>
                            <option value="normal">Normal</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Description *
                        </label>
                        <textarea
                          value={ticketForm.description}
                          onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                          placeholder="Provide detailed information about your issue..."
                          rows={6}
                          className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            <span>Submit Ticket</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Contact Info Sidebar */}
                <div className="space-y-6">
                  <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Other Ways to Reach Us</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">Email</p>
                          <a href="mailto:support@skillspocket.com" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                            support@skillspocket.com
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">Phone</p>
                          <a href="tel:+15551234567" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                            +1 (555) 123-4567
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">Support Hours</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Mon-Fri: 9AM - 6PM EST</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Sat-Sun: 10AM - 4PM EST</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-xl p-6">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Response Time</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      We typically respond to support tickets within 24 hours on business days.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* System Status Tab */}
            {activeTab === 'status' && (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="px-6 py-4 bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-900/30">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    <div>
                      <h2 className="text-lg font-semibold text-green-900 dark:text-green-300">All Systems Operational</h2>
                      <p className="text-sm text-green-700 dark:text-green-400">No incidents reported</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {[
                      { name: 'API', status: 'operational' },
                      { name: 'Web Application', status: 'operational' },
                      { name: 'Payment Processing', status: 'operational' },
                      { name: 'Messaging System', status: 'operational' },
                      { name: 'File Uploads', status: 'operational' },
                    ].map((service) => (
                      <div key={service.name} className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700 last:border-0">
                        <span className="text-slate-900 dark:text-white">{service.name}</span>
                        <span className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                          <CheckCircle className="w-4 h-4" />
                          Operational
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <a
                      href="https://status.skillspocket.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <span>View detailed status page</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}