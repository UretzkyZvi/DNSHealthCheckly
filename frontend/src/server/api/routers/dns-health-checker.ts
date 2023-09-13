import { z } from "zod";
import { env } from "~/env.mjs";
import { Metrics } from "~/lib/dtos/metrics.dto";
import { ServerHealth } from "~/lib/dtos/server-health.dto";
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

      const response = await result.json();

      return response as Settings;
    }),
  setSettings: publicProcedure.input(
    z.object({
      domain: z.string().optional(),
      region: z.string(),
      metrics: z.array(z.string()),
      thresholds:  z.record(z.any()),
      checkInterval: z.number(),
    })).mutation(
      async ({input}) => {
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
  getMetrics: publicProcedure.input(
    z.object({
      startTime: z.string().optional(),
      endTime: z.string().optional(),
      nameServer: z.string().optional(),
      limit: z.number().optional(),
    })
  ).query(async ({ input }) => {
    const { startTime, endTime, nameServer, limit } = input;

    // Construct query parameters
    const params = new URLSearchParams();
    if (startTime) params.append('startTime', startTime);
    if (endTime) params.append('endTime', endTime);
    if (nameServer) params.append('nameServer', nameServer);
    if (limit) params.append('limit', limit.toString());

    // Construct the full URL with query parameters
    const url = `${env.API_URL}/metrics?${params.toString()}`;

    const result = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const response = await result.json();
    return response as Metrics[];
  }),
  getServerHealth: publicProcedure.input(
    z.object({
      startTime: z.string().optional(),
      endTime: z.string().optional(),
      serverName: z.string().optional(),
      limit: z.number().optional(),
    })
  ).query(async ({input}) => {
    const { startTime, endTime, serverName, limit } = input;
     // Construct query parameters
     const params = new URLSearchParams();
     if (startTime) params.append('startTime', startTime);
     if (endTime) params.append('endTime', endTime);
     if (serverName) params.append('serverName', serverName);
     if (limit) params.append('limit', limit.toString());
 
    const result = await fetch(`${env.API_URL}/server-health?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const response = await result.json();
    return response as ServerHealth[];
  }),
});
