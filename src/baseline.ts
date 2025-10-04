import { features } from "web-features";
// import { getStatus } from "compute-baseline";

export type BaselineStatus =
  | "✅ Widely available"
  | "⚠️ Newly available"
  | "❌ Limited"
  | "❓ Unknown";

function formatStatus(status: "high" | "low" | false | undefined): BaselineStatus {
  if (status === "high") return "✅ Widely available";
  if (status === "low") return "⚠️ Newly available";
  if (status === false) return "❌ Limited";
  return "❓ Unknown";
}

// Local lookup using `web-features`
function localCheck(api: string): BaselineStatus | null {
  const feature = Object.values(features).find((f: any) =>
    f.name.toLowerCase().includes(api.toLowerCase())
  ) as any;

  if (feature?.status?.baseline !== undefined) {
    return formatStatus(feature.status.baseline);
  }
  return null;
}

// Remote fallback (Webstatus.dev API)
async function remoteCheck(api: string): Promise<BaselineStatus | null> {
  try {
    const resp = await fetch(`https://api.webstatus.dev/v1/features?q=id:${api}`);
    if (!resp.ok) return null;

    const result = (await resp.json()) as {
      data: Array<{ baseline?: { status?: "high" | "low" | "limited" } }>;
    };

    if (result.data?.length && result.data[0].baseline?.status) {
      return formatStatus(result.data[0].baseline.status as any);
    }
    return null;
  } catch {
    return null;
  }
}

// Public API
export async function baselineCheck(api: string): Promise<BaselineStatus> {
  const local = localCheck(api);
  if (local) return local;

  const remote = await remoteCheck(api);
  if (remote) return remote;

  return "❓ Unknown";
}
