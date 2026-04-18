import {
  Environment,
  Network,
  RecordSource,
  Store,
  FetchFunction,
} from "relay-runtime";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const fetchFn: FetchFunction = async (request, variables) => {
  const response = await fetch(`${SUPABASE_URL}/graphql/v1`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY,
    },
    body: JSON.stringify({
      query: request.text,
      variables,
    }),
  });

  const json = await response.json();

  if (json.errors) {
    console.error("GraphQL errors:", json.errors);
    throw new Error(
      json.errors.map((e: { message: string }) => e.message).join("\n")
    );
  }

  return json;
};

export function createRelayEnvironment() {
  return new Environment({
    network: Network.create(fetchFn),
    store: new Store(new RecordSource(), { gcReleaseBufferSize: 10 }),
    getDataID: (record) => {
      const nodeId = record.nodeId;
      return typeof nodeId === "string" ? nodeId : undefined;
    },
  });
}
