import features from "web-features/data.json";
import * as computeBaseline from "compute-baseline";
import { Compat } from "../node_modules/compute-baseline/dist/browser-compat-data/compat.js";
import bcd from "@mdn/browser-compat-data";
import { BaselineInfo, BaselineStatus } from "./@types/scanner";

function formatStatus(status: "high" | "low" | false | undefined): BaselineStatus {
  if (status === "high") {return "✅ Widely available";}
  if (status === "low") {return "⚠️ Newly available";}
  if (status === false) {return "❌ Limited";}
  return "❓ Unknown";
}

// Enhanced local lookup using `web-features`
function localCheck(api: string): BaselineInfo | null {
  // Direct feature lookup
  const directFeature = features[api as keyof typeof features] as any;
  if (directFeature?.status?.baseline !== undefined) {
    return {
      status: formatStatus(directFeature.status.baseline),
      lowDate: directFeature.status.baseline_low_date ?? undefined,
      highDate: directFeature.status.baseline_high_date ?? undefined,
      support: directFeature.status.support,
      description: directFeature.description,
      spec: directFeature.spec
    };
  }

  return null;
}

// BCD-specific lookup using compute-baseline
async function bcdCheck(api: string): Promise<BaselineInfo | null> {
  try {
    const bcdKey = mapApiToBCDKey(api);
    console.log(`bcdKey for ${api}: ${bcdKey}`);
    if (!bcdKey) {return null;}

    const compat = new Compat(bcd);
    const status = computeBaseline.baseline.computeBaseline({ compatKeys: [bcdKey] }, compat);
    console.log(`status for ${api}: ${JSON.stringify(status, null, 2)}`);
    console.log(`status for ${api}: ${JSON.stringify(status)}`);

    if (status) {
      const support: Record<string, string> = {};
      if (status.support) {
        for (const [browser, initialSupport] of status.support) {
          if (initialSupport) {
            support[browser.name] = initialSupport.release.version;
          }
        }
      }
      return {
        status: formatStatus(status.baseline as any),
        lowDate: status.baseline_low_date ?? undefined,
        highDate: status.baseline_high_date ?? undefined,
        support,
      };
    }
  } catch (error) {
    // Silently fail for BCD lookup
  }
  return null;
}

// Remote fallback (Webstatus.dev API)
async function remoteCheck(api: string): Promise<BaselineInfo | null> {
  try {
    const queries = [
      `id:${api}`,
      `name:${api}`,
      api.replace(/[-_]/g, ' ')
    ];

    for (const query of queries) {
      const resp = await fetch(`https://api.webstatus.dev/v1/features?q=${encodeURIComponent(query)}`);
      if (!resp.ok) {continue;}

      const result = await resp.json() as {
        data: Array<{ 
          baseline?: { 
            status?: "widely" | "newly" | "limited";
            low_date?: string;
            high_date?: string;
          };
          name?: string;
          feature_id?: string;
          spec?: { links?: Array<{ url: string }> };
        }>;
      };

      if (result.data?.length) {
        const feature = result.data[0];
        const baselineStatus = feature.baseline?.status;
        
        if (baselineStatus) {
          return {
            status: formatStatus(baselineStatus === "widely" ? "high" : 
                              baselineStatus === "newly" ? "low" : false),
            lowDate: feature.baseline?.low_date,
            highDate: feature.baseline?.high_date,
            description: feature.name,
            spec: feature.spec?.links?.[0]?.url
          };
        }
      }
    }
  } catch (error) {
    console.warn('Remote baseline check failed:', error);
  }
  return null;
}

// Public API
export async function baselineCheck(api: string): Promise<BaselineStatus> {
  const info = await getBaselineInfo(api);
  return info.status;
}

export async function getBaselineInfo(api: string): Promise<BaselineInfo> {
  // Try local lookup first (fastest)
  const local = localCheck(api);
  if (local && local.status !== "❓ Unknown") {
    return local;
  }

  // Try BCD lookup
  const bcd = await bcdCheck(api);
  if (bcd && bcd.status !== "❓ Unknown") {
    return bcd;
  }

  // Try remote lookup
  const remote = await remoteCheck(api);
  if (remote && remote.status !== "❓ Unknown") {
    return remote;
  }

  return {
    status: "❓ Unknown",
    description: `No baseline information found for ${api}`
  };
}

// Helper functions
function normalizeApiName(api: string): string {
  return api
    .toLowerCase()
    .replace(/^(css-|html-|js-|navigator-|window\.)/, '')
    .replace(/[-_]/g, '')
    .replace(/\(\)$/, '');
}

function mapApiToBCDKey(api: string): string | null {
  const mappings: Record<string, string> = {
    // CSS properties
    'css-property-grid': 'css.properties.grid',
    'css-property-flexbox': 'css.properties.display.flex',
    'css-property-gap': 'css.properties.gap',
    'css-function-clamp': 'css.types.clamp',
    'css-function-min': 'css.types.min',
    'css-function-max': 'css.types.max',
    
    // JavaScript APIs
    'fetch': 'api.fetch',
    'promise': 'javascript.builtins.Promise',
    'async-await': 'javascript.statements.async_function',
    'intersection-observer': 'api.IntersectionObserver',
    'resize-observer': 'api.ResizeObserver',
    
    // Navigator APIs
    'navigator-clipboard': 'api.Navigator.clipboard',
    'navigator-geolocation': 'api.Navigator.geolocation',
    'navigator-serviceworker': 'api.Navigator.serviceWorker',
    
    // HTML elements
    'html-element-dialog': 'html.elements.dialog',
    'html-element-details': 'html.elements.details',
    'html-element-summary': 'html.elements.summary'
  };

  return mappings[api] || null;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) {matrix[0][i] = i;}
  for (let j = 0; j <= str2.length; j++) {matrix[j][0] = j;}

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }

  return matrix[str2.length][str1.length];
}