import type { APIRoute } from 'astro';

/**
 * Lightweight health endpoint for container/orchestrator probes.
 * Returns 200 without using server secrets or external services.
 */
export const GET: APIRoute = () => {
  return new Response(JSON.stringify({ status: 'ok' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
