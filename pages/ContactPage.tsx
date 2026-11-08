import { useState } from 'react';
import type { FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAppLanguage } from '../hooks/useAppLanguage';
import PageShell from '../components/ui/PageShell';

const EMAIL = 'hello@shenzhenatlas.city';

const copy = {
  en: {
    kicker: 'Contact · 联系我们',
    title: 'Get in touch.',
    lead: 'Questions about the research, corrections to a station or story, or interested in collaborating? Write to us.',
    emailLabel: 'Email',
    topicsLabel: 'Good reasons to write',
    topics: ['Corrections and feedback on stations or stories', 'Research collaboration and data', 'Press, teaching and exhibition use'],
    formTitle: 'Send a message',
    name: 'Your name',
    email: 'Your email',
    subject: 'Topic',
    subjects: ['General question', 'Correction', 'Collaboration', 'Press'],
    message: 'Message',
    send: 'Open in email app',
    note: 'This opens your email app with the message ready to send.',
    exploreLabel: 'Keep exploring',
    links: [
      { label: 'About us', route: '/about' },
      { label: 'Metro & Places', route: '/map' },
      { label: 'Metro & People', route: '/people' },
      { label: 'Metro & City', route: '/thematicmap' },
    ],
    home: 'Back to home',
  },
  zh: {
    kicker: '联系我们 · Contact',
    title: '与我们联系。',
    lead: '对研究有疑问、想更正站点或故事内容，或有合作意向？欢迎来信。',
    emailLabel: '邮箱',
    topicsLabel: '欢迎来信的原因',
    topics: ['对站点或故事的更正与反馈', '研究合作与数据', '媒体、教学与展览使用'],
    formTitle: '发送留言',
    name: '您的姓名',
    email: '您的邮箱',
    subject: '主题',
    subjects: ['一般问题', '内容更正', '合作', '媒体'],
    message: '留言内容',
    send: '在邮件应用中打开',
    note: '这将打开您的邮件应用，并填好邮件内容。',
    exploreLabel: '继续探索',
    links: [
      { label: '关于我们', route: '/about' },
      { label: '地铁站点', route: '/map' },
      { label: '地铁与人', route: '/people' },
      { label: '地铁与城市', route: '/thematicmap' },
    ],
    home: '返回首页',
  },
} as const;

const fieldClass =
  'mt-2 w-full rounded-[var(--radius-sm)] border border-[var(--color-hairline)] bg-[var(--color-field)] px-4 py-3 text-base text-[var(--color-ink)] placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-primary)] focus:outline-none';

export default function ContactPage() {
  const { language } = useAppLanguage('en');
  const text = copy[language];
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const update = (key: keyof typeof form) => (event: { target: { value: string } }) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const subject = `[Shenzhen Metro Atlas] ${form.subject || text.subjects[0]}`;
    const body = `${form.message}\n\n— ${form.name} (${form.email})`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <PageShell
      theme={{ chapterColor: 'var(--color-primary)' }}
      className="landing-scroll relative h-[100svh] min-h-[560px] overflow-y-auto overflow-x-hidden"
    >
      <header className="px-6 pb-12 pt-32 md:px-12 md:pb-16 md:pt-40 lg:px-20">
        <div className="mx-auto max-w-[1440px]">
          <motion.p
            className="mb-5 text-[var(--text-label)] font-semibold uppercase tracking-[0.28em] text-[var(--color-primary)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {text.kicker}
          </motion.p>
          <motion.h1
            className="text-5xl font-semibold leading-none tracking-[-0.05em] md:text-7xl [text-wrap:balance]"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {text.title}
          </motion.h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-text-muted)] md:text-xl">{text.lead}</p>
        </div>
      </header>

      <section className="px-6 pb-20 md:px-12 md:pb-28 lg:px-20">
        <div className="mx-auto grid max-w-[1440px] gap-6 lg:grid-cols-[.9fr_1.1fr]">
          <motion.div
            className="flex flex-col justify-between gap-12 rounded-[var(--radius-md)] bg-[var(--color-people)] p-8 text-white md:p-12"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div>
              <p className="text-[var(--text-label)] font-semibold uppercase tracking-[0.28em] text-white/60">{text.emailLabel}</p>
              <a
                href={`mailto:${EMAIL}`}
                className="mt-4 block break-all text-2xl font-semibold tracking-[-0.02em] text-[var(--color-primary)] underline-offset-8 hover:underline md:text-4xl"
              >
                {EMAIL}
              </a>
            </div>
            <div>
              <p className="text-[var(--text-label)] font-semibold uppercase tracking-[0.28em] text-white/60">{text.topicsLabel}</p>
              <ul className="mt-4 space-y-3 text-base leading-7 text-white/85">
                {text.topics.map((topic) => (
                  <li key={topic} className="flex gap-3 border-t border-white/15 pt-3">
                    <span aria-hidden="true" className="text-[var(--color-primary)]">→</span>
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="rounded-[var(--radius-md)] border border-[var(--color-hairline)] p-8 md:p-12"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="type-section-heading">{text.formTitle}</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <label className="block text-sm font-semibold">
                {text.name}
                <input required type="text" value={form.name} onChange={update('name')} className={fieldClass} />
              </label>
              <label className="block text-sm font-semibold">
                {text.email}
                <input required type="email" value={form.email} onChange={update('email')} className={fieldClass} />
              </label>
            </div>
            <label className="mt-6 block text-sm font-semibold">
              {text.subject}
              <select value={form.subject || text.subjects[0]} onChange={update('subject')} className={fieldClass}>
                {text.subjects.map((subject) => <option key={subject} value={subject}>{subject}</option>)}
              </select>
            </label>
            <label className="mt-6 block text-sm font-semibold">
              {text.message}
              <textarea required rows={6} value={form.message} onChange={update('message')} className={`${fieldClass} resize-y`} />
            </label>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-3 rounded-[var(--radius-pill)] bg-[var(--color-primary)] px-7 py-3 text-sm font-semibold text-[var(--color-on-primary)] transition hover:opacity-85"
              >
                {text.send} <span aria-hidden="true">→</span>
              </button>
              <p className="text-sm text-[var(--color-text-muted)]">{text.note}</p>
            </div>
          </motion.form>
        </div>
      </section>

      <footer className="bg-[var(--primitive-teal)] px-6 pb-8 pt-16 text-white md:px-12 lg:px-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col justify-between gap-10 border-b border-white/20 pb-12 md:flex-row md:items-end">
            <div>
              <p className="text-[var(--text-label)] font-semibold uppercase tracking-[0.28em] text-white/60">{text.exploreLabel}</p>
              <p className="mt-4 text-4xl font-black uppercase leading-none tracking-[-.05em] md:text-6xl">Shenzhen · 深圳</p>
            </div>
            <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm font-semibold">
              {text.links.map((link) => (
                <Link key={link.route} to={link.route} className="transition hover:opacity-60">{link.label}</Link>
              ))}
              <Link to="/" className="transition hover:opacity-60">{text.home}</Link>
            </nav>
          </div>
          <div className="flex flex-col justify-between gap-3 pt-6 text-xs opacity-60 sm:flex-row"><span>© 2026 Shenzhen Metro Atlas</span><span>Made for the moving city</span></div>
        </div>
      </footer>
    </PageShell>
  );
}
