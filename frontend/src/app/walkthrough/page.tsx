import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Project Walkthrough — AbleSpace Task Manager',
  description: 'Full-stack developer assignment walkthrough by Ayush Chauhan',
};

export default function WalkthroughPage() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: '#f8fafc', minHeight: '100vh' }}>

      {/* Cover */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)',
        color: 'white', padding: '80px 60px'
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: 8 }}>🗂️ AbleSpace Task Manager</div>
          <div style={{ fontSize: '1.1rem', opacity: 0.8, marginBottom: 4 }}>Full-Stack Developer Assignment — Project Walkthrough</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.6, marginBottom: 28 }}>Submitted by: <strong style={{ opacity: 1 }}>Ayush Chauhan</strong></div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' as const }}>
            <a href="https://ablespace-task-manager-4xgi.vercel.app" target="_blank"
              style={{ background: 'rgba(255,255,255,0.15)', color: 'white', textDecoration: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 500, border: '1px solid rgba(255,255,255,0.25)', fontSize: '0.9rem' }}>
              🔗 Live Demo
            </a>
            <a href="https://github.com/Ayush1835/Ablespace-task-manager" target="_blank"
              style={{ background: 'rgba(255,255,255,0.15)', color: 'white', textDecoration: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 500, border: '1px solid rgba(255,255,255,0.25)', fontSize: '0.9rem' }}>
              📦 GitHub Repo
            </a>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 40px' }}>

        {/* Overview */}
        <Section label="Overview" title="Project Summary">
          <p style={{ color: '#475569', marginBottom: 24, lineHeight: 1.8 }}>
            AbleSpace Task Manager is a production-ready, full-stack clinical task board built for Speech-Language Pathologists (SLPs).
            It allows clinicians to manage their caseload tasks across a visual Kanban board with drag-and-drop reordering,
            real-time API sync, and persistent theme preferences.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { icon: '🔐', title: 'JWT Authentication', desc: 'Secure login with email or instant one-click guest access. All tasks are user-scoped via JWT tokens.' },
              { icon: '🗂️', title: 'Kanban Board', desc: 'Four swimlane columns with native HTML5 drag-and-drop to move tasks between statuses in real-time.' },
              { icon: '📋', title: 'List View', desc: 'Tabular view with filterable columns by priority and status, plus progress bars and due dates.' },
              { icon: '🌙', title: 'Light / Dark Mode', desc: 'One-click theme toggle persisted to localStorage. Optimized dark palette for clinical use.' },
            ].map(f => (
              <div key={f.title} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: 20 }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{f.icon}</div>
                <div style={{ fontWeight: 600, marginBottom: 4, color: '#0f172a' }}>{f.title}</div>
                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </Section>

        <Divider />

        {/* Login */}
        <Section label="Screen 1" title="Login Screen">
          <p style={{ color: '#475569', marginBottom: 16, lineHeight: 1.8 }}>
            The login screen features a frosted-glass card on a gradient background. Users can sign in with their email
            or use the <strong>"Access Board as Guest"</strong> button for instant zero-friction access — no registration required.
          </p>
          <Screenshot
            src={`https://image.thum.io/get/width/880/crop/600/noanimate/https://ablespace-task-manager-4xgi.vercel.app/login`}
            alt="Login Screen"
          />
          <FeatureList items={[
            'Email-based authentication flow',
            'One-click guest access (no password needed)',
            'Frosted glass card on gradient background',
            'Responsive layout for all screen sizes',
          ]} />
        </Section>

        <Divider />

        {/* Kanban */}
        <Section label="Screen 2" title="Kanban Board — Dark Mode">
          <p style={{ color: '#475569', marginBottom: 16, lineHeight: 1.8 }}>
            The primary workspace shows tasks organized in clinical workflow columns: <strong>To Do, In Progress, In Review,</strong> and <strong>Done</strong>.
            Each task card shows its priority badge, description, due date, and a progress bar.
            Users can drag cards between columns to update their status in real-time via the REST API.
          </p>
          <Screenshot
            src={`https://image.thum.io/get/width/880/crop/600/noanimate/https://ablespace-task-manager-4xgi.vercel.app/dashboard`}
            alt="Kanban Board Dark Mode"
          />
          <TaskTable />
        </Section>

        <Divider />

        {/* Light mode */}
        <Section label="Screen 3" title="Kanban Board — Light Mode">
          <p style={{ color: '#475569', marginBottom: 16, lineHeight: 1.8 }}>
            The same board in light mode. A sun/moon toggle in the top navigation bar instantly switches the theme.
            The preference is saved to <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4, color: '#6d28d9' }}>localStorage</code> and
            persists across browser sessions.
          </p>
          <FeatureList items={[
            'Clean white card design with blue accent colors',
            'Colored priority badge system (High/Medium/Low)',
            'Progress bars on each task card',
            'Collapsible sidebar navigation',
          ]} />
        </Section>

        <Divider />

        {/* List View */}
        <Section label="Screen 4" title="List View with Filters">
          <p style={{ color: '#475569', marginBottom: 16, lineHeight: 1.8 }}>
            The list-view toggle button (top right) switches to a compact tabular format. Dropdown menus let users
            filter by Priority (High/Medium/Low) and Status. The <strong>"+ Add Task"</strong> button opens a form to create tasks.
          </p>
          <FeatureList items={[
            'Filter by Priority: All / High / Medium / Low',
            'Filter by Status: All / To Do / In Progress / Done',
            'Inline task editing via edit icon',
            'Sortable columns with progress visualization',
          ]} />
        </Section>

        <Divider />

        {/* Tech Stack */}
        <Section label="Architecture" title="Tech Stack">
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <Th>Layer</Th><Th>Technology</Th><Th>Purpose</Th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Frontend', 'Next.js 14 (App Router)', 'React framework with SSR support'],
                ['Styling', 'TailwindCSS', 'Utility-first design system'],
                ['Icons', 'Lucide React', 'Consistent icon library'],
                ['Drag & Drop', 'HTML5 Drag API', 'Native browser interaction'],
                ['Backend', 'NestJS', 'Modular Node.js REST API framework'],
                ['ORM', 'Prisma', 'Type-safe database schema and queries'],
                ['Database', 'SQLite / In-memory (Vercel)', 'Lightweight persistent storage'],
                ['Auth', 'JWT (JSON Web Tokens)', 'Stateless authentication'],
                ['Validation', 'class-validator', 'DTO input validation'],
                ['Frontend Host', 'Vercel', 'Next.js deployment'],
                ['Backend Host', 'Vercel Serverless', 'NestJS API deployment'],
                ['Source Control', 'GitHub', 'Version control'],
              ].map(([a, b, c]) => (
                <tr key={a} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <Td>{a}</Td><Td><strong>{b}</strong></Td><Td style={{ color: '#64748b' }}>{c}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <Divider />

        {/* API */}
        <Section label="Backend" title="REST API Endpoints">
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <Th>Method</Th><Th>Endpoint</Th><Th>Description</Th><Th>Auth</Th>
              </tr>
            </thead>
            <tbody>
              {[
                ['POST', '/api/auth/login', 'Login with email', 'No'],
                ['POST', '/api/auth/guest', 'Instant guest session', 'No'],
                ['GET', '/api/tasks', 'Get all tasks for user', 'Yes'],
                ['POST', '/api/tasks', 'Create a new task', 'Yes'],
                ['PATCH', '/api/tasks/:id', 'Update a task', 'Yes'],
                ['DELETE', '/api/tasks/:id', 'Delete a task', 'Yes'],
              ].map(([method, endpoint, desc, auth]) => (
                <tr key={endpoint} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <Td>
                    <span style={{
                      background: method === 'GET' ? '#dbeafe' : method === 'POST' ? '#dcfce7' : method === 'PATCH' ? '#fef3c7' : '#fee2e2',
                      color: method === 'GET' ? '#1d4ed8' : method === 'POST' ? '#15803d' : method === 'PATCH' ? '#b45309' : '#dc2626',
                      padding: '2px 8px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 700
                    }}>{method}</span>
                  </Td>
                  <Td><code style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: 4, fontSize: '0.8rem', color: '#6d28d9' }}>{endpoint}</code></Td>
                  <Td style={{ color: '#475569' }}>{desc}</Td>
                  <Td style={{ color: auth === 'Yes' ? '#16a34a' : '#94a3b8', fontWeight: auth === 'Yes' ? 600 : 400 }}>{auth === 'Yes' ? '✅ Required' : 'Public'}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

      </div>

      {/* Footer */}
      <div style={{ background: '#0f172a', color: '#94a3b8', textAlign: 'center' as const, padding: '32px', fontSize: '0.875rem' }}>
        <strong style={{ color: 'white' }}>AbleSpace Task Manager</strong> — Full-Stack Developer Assignment &nbsp;|&nbsp;
        <a href="https://ablespace-task-manager-4xgi.vercel.app" style={{ color: '#818cf8' }}>Live Demo</a> &nbsp;|&nbsp;
        <a href="https://github.com/Ayush1835/Ablespace-task-manager" style={{ color: '#818cf8' }}>GitHub</a>
      </div>

    </div>
  );
}

function Section({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 64 }}>
      <span style={{ display: 'inline-block', background: '#ede9fe', color: '#6d28d9', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.8px', padding: '4px 12px', borderRadius: 20, marginBottom: 12 }}>{label}</span>
      <h2 style={{ fontSize: '1.7rem', fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>{title}</h2>
      {children}
    </div>
  );
}

function Screenshot({ src, alt }: { src: string; alt: string }) {
  return (
    <img src={src} alt={alt} style={{ width: '100%', borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', margin: '24px 0', display: 'block' }} />
  );
}

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul style={{ marginTop: 16, paddingLeft: 0, listStyle: 'none' }}>
      {items.map(item => (
        <li key={item} style={{ padding: '6px 0', color: '#475569', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: '#6d28d9', fontWeight: 700 }}>✓</span> {item}
        </li>
      ))}
    </ul>
  );
}

function TaskTable() {
  const tasks = [
    { title: 'Write IEP goal report for Alex Smith', priority: 'HIGH', pColor: '#dc2626', pBg: '#fee2e2', status: 'TO DO', progress: '0%' },
    { title: 'Prepare target materials for articulation session', priority: 'MEDIUM', pColor: '#d97706', pBg: '#fef3c7', status: 'IN PROGRESS', progress: '50%' },
    { title: 'Sync caseload data with district repository', priority: 'LOW', pColor: '#16a34a', pBg: '#dcfce7', status: 'DONE', progress: '100%' },
  ];
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden', marginTop: 20 }}>
      <thead>
        <tr style={{ background: '#f8fafc' }}>
          <Th>Task</Th><Th>Priority</Th><Th>Status</Th><Th>Progress</Th>
        </tr>
      </thead>
      <tbody>
        {tasks.map(t => (
          <tr key={t.title} style={{ borderBottom: '1px solid #f1f5f9' }}>
            <Td>{t.title}</Td>
            <Td><span style={{ background: t.pBg, color: t.pColor, padding: '2px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>{t.priority}</span></Td>
            <Td style={{ color: '#64748b', fontSize: '0.875rem' }}>{t.status}</Td>
            <Td style={{ fontWeight: 600 }}>{t.progress}</Td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Divider() {
  return <div style={{ height: 1, background: '#e2e8f0', margin: '56px 0' }} />;
}

function Th({ children }: { children: React.ReactNode }) {
  return <th style={{ padding: '12px 16px', textAlign: 'left' as const, fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '0.5px', borderBottom: '1px solid #e2e8f0' }}>{children}</th>;
}

function Td({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <td style={{ padding: '12px 16px', fontSize: '0.9rem', color: '#334155', ...style }}>{children}</td>;
}
