import { CopyableItem } from "../result-section";
import type { CampaignNaming } from "@/types/generation";

export function CampaignNamingSection({ data }: { data: CampaignNaming }) {
  const utmFields = [
    { label: "utm_source", value: data.utmSource },
    { label: "utm_medium", value: data.utmMedium },
    { label: "utm_campaign", value: data.utmCampaign },
    { label: "utm_content", value: data.utmContent },
  ];

  const utmUrl = `?utm_source=${data.utmSource}&utm_medium=${data.utmMedium}&utm_campaign=${data.utmCampaign}&utm_content=${data.utmContent}`;

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Consistent naming conventions make tracking and optimising campaigns much easier.
      </p>

      {/* Naming conventions */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
        <h3 className="font-semibold text-gray-900">Campaign Structure</h3>
        <div className="space-y-3">
          <CopyableItem label="Campaign Name" value={data.campaignName} />
          <CopyableItem label="Ad Set Naming Convention" value={data.adSetNamingConvention} />
          <CopyableItem label="Ad Naming Convention" value={data.adNamingConvention} />
        </div>
      </div>

      {/* UTM Parameters */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
        <h3 className="font-semibold text-gray-900">UTM Parameters</h3>
        <div className="grid grid-cols-2 gap-3">
          {utmFields.map((field) => (
            <CopyableItem
              key={field.label}
              label={field.label}
              value={field.value}
            />
          ))}
        </div>
      </div>

      {/* Full UTM string */}
      <div className="rounded-xl border border-brand-100 bg-brand-50 p-5">
        <p className="mb-2 text-sm font-semibold text-brand-900">Full UTM string</p>
        <p className="text-xs text-brand-600 mb-3">
          Append this to your landing page URL
        </p>
        <CopyableItem value={utmUrl} />
      </div>
    </div>
  );
}
