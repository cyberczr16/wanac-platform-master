import { useState, useEffect } from 'react';
import { fireteamService } from '../../../../../services/api/fireteam.service';
import { getBreakoutDeckIdForExperience } from '../../breakoutDeckMap';
import { buildBreakoutAgenda } from '../../breakoutDeckParser';

/**
 * Custom hook to load and manage meeting data (experience, fireteam, agenda)
 */
export function useMeetingData(searchParams) {
  const [experience, setExperience] = useState(null);
  const [fireteam, setFireteam] = useState(null);
  const [agenda, setAgenda] = useState([]);
  const [exhibits, setExhibits] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Calculate total session time from agenda durations
   */
  const calculateTotalTime = () => {
    let totalMinutes = 0;

    agenda.forEach((item) => {
      const duration = item.duration;

      // Skip items with "—" or no duration
      if (!duration || duration === '—' || duration === '-') {
        return;
      }

      // Parse duration string (e.g., "5 mins", "10 min", "45 minutes")
      const match = duration.match(/(\d+)/);
      if (match) {
        totalMinutes += parseInt(match[1], 10);
      }
    });

    if (totalMinutes === 0) {
      return '—';
    }

    // Format as hours and minutes if >= 60 mins
    if (totalMinutes >= 60) {
      const hours = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }

    return `${totalMinutes} mins`;
  };

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const expId = searchParams?.get('id');
        const ftId = searchParams?.get('fireteamId');

        let exp = null;
        let ft = null;

        // Set default agenda immediately
        const defaultAgenda = [
          {
            title: 'Waiting Room',
            subtitle: 'Welcome to your Fireteam Experience',
            duration: '—',
            isWaitingRoom: true,
          },
          {
            title: 'Introduction',
            subtitle: 'What is the Fireteam Experience?',
            duration: '3 mins',
            isIntroduction: true,
          },
          {
            title: 'Session Starting',
            subtitle: 'Loading session details...',
            duration: '5 mins',
          },
          {
            title: 'Session Processing',
            subtitle: 'Processing session data and generating insights',
            duration: null,
            isProcessing: true,
          },
          {
            title: 'AI Summary Report',
            subtitle: 'Review AI-generated session summary and insights',
            duration: '5 mins',
            isSummary: true,
          },
        ];
        setAgenda(defaultAgenda);

        if (ftId) {
          try {
            const fireteamData = await fireteamService.getFireteam(ftId);
            console.log('📦 Fireteam data received:', fireteamData);

            ft = fireteamData.fireTeam || fireteamData;

            if (expId && ft) {
              const experiences = Array.isArray(ft.experiences) ? ft.experiences : [];
              const targetId = parseInt(expId);
              exp = experiences.find((x) => x.id === targetId);

              console.log('📋 Found experience from fireteam:', exp);

              if (!exp) {
                console.warn('⚠️ Experience not found in fireteam data');
              }
            }
          } catch (err) {
            console.error('❌ Error fetching fireteam:', err);
          }
        }

        setExperience(exp || null);
        setFireteam(ft || null);

        // --------------------------------------------------------------------
        // BREAKOUT (LOCAL DEV) MODE: if we can map this experience to a deck,
        // build agenda directly from breakout-local/breakout-data.json via a
        // local Next.js route.
        // --------------------------------------------------------------------
        const breakoutDeckId = getBreakoutDeckIdForExperience({
          experienceId: exp?.id ?? (expId ? Number(expId) : null),
          experienceTitle: exp?.title ?? null,
        });

        if (breakoutDeckId) {
          const res = await fetch('/api/dev/breakout-data', { cache: 'no-store' });
          if (!res.ok) throw new Error(`Failed to load Breakout data (${res.status})`);
          const breakoutData = await res.json();

          const breakoutSteps = buildBreakoutAgenda({ breakoutData, deckId: breakoutDeckId });
          // Breakout deck is already complete (includes Waiting Room, Learning Objectives,
          // Session Processing, AI-generated Results, etc.). Use it directly so the
          // UI matches Breakout slide-by-slide.
          setAgenda(breakoutSteps);

          // Exhibits: keep existing experience exhibits if present, else none.
          if (exp?.exhibits && Array.isArray(exp.exhibits)) setExhibits(exp.exhibits);
          else setExhibits([]);

          return;
        }

        // Extract and normalize agenda from experience
        if (exp) {
          const agendaSource = exp.agenda || exp.agenda_steps || [];
          const normalizedAgenda = Array.isArray(agendaSource)
            ? agendaSource.map((step) => ({
                title: step.title || 'Untitled Step',
                subtitle: step.subtitle || step.title || 'Untitled Step',
                duration: step.duration || '5 mins',
              }))
            : [];

          console.log('📋 Loaded agenda from experience:', normalizedAgenda);

          const waitingRoom = {
            title: 'Waiting Room',
            subtitle: 'Welcome to your Fireteam Experience',
            duration: '—',
            isWaitingRoom: true,
          };

          const introduction = {
            title: 'Introduction',
            subtitle: 'What is the Fireteam Experience?',
            duration: '3 mins',
            isIntroduction: true,
          };

          const finalAgenda = [waitingRoom, introduction, ...normalizedAgenda];

          if (normalizedAgenda.length === 0) {
            console.log('⚠️ No agenda found, using default');
            finalAgenda.push({
              title: 'Session Started',
              subtitle: 'Main discussion',
              duration: '45 mins',
            });
          }

          // Add Session Processing and AI Summary Report steps at the end
          finalAgenda.push({
            title: 'Session Processing',
            subtitle: 'Processing session data and generating insights',
            duration: null,
            isProcessing: true,
          });

          finalAgenda.push({
            title: 'AI Summary Report',
            subtitle: 'Review AI-generated session summary and insights',
            duration: '5 mins',
            isSummary: true,
          });

          console.log('✅ Final agenda with waiting room:', finalAgenda);
          setAgenda(finalAgenda);

          // Load exhibits if available
          if (exp.exhibits && Array.isArray(exp.exhibits)) {
            setExhibits(exp.exhibits);
          } else {
            // Default exhibits
            setExhibits([
              {
                id: 1,
                title: 'Session Guide',
                type: 'pdf',
                url: '/documents/session-guide.pdf',
                description: 'Complete guide for this session',
              },
              {
                id: 2,
                title: 'Resource Materials',
                type: 'link',
                url: 'https://example.com/resources',
                description: 'Additional learning resources',
              },
            ]);
          }
        }
      } catch (err) {
        console.error('❌ Failed to load meeting data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [searchParams]);

  return {
    experience,
    fireteam,
    agenda,
    exhibits,
    loading,
    calculateTotalTime,
  };
}

