import React from "react";

const BigBuyPrivacyNotice = ({ className = "" }) => {
  return (
    <div className={`text-xs text-gray-600 ${className}`}>
      <p className="mb-2">
        <strong>Inventory Data Notice (GDPR/DSGVO Compliance):</strong>
      </p>
      <ul className="space-y-1 text-xs">
        <li>
          • Stock information is fetched in real-time from our supplier BigBuy
        </li>
        <li>• No personal data is transmitted or stored during stock checks</li>
        <li>• Product availability data is not linked to your identity</li>
        <li>• Stock queries are processed anonymously for GDPR compliance</li>
        <li>
          • We do not retain or cache inventory-related personal information
        </li>
      </ul>
      <p className="mt-2 text-xs">
        For questions about data processing, contact our Data Protection Officer
        at{" "}
        <a
          href="mailto:privacy@dupp.com"
          className="text-stone hover:underline"
        >
          privacy@dupp.com
        </a>
      </p>
    </div>
  );
};

export default BigBuyPrivacyNotice;
