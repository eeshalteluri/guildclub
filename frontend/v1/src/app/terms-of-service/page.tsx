import React from "react";

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="text-gray-600 mb-4">Last Updated: 12 Mar 2025</p>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">1. Introduction</h2>
        <p>
          Welcome to <strong>CheckChe</strong>. By accessing or using
          our website and services, you agree to be bound by these Terms of
          Service. If you do not agree to these Terms, please do not use our Services.
        </p>
      </section>

      <section className="space-y-4 mt-8">
        <h2 className="text-2xl font-semibold">2. Use of Our Services</h2>
        <ul className="list-disc pl-6">
          <li>You must be at least 13 years old to use our Services.</li>
          <li>
            You agree to use our Services only for lawful purposes and in accordance with these
            Terms.
          </li>
          <li>
            You are responsible for maintaining the confidentiality of your account credentials.
          </li>
          <li>
            You agree not to misuse, hack, or disrupt our Services or servers.
          </li>
        </ul>
      </section>

      <section className="space-y-4 mt-8">
        <h2 className="text-2xl font-semibold">3. Intellectual Property</h2>
        <p>
          All content, trademarks, and intellectual property on our Services are owned by{" "}
          <strong>CheckChe</strong> or its licensors. You may not copy, modify,
          distribute, sell, or lease any part of our Services without our written consent.
        </p>
      </section>

      <section className="space-y-4 mt-8">
        <h2 className="text-2xl font-semibold">4. User Content</h2>
        <p>
          You are responsible for any content you upload or share on our Services. By submitting
          content, you grant us a non-exclusive, worldwide, royalty-free license to use, display,
          and distribute such content within our Services.
        </p>
        <p>
          You agree not to upload or share content that is illegal, offensive, or infringes on
          intellectual property rights.
        </p>
      </section>

      <section className="space-y-4 mt-8">
        <h2 className="text-2xl font-semibold">5. Termination</h2>
        <p>
          We reserve the right to suspend or terminate your access to our Services at any time,
          without prior notice, if you violate these Terms or engage in harmful activities.
        </p>
      </section>

      <section className="space-y-4 mt-8">
        <h2 className="text-2xl font-semibold">6. Limitation of Liability</h2>
        <p>
          Our Services are provided "as is" without warranties of any kind. We are not liable for
          any direct, indirect, incidental, or consequential damages arising from your use of the
          Services.
        </p>
      </section>

      <section className="space-y-4 mt-8">
        <h2 className="text-2xl font-semibold">7. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless <strong>CheckChe</strong>, its
          affiliates, and employees from any claims, damages, or expenses arising from your use
          of the Services or violation of these Terms.
        </p>
      </section>

      <section className="space-y-4 mt-8">
        <h2 className="text-2xl font-semibold">8. Changes to Terms</h2>
        <p>
          We may update these Terms of Service from time to time. We will notify you of
          significant changes by updating the "Last Updated" date. Your continued use of the
          Services constitutes acceptance of the updated Terms.
        </p>
      </section>

      <section className="space-y-4 mt-8">
        <h2 className="text-2xl font-semibold">9. Governing Law</h2>
        <p>
          These Terms are governed by and construed in accordance with the laws of{" "}
          <strong>India</strong>, without regard
          to its conflict of law provisions.
        </p>
      </section>

      <section className="space-y-4 mt-8">
        <h2 className="text-2xl font-semibold">10. Contact Us</h2>
        <p>
          If you have any questions about these Terms, you can contact us at:
        </p>
        <p>
          📧 Email:{" "}
          <a href="mailto:eeshalteluri@gmail.com" className="text-blue-600 underline">
            eeshalteluri@gmail.com
          </a>
        </p>
      </section>
    </div>
  );
};

export default TermsOfService;
