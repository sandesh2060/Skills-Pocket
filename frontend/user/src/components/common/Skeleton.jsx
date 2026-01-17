// ============================================
// FILE: frontend/user/src/components/common/Skeleton.jsx
// ============================================
export function Skeleton({ className = '', variant = 'text', count = 1 }) {
  const baseStyles = 'animate-pulse bg-slate-200 dark:bg-slate-700 rounded';

  const variants = {
    text: 'h-4 w-full',
    title: 'h-8 w-3/4',
    avatar: 'h-12 w-12 rounded-full',
    image: 'h-48 w-full',
    card: 'h-64 w-full rounded-lg',
  };

  const skeletons = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    />
  ));

  if (count === 1) {
    return skeletons[0];
  }

  return <div className="space-y-3">{skeletons}</div>;
}

export default { Modal, Loader, Skeleton };