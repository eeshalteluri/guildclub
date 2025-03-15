import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-gray-600 mb-4">Last Updated: 12 Mar 2025</p>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">1. Introduction</h2>
        <p>
          Welcome to <strong>CheckChe</strong>. We are committed to
          protecting your privacy. This Privacy Policy explains how we collect, use, disclose,
          and safeguard your information when you use our application, website, and services. Please read this policy carefully to understand our
          views and practices regarding your personal data.
        </p>
      </section>

      <section className="space-y-4 mt-8">
        <h2 className="text-2xl font-semibold">2. Information We Collect</h2>
        <h3 className="font-semibold">a. Personal Information</h3>
        <p>Our only login method is through Google authentication and we collect:</p>
        <ul className="list-disc pl-6">
          <li>Name</li>
          <li>Email address</li>
          <li>Profile Image</li>
        </ul>

        {/*
            <h3 className="font-semibold">b. Usage Data</h3>
                <ul className="list-disc pl-6">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Pages you visit and time spent</li>
                <li>Referring website addresses</li>
                </ul>
        */}

        <h3 className="font-semibold">b. Cookies and Tracking Technologies</h3>
        <p>
          We may use cookies and similar tracking technologies to monitor the activity on our
          service and store certain information.
        </p>
      </section>

      <section className="space-y-4 mt-8">
        <h2 className="text-2xl font-semibold">3. How We Use Your Information</h2>
        <ul className="list-disc pl-6">
          <li>To provide, operate, and maintain our Services</li>
          <li>To improve, personalize, and expand our Services</li>
          <li>To communicate with you, including for customer service and updates</li>
          <li>To process transactions and send notifications</li>
          <li>To prevent fraud and ensure security</li>
          <li>To comply with legal obligations</li>
        </ul>
      </section>

      <section className="space-y-4 mt-8">
        <h2 className="text-2xl font-semibold">4. How We Share Your Information</h2>
        <p>
          We <strong>do not sell or rent</strong> your personal information to third parties.
          However, we may share information in the following ways:
        </p>
        <ul className="list-disc pl-6">
          <li>With trusted service providers under confidentiality agreements</li>
          <li>To comply with legal obligations</li>
          <li>In connection with business transfers like mergers or acquisitions</li>
        </ul>
      </section>

      <section className="space-y-4 mt-8">
        <h2 className="text-2xl font-semibold">5. Data Security</h2>
        <p>
          We implement reasonable technical and organizational measures to protect your data.
          However, no method of transmission over the Internet or electronic storage is 100%
          secure.
        </p>
      </section>

      <section className="space-y-4 mt-8">
        <h2 className="text-2xl font-semibold">6. Your Data Rights</h2>
        <p>You may have the following rights depending on your jurisdiction:</p>
        <ul className="list-disc pl-6">
          <li>Access the personal data we hold about you</li>
          <li>Correct inaccurate or incomplete data</li>
          <li>Delete your personal data</li>
          <li>Withdraw consent at any time</li>
          <li>Object to data processing under certain conditions</li>
        </ul>
        <p>
          To exercise these rights, contact us at{" "}
          <a href="mailto:eeshalteluri@gmail.com" className="text-blue-600 underline">
            [eeshalteluri@gmail.com]
          </a>
          .
        </p>
      </section>

      <section className="space-y-4 mt-8">
        <h2 className="text-2xl font-semibold">7. Data Retention</h2>
        <p>
          We retain your personal data only as long as necessary to provide you with our
          Services and for legitimate legal or business purposes.
        </p>
      </section>

      {/*
        <section className="space-y-4 mt-8">
        <h2 className="text-2xl font-semibold">8. Third-Party Links</h2>
        <p>
          Our Services may contain links to third-party websites. We are not responsible for
          the privacy practices or content of these external sites.
        </p>
      </section>
      */}

      <section className="space-y-4 mt-8">
      <h2 className="text-2xl font-semibold">9. Children&apos;s Privacy</h2>
        <p>
          Our Services are <strong>not intended for children under 13</strong>. We do not
          knowingly collect personal information from children. If you believe we have
          collected such information, please contact us immediately.
        </p>
      </section>

      <section className="space-y-4 mt-8">
        <h2 className="text-2xl font-semibold">10. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of
          significant changes by posting the new policy on this page and updating the &quot;Last
          Updated&quot; date.
        </p>
      </section>

      <section className="space-y-4 mt-8">
        <h2 className="text-2xl font-semibold">11. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, you can contact us at:
        </p>
        <p>
          📧 Email:{" "}
          <a href="mailto:eeshalteluri@gmail.com" className="text-blue-600 underline">
            eeshalteluri@gmail.com
          </a>
        </p>
        <p>🏢 Company Name: Cheche</p>
        <p>🌐 Website: http://localhost:3000</p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
