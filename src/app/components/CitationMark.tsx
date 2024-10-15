import React from 'react';

interface CitationMarkProps {
  num: string;
  referencesRef: React.RefObject<(HTMLLIElement | null)[]>;
}

const CitationMark: React.FC<CitationMarkProps> = ({ num, referencesRef }) => {
  return (
    <a
      href={`#ref-${num}`}
      className="text-xs align-top ml-1 text-blue-500 hover:underline"
      onClick={(e) => {
        e.preventDefault();
        const ref = referencesRef.current?.[parseInt(num) - 1];
        if (ref) {
          ref.scrollIntoView({ behavior: 'smooth' });
          ref.classList.add('bg-yellow-200');
          setTimeout(() => ref.classList.remove('bg-yellow-200'), 2000);
        }
      }}
    >
      [{num}]
    </a>
  );
};

export default CitationMark;