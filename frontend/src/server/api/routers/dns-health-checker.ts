import { z } from "zod";
import { env } from "~/env.mjs";
import { Settings } from "~/lib/dtos/settings.dto";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const DNSHealthCheckerRouter = createTRPCRouter({
  getSettings: publicProcedure
    .query(async () => {
      const result = await fetch(`${env.API_URL}/config`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        })
      console.log(result);
      const response = await result.json();
      console.log(response);
      return response as Settings;
    }),
  setSettings: publicProcedure.input(
    z.object({
      domain: z.string().optional(),
      region: z.string(),
      metrics: z.array(z.string()),
      thresholds: z.object({}),
      checkInterval: z.number(),
    })).mutation(
      async (input) => {
        const result = await fetch(`${env.API_URL}/config`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(input),
        })
        const response = await result.json();
        return response as Settings;
      }
    ),
});
