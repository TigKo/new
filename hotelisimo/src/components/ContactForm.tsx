"use client";

import { useState } from "react";
import Icon from "./Icon";

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const initial: FormState = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

export default function ContactForm() {
  const [values, setValues] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const validate = () => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!values.name.trim()) next.name = "Please enter your name.";
    if (!values.email.trim()) {
      next.email = "Please enter your email address.";
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)) {
      next.email = "Please enter a valid email address.";
    }
    if (!values.message.trim() || values.message.trim().length < 10) {
      next.message = "Please share a few details about your enquiry.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("submitting");
    await new Promise((r) => setTimeout(r, 700));
    setStatus("success");
    setValues(initial);
  };

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-xl border border-accent/30 bg-white p-8 text-charcoal-800 shadow-card"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
          <Icon name="check" />
        </div>
        <h3 className="mt-4 font-display text-xl font-semibold">
          Thank you for reaching out.
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-charcoal-600">
          A member of our team will respond to your message within one business
          day. For urgent matters, please call us directly at +374 99 22 31 40.
        </p>
        <button
          type="button"
          className="btn-secondary mt-6"
          onClick={() => setStatus("idle")}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Contact form"
      className="space-y-5 rounded-xl border border-silver-200 bg-white p-6 shadow-card md:p-8"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="label-base">
            Full name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={(e) => setValues({ ...values, name: e.target.value })}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "err-name" : undefined}
            className="input-base mt-2"
            placeholder="Jane Doe"
          />
          {errors.name && (
            <p id="err-name" className="mt-1.5 text-xs text-red-600">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="contact-email" className="label-base">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "err-email" : undefined}
            className="input-base mt-2"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p id="err-email" className="mt-1.5 text-xs text-red-600">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="contact-phone" className="label-base">
          Phone number <span className="text-silver-400">(optional)</span>
        </label>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={(e) => setValues({ ...values, phone: e.target.value })}
          className="input-base mt-2"
          placeholder="+1 555 0100"
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="label-base">
          How can we help?
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          value={values.message}
          onChange={(e) => setValues({ ...values, message: e.target.value })}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "err-message" : undefined}
          className="input-base mt-2"
          placeholder="Share details about your trip — dates, group size, preferences."
        />
        {errors.message && (
          <p id="err-message" className="mt-1.5 text-xs text-red-600">
            {errors.message}
          </p>
        )}
      </div>

      <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
        <p className="text-xs text-charcoal-600">
          We typically respond within one business day.
        </p>
        <button
          type="submit"
          className="btn-primary"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Sending..." : "Send message"}
        </button>
      </div>
    </form>
  );
}
