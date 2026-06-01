/** Supabase Edge Functions — IDE 타입 (런타임은 jsr edge-runtime.d.ts) */
declare namespace Deno {
  function serve(
    handler: (request: Request) => Response | Promise<Response>,
  ): void
  const env: {
    get(key: string): string | undefined
  }
}
