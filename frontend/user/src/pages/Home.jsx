// ============================================
// FILE: frontend/user/src/pages/Home.jsx
// ============================================
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const RocketIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9.19 6.35c-2.04 2.29-3.44 5.58-3.57 5.89L2 13.12l2.23 2.23 1.88-1.88 1.62 1.62-1.88 1.88L8.08 19l.88-3.62c.31-.13 3.6-1.53 5.89-3.57 3.05-2.73 4.15-6.32 4.15-6.32s-3.59 1.1-6.32 4.15l-3.49-.29zM9 18l-4-4-.72 2.9L2 19.18l2.28 2.28 2.28-2.28L9 18zm4.42-13.56c1.24 0 2.25 1.01 2.25 2.25s-1.01 2.25-2.25 2.25-2.25-1.01-2.25-2.25 1.01-2.25 2.25-2.25z"/>
  </svg>
);

export default function Home() {
  const categories = [
    { name: 'Web Development', icon: '💻', jobs: '1,234' },
    { name: 'Mobile Apps', icon: '📱', jobs: '856' },
    { name: 'UI/UX Design', icon: '🎨', jobs: '642' },
    { name: 'Writing', icon: '✍️', jobs: '523' },
    { name: 'Marketing', icon: '📈', jobs: '789' },
    { name: 'Video Editing', icon: '🎬', jobs: '412' },
  ];

  const featuredFreelancers = [
    {
      name: 'Sarah Johnson',
      role: 'Full Stack Developer',
      rating: 4.9,
      hourlyRate: 85,
      image: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=137fec&color=fff',
    },
    {
      name: 'Michael Chen',
      role: 'UI/UX Designer',
      rating: 4.8,
      hourlyRate: 75,
      image: 'https://ui-avatars.com/api/?name=Michael+Chen&background=34d399&color=fff',
    },
    {
      name: 'Emily Davis',
      role: 'Content Writer',
      rating: 5.0,
      hourlyRate: 50,
      image: 'https://ui-avatars.com/api/?name=Emily+Davis&background=f59e0b&color=fff',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                Hire Expert <span className="text-primary">Freelancers</span> for Your Projects
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Connect with talented professionals worldwide. Get quality work done faster and more efficiently.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/signup"
                  className="px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 shadow-xl shadow-primary/25 transition-all"
                >
                  Get Started
                </Link>
                <Link
                  to="/jobs"
                  className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 rounded-xl font-bold text-lg hover:border-primary transition-all"
                >
                  Browse Jobs
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12">
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">50k+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Freelancers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">12k+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Jobs Posted</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">98%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction</div>
                </div>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-3xl p-8 backdrop-blur-sm">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop"
                  alt="Team working"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Browse by Category
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Find the perfect talent for your project
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/jobs?category=${category.name}`}
                className="group p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-primary/5 dark:hover:bg-primary/10 border-2 border-transparent hover:border-primary transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{category.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {category.jobs} jobs available
                    </p>
                  </div>
                  <svg className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Freelancers */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Top Freelancers
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Work with the best talent in the industry
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredFreelancers.map((freelancer, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={freelancer.image}
                    alt={freelancer.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {freelancer.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {freelancer.role}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {freelancer.rating}
                    </span>
                  </div>
                  <div className="text-lg font-bold text-primary">
                    ${freelancer.hourlyRate}/hr
                  </div>
                </div>

                <Link
                  to={`/profile/${index + 1}`}
                  className="block w-full text-center py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Post Your Job
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Describe your project and requirements. It's free and only takes a few minutes.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Choose Freelancer
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Review proposals from skilled freelancers and select the best fit for your project.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Get Work Done
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Collaborate seamlessly and release payment when you're satisfied with the work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-purple-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of businesses and freelancers already working together on SkillsPocket
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/signup?role=client"
              className="px-8 py-4 bg-white text-primary rounded-xl font-bold text-lg hover:bg-gray-50 shadow-xl transition-all"
            >
              Hire Talent
            </Link>
            <Link
              to="/signup?role=freelancer"
              className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all"
            >
              Find Work
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}