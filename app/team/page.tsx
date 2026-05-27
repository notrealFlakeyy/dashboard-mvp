import { team } from '@/lib/demo-data';

export default function TeamPage() {
  const clockedIn = team.filter((member) => member.status === 'Clocked in').length;
  return (
    <section className="pageStack mobileFocused">
      <header className="pageHeader">
        <p className="eyebrow">Team & time</p>
        <h1>Mobile-friendly foundation for future clock-in/out.</h1>
        <p className="subcopy">This MVP intentionally stops before payroll/legal compliance. Supabase tables are ready for employees, locations, shifts, and time entries.</p>
      </header>

      <div className="kpiGrid two">
        <article className="kpiCard"><span>Clocked in</span><strong>{clockedIn}</strong><small>Active time entries today</small></article>
        <article className="kpiCard warning"><span>Due soon</span><strong>{team.filter((m) => m.status === 'Due soon').length}</strong><small>Upcoming shift check</small></article>
      </div>

      <article className="phonePanel">
        <div className="phoneTop"><strong>Today at Main Store</strong><span>Tue 26 May</span></div>
        <button className="clockButton">Clock in / out placeholder</button>
        <p className="hint">In production this writes to <code>time_entries</code> with employee, location, started_at, ended_at, and source = mobile_web.</p>
      </article>

      <div className="teamCards">
        {team.map((member) => (
          <article key={member.name} className="teamCard">
            <div>
              <strong>{member.name}</strong>
              <span>{member.role} · {member.location}</span>
            </div>
            <span className={`pill ${member.status === 'Clocked in' ? 'ok' : member.status === 'Due soon' ? 'warn' : ''}`}>{member.status}</span>
            <dl>
              <div><dt>Shift</dt><dd>{member.shift}</dd></div>
              <div><dt>Last action</dt><dd>{member.lastAction}</dd></div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
