"use client";
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ChatComponent from '../../components/ChatComponent';
import LenisSmoothScroll from '../../components/LenisSmoothScroll';

const excludedPaths = [
  '/login',
  '/signup',
  '/client',
  '/coach',
  '/admin',
  '/pages/(dashboard)',
  '/pages/(dashboard)/client',
  '/pages/(dashboard)/coach',
  '/pages/(dashboard)/admin',
  '/pages/admin',
  '/onboarding',
  '/life-score',
  '/pages/client',
  '/pages/breakoutroom',
  '/pages/coach',
  '/pages/cohortapplication',

];

export default function ClientLayoutWrapper({ children }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const shouldExclude = excludedPaths.some((path) => 
    pathname.startsWith(path) || pathname === path
  );

  return (
    <>
      {!shouldExclude && <Navbar />}
      <main className="flex-grow">
        <LenisSmoothScroll>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }
              }
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </LenisSmoothScroll>
      </main>
      {!shouldExclude && <Footer />}
      {!shouldExclude && <ChatComponent />}
    </>
  );
} 