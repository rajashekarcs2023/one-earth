export default function SeverityGuidePage() {
  return (
    <div className="py-6 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-emerald-800">Environmental Severity Guide</h1>
        <p className="text-gray-600">Understanding how we assess environmental impact</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">About Our Severity Scale</h2>
          <p className="text-gray-700 mb-3">
            One Earth uses a scientifically-informed 5-point severity scale to assess environmental issues. This scale
            helps communities and authorities prioritize response and understand the potential long-term impact of
            environmental problems.
          </p>
          <p className="text-gray-700">
            Our severity assessment considers multiple factors including recovery time, geographic scope, biodiversity
            impact, threat to protected species, and human health implications.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
              <h3 className="font-medium">Level 1: Minor</h3>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              Localized impact with natural recovery likely within weeks. Minimal ecosystem disruption.
            </p>
            <ul className="text-xs text-gray-600 list-disc pl-5 space-y-1">
              <li>Small area affected (less than 100 sq meters)</li>
              <li>No threat to protected species</li>
              <li>Minimal wildlife displacement</li>
              <li>No long-term soil or water contamination</li>
              <li>Example: Small roadside litter accumulation</li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 rounded-full bg-green-400 mr-2"></div>
              <h3 className="font-medium">Level 2: Moderate</h3>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              Limited area affected with recovery possible within months. Some wildlife displacement.
            </p>
            <ul className="text-xs text-gray-600 list-disc pl-5 space-y-1">
              <li>Affected area between 100-1000 sq meters</li>
              <li>Temporary wildlife displacement</li>
              <li>Minor soil or water contamination</li>
              <li>No permanent habitat loss</li>
              <li>Example: Small chemical spill in non-sensitive area</li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 rounded-full bg-yellow-400 mr-2"></div>
              <h3 className="font-medium">Level 3: Significant</h3>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              Significant ecosystem disruption affecting multiple species. Recovery may take 1-2 years.
            </p>
            <ul className="text-xs text-gray-600 list-disc pl-5 space-y-1">
              <li>Affected area between 1000-10,000 sq meters</li>
              <li>Multiple species affected</li>
              <li>Moderate soil or water contamination</li>
              <li>Temporary habitat degradation</li>
              <li>Example: Illegal logging in a small forest area</li>
            </ul>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 rounded-full bg-orange-400 mr-2"></div>
              <h3 className="font-medium">Level 4: Severe</h3>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              Severe damage to habitat with long-term consequences. Recovery requires 3-5 years and intervention.
            </p>
            <ul className="text-xs text-gray-600 list-disc pl-5 space-y-1">
              <li>Large area affected (10,000-100,000 sq meters)</li>
              <li>Significant biodiversity impact</li>
              <li>Potential threat to protected species</li>
              <li>Substantial soil or water contamination</li>
              <li>Example: Industrial waste dumping in a river</li>
            </ul>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border border-red-200 md:col-span-2">
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
              <h3 className="font-medium">Level 5: Critical</h3>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              Critical ecosystem damage with potential permanent loss. May affect endangered species or vital resources.
            </p>
            <ul className="text-xs text-gray-600 list-disc pl-5 space-y-1">
              <li>Massive area affected (more than 100,000 sq meters)</li>
              <li>Endangered species directly threatened</li>
              <li>Permanent habitat destruction</li>
              <li>Severe contamination requiring extensive remediation</li>
              <li>Potential human health emergency</li>
              <li>Example: Major oil spill in protected wetland or large-scale deforestation</li>
            </ul>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">How We Determine Initial Severity</h2>
          <p className="text-gray-700 mb-3">
            When a report is first submitted, our system assigns an initial severity level based on:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>
              <span className="font-medium">Reporter Assessment:</span> The severity level indicated by the person who
              submitted the report
            </li>
            <li>
              <span className="font-medium">AI Analysis:</span> Computer vision analysis of the submitted photos to
              identify the type and extent of environmental damage
            </li>
            <li>
              <span className="font-medium">Location Context:</span> Whether the issue is in a protected area,
              watershed, or other sensitive location
            </li>
            <li>
              <span className="font-medium">Issue Type:</span> Different environmental issues have different baseline
              severity levels
            </li>
          </ul>
          <p className="text-gray-700 mt-3">
            As community members add their assessments through Earth Echoes, the severity rating becomes more accurate,
            reflecting collective environmental expertise and local knowledge.
          </p>
        </div>
      </div>
    </div>
  )
}
