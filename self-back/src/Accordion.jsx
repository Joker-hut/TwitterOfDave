import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Accordion({ children, isOpen, setIsOpen, dependencies }) {
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight || 0);
    }
  }, [isOpen, dependencies]); 

  return (
    <>
      <div onClick={() => setIsOpen(!isOpen)} className="accordion-header">
        {isOpen ? 'Hide Replies' : 'Show Replies'}
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: contentHeight, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.35, ease: 'easeInOut' },
              opacity: { duration: 0.25, ease: 'easeInOut' },
            }}
            style={{ overflow: 'hidden' }}
            ref={contentRef}
          >
            <div className="accordion-content">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}