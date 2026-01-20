import { useState } from 'react';
import {
  HelpCircle,
  Book,
  MessageCircle,
  FileText,
  Video,
  Search,
  ChevronRight,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  BookOpen,
  ExternalLink,
  ChevronDown,
  Users,
  Gavel,
  DollarSign,
  Shield,
  Settings,
} from 'lucide-react';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Help Categories
  const categories = [
    {
      id: 'getting-started',
      name: 'Getting Started',
      icon: BookOpen,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      articles: 12,
    },
    {
      id: 'user-management',
      name: 'User Management',
      icon: Users,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      articles: 8,
    },
    {
      id: 'disputes',
      name: 'Dispute Resolution',
      icon: Gavel,
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-900/20',
      articles: 15,
    },
    {
      id: 'financials',
      name: 'Financial Management',
      icon: DollarSign,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-900/20',
      articles: 10,
    },
    {
      id: 'security',
      name: 'Security & Privacy',
      icon: Shield,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      articles: 6,
    },
    {
      id: 'troubleshooting',
      name: 'Troubleshooting',
      icon: HelpCircle,
      color: 'text-slate-600 dark:text-slate-400',
      bg: 'bg-slate-50 dark:bg-slate-800',
      articles: 20,
    },
  ];

  // Popular Articles
  const popularArticles = [
    {
      id: 1,
      title: 'How to approve or reject user accounts',
      category: 'User Management',
      views: 2845,
      readTime: '5 min',
      icon: Users,
    },
    {
      id: 2,
      title: 'Understanding the dispute resolution process',
      category: 'Disputes',
      views: 2156,
      readTime: '8 min',
      icon: Gavel,
    },
    {
      id: 3,
      title: 'Managing platform fees and commissions',
      category: 'Financial Management',
      views: 1923,
      readTime: '6 min',
      icon: DollarSign,
    },
    {
      id: 4,
      title: 'Setting up two-factor authentication',
      category: 'Security & Privacy',
      views: 1687,
      readTime: '4 min',
      icon: Shield,
    },
    {
      id: 5,
      title: 'Monitoring suspicious activities',
      category: 'Security & Privacy',
      views: 1542,
      readTime: '7 min',
      icon: AlertCircle,
    },
  ];

  // FAQs
  const faqs = [
    {
      id: 1,
      question: 'How do I reset a user\'s password?',
      answer: 'Navigate to User Management, find the user, click on their profile, and select "Reset Password". An email will be sent to the user with a password reset link. You can also force a password reset if the user has been locked out.',
      category: 'user-management',
    },
    {
      id: 2,
      question: 'What should I do when a dispute is escalated?',
      answer: 'Review all submitted evidence carefully, communicate with both parties to understand their perspectives, and make a fair decision based on platform policies. You can assign disputes to other admins if you need a second opinion. Always document your reasoning in the resolution notes.',
      category: 'disputes',
    },
    {
      id: 3,
      question: 'How can I view platform revenue statistics?',
      answer: 'Go to Financial Monitoring section to see detailed revenue breakdowns, transaction history, and export reports for any time period. You can filter by date range, transaction type, and export data in CSV or PDF format for accounting purposes.',
      category: 'financials',
    },
    {
      id: 4,
      question: 'How do I suspend or ban a user account?',
      answer: 'In User Management, select the user and click "Suspend Account" or "Ban User". Provide a clear reason and duration (for suspension). Banned users cannot create new accounts with the same email. Suspended users can be reactivated after the suspension period ends.',
      category: 'user-management',
    },
    {
      id: 5,
      question: 'Can I customize platform commission rates?',
      answer: 'Yes, go to Settings > Platform Settings to adjust the commission rate. Changes will apply to new transactions only. Existing ongoing projects will maintain their original commission rate. The default rate is 10%, but you can set it between 5-20%.',
      category: 'financials',
    },
    {
      id: 6,
      question: 'How do I handle payment disputes?',
      answer: 'Payment disputes require careful review of project milestones, delivery dates, and communication history. Check if funds are in escrow, review the contract terms, and make a decision within 7 days. You can issue partial or full refunds based on the evidence.',
      category: 'disputes',
    },
    {
      id: 7,
      question: 'What security measures should I enable?',
      answer: 'Enable two-factor authentication, set session timeouts, limit login attempts, and regularly review access logs. Configure IP whitelisting if your team works from fixed locations. Enable email notifications for all critical admin actions.',
      category: 'security',
    },
    {
      id: 8,
      question: 'How do I export user data for compliance?',
      answer: 'Navigate to User Management, select the user, and click "Export Data". This generates a complete data package including profile info, transaction history, and communications. This feature complies with GDPR and data protection regulations.',
      category: 'user-management',
    },
  ];

  // Quick Actions
  const quickActions = [
    {
      title: 'View Documentation',
      description: 'Complete admin guide and API reference',
      icon: Book,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Video Tutorials',
      description: 'Step-by-step video guides',
      icon: Video,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      title: 'Contact Support',
      description: 'Get help from our support team',
      icon: MessageCircle,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Report an Issue',
      description: 'Submit a bug report or feature request',
      icon: AlertCircle,
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-900/20',
    },
  ];

  const filteredFaqs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const filteredArticles = searchQuery
    ? popularArticles.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : popularArticles;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <HelpCircle className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Help Center
          </h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400">
          Find answers, guides, and support for managing SkillsPocket
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for help articles, guides, or FAQs..."
            className="w-full pl-12 pr-4 py-3 sm:py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          Browse by Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-6 rounded-xl border transition-all text-left ${
                  selectedCategory === category.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-700'
                }`}
              >
                <div className={`w-12 h-12 rounded-lg ${category.bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${category.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {category.articles} articles
                </p>
              </button>
            );
          })}
        </div>
        {selectedCategory !== 'all' && (
          <button
            onClick={() => setSelectedCategory('all')}
            className="mt-4 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
          >
            ← Back to all categories
          </button>
        )}
      </div>

      {/* Popular Articles */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          {searchQuery ? 'Search Results' : 'Popular Articles'}
        </h2>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
          {filteredArticles.length === 0 ? (
            <div className="p-12 text-center">
              <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">No articles found</p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                Try searching with different keywords
              </p>
            </div>
          ) : (
            filteredArticles.map((article) => {
              const Icon = article.icon;
              return (
                <button
                  key={article.id}
                  className="w-full p-4 sm:p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {article.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {article.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {article.readTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          {article.views.toLocaleString()} views
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-shrink-0 hidden sm:block" />
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* FAQs */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                className="w-full p-4 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${
                    expandedFaq === faq.id ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expandedFaq === faq.id && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2">
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all text-left group"
              >
                <div className={`w-12 h-12 rounded-lg ${action.bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${action.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {action.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 sm:p-8 text-white">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold mb-3">Still need help?</h2>
          <p className="text-blue-100 mb-6">
            Our support team is available 24/7 to assist you with any questions or issues.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="mailto:admin-support@skillspocket.com"
              className="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Mail className="w-5 h-5" />
              <div>
                <div className="font-semibold">Email Support</div>
                <div className="text-sm text-blue-100">admin-support@skillspocket.com</div>
              </div>
            </a>
            <a
              href="tel:+1234567890"
              className="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Phone className="w-5 h-5" />
              <div>
                <div className="font-semibold">Phone Support</div>
                <div className="text-sm text-blue-100">+1 (234) 567-890</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;