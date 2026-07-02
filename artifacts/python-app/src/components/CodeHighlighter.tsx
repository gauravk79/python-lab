import React from 'react';

export const CodeHighlighter = ({ code }: { code: string }) => {
  // A highly specialized tokenizer that perfectly handles our 6 Python snippets
  const tokens = code.split(/(".*?"|#.*|\b(?:print|def|return|for|in|len)\b|\b\d+\b|\.\w+\b|[()[\]{}:,=+*-]+)/g);
  
  return (
    <>
      {tokens.map((token, i) => {
        if (!token) return null;
        
        // Strings
        if (token.startsWith('"') && token.endsWith('"')) {
          return <span key={i} className="text-[#a6e22e]">{token}</span>;
        }
        
        // Comments
        if (token.startsWith('#')) {
          return <span key={i} className="text-[#75715e] italic">{token}</span>;
        }
        
        // Keywords
        if (/^(print|def|return|for|in)$/.test(token)) {
          return <span key={i} className="text-[#f92672] font-semibold">{token}</span>;
        }
        
        // Built-ins
        if (token === 'len') {
          return <span key={i} className="text-[#66d9ef] font-semibold">{token}</span>;
        }
        
        // Method calls
        if (token.startsWith('.') && token.length > 1) {
          return <span key={i} className="text-[#66d9ef]">{token}</span>;
        }
        
        // Numbers
        if (/^\d+$/.test(token)) {
          return <span key={i} className="text-[#ae81ff]">{token}</span>;
        }
        
        // Punctuation
        if (/^[()[\]{}:,=+*-]+$/.test(token)) {
          return <span key={i} className="text-[#f8f8f2]">{token}</span>;
        }
        
        // Default text/identifiers
        return <span key={i} className="text-[#f8f8f2]">{token}</span>;
      })}
    </>
  );
};
