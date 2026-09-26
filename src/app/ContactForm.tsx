import emailjs from '@emailjs/browser';
import { useState, useSyncExternalStore, type SubmitEvent } from 'react';
import { useTranslation } from 'react-i18next';

type SubmissionStatus = 'idle' | 'sending' | 'success' | 'error';

const MESSAGE_MIN_LENGTH = 10;
const MESSAGE_MAX_LENGTH = 2000;

const subscribe = () => () => {};

export function ContactForm() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const isHydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const serviceId: unknown = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId: unknown = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey: unknown = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  const isConfigured =
    typeof serviceId === 'string' &&
    serviceId.length > 0 &&
    typeof templateId === 'string' &&
    templateId.length > 0 &&
    typeof publicKey === 'string' &&
    publicKey.length > 0;

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isConfigured) return;

    const form = event.currentTarget;
    setStatus('sending');

    try {
      await emailjs.sendForm(serviceId, templateId, form, { publicKey });
      form.reset();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  return (
    <form
      className="portfolio-contact-form"
      onSubmit={(event) => void handleSubmit(event)}
      onChange={() => status !== 'sending' && setStatus('idle')}
      aria-busy={status === 'sending'}
      aria-describedby="contact-requirements"
    >
      <p id="contact-requirements" className="portfolio-contact-form__hint">
        {t('contactForm.requiredFields')}
      </p>
      <fieldset disabled={!isHydrated || !isConfigured || status === 'sending'}>
        <div className="portfolio-contact-form__field">
          <label htmlFor="contact-name">{t('contactForm.name')}</label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={100}
            required
          />
        </div>
        <div className="portfolio-contact-form__field">
          <label htmlFor="contact-email">{t('contactForm.email')}</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            required
          />
        </div>
        <div className="portfolio-contact-form__field portfolio-contact-form__field--message">
          <label htmlFor="contact-message">{t('contactForm.message')}</label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            minLength={MESSAGE_MIN_LENGTH}
            maxLength={MESSAGE_MAX_LENGTH}
            aria-describedby="contact-message-hint"
            required
          />
          <p id="contact-message-hint" className="portfolio-contact-form__hint">
            {t('contactForm.messageHint', { min: MESSAGE_MIN_LENGTH, max: MESSAGE_MAX_LENGTH })}
          </p>
        </div>
        <div className="portfolio-contact-form__privacy">
          <p>{t('contactForm.privacySummary')}</p>
          <p>
            {t('contactForm.privacyRights')}{' '}
            <a href="mailto:carlos@chanuar.com">carlos@chanuar.com</a>.
          </p>
          <details>
            <summary>{t('contactForm.privacyDetails')}</summary>
            <p>{t('contactForm.privacyStorage')}</p>
            <p>
              {t('contactForm.privacyProvider')}{' '}
              <a href="https://www.emailjs.com/legal/privacy-policy/">
                {t('contactForm.privacyProviderLink')}
              </a>
              .
            </p>
            <p>
              {t('contactForm.privacyComplaint')}{' '}
              <a href="https://www.aepd.es">{t('contactForm.privacyAuthority')}</a>.
            </p>
          </details>
        </div>
        <div className="portfolio-contact-form__actions">
          <div className="portfolio-contact-form__feedback" aria-live="polite">
            {(!isHydrated || !isConfigured) && <p>{t('contactForm.unavailable')}</p>}
            {status === 'success' && <p role="status">{t('contactForm.success')}</p>}
            {status === 'error' && <p role="alert">{t('contactForm.error')}</p>}
          </div>
          <button type="submit" disabled={!isHydrated || !isConfigured || status === 'sending'}>
            {status === 'sending' ? t('contactForm.sending') : t('contactForm.submit')}
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      </fieldset>
    </form>
  );
}
