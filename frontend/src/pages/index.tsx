import Head from "next/head";
import {
  Card,
  Grid,
  Title,
  Text,
  Tab,
  TabList,
  TabGroup,
  TabPanel,
  TabPanels,
  Button,
  TextInput,
  NumberInput,
  Subtitle,
  Bold,
  Italic,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Color,
  Flex,
  Icon,
  Tracker,
  BarChart,
} from "@tremor/react";
import {
  NextButton,
  PageButton,
  Pagination,
  PrevButton,
} from "react-headless-pagination";

import { api } from "~/utils/api";
import { use, useEffect, useMemo, useState } from "react";
import { Settings } from "~/lib/dtos/settings.dto";
import RegionSelection from "~/components/regions-selection";
import CheckIntervalSelection from "~/components/check-interval-selection";
import clsx from "clsx";
import { Metrics } from "~/lib/dtos/metrics.dto";
import { ServerHealth } from "~/lib/dtos/server-health.dto";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowDownCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  CogIcon,
  MinusCircleIcon,
} from "@heroicons/react/20/solid";
import { DateTime } from "luxon";
import { set } from "zod";
interface Tracker {
  color: Color;
  tooltip: string;
}

interface ResponseTimeValue {
  name: string;
  "Response Time": number;
}
interface TTLValue {
  name: string;
  "TTL Value": number;
}
export default function Home() {
  const [settings, setSettings] = useState<Settings>();
  const [metrics, setMetrics] = useState<Metrics[]>([]);
  const [serverHealth, setServerHealth] = useState<ServerHealth[]>([]);
  const [serverHealthTracker, setServerHealthTracker] = useState<Tracker[]>([]);
  const [responseTimeChart, setResponseTimeChart] = useState<
    ResponseTimeValue[]
  >([]);
  const [ttlChart, setTTLChart] = useState<TTLValue[]>([]);
  const settingsQuery = api.healthCheckerRouter.getSettings.useQuery();

  const retrieveMetrics = api.healthCheckerRouter.getMetrics.useQuery(
    {
      nameServer: settings?.domain,
      limit: 10,
    },
    {
      enabled: settings !== undefined ? true : false,
      refetchInterval:
        settings !== undefined ? settings?.checkInterval * 1000 : 0,
    },
  );
  const serverHealthQuery = api.healthCheckerRouter.getServerHealth.useQuery(
    {
      nameServer: settings?.domain,
      limit: 10,
    },
    {
      enabled: settings !== undefined ? true : false,
      refetchInterval:
        settings !== undefined ? settings?.checkInterval * 1000 : 6000,
    },
  );

  useEffect(() => {
    if (settingsQuery.data) {
      setSettings(settingsQuery.data);
    }
    if (retrieveMetrics.data) {
      setMetrics(retrieveMetrics.data);
    }
    if (serverHealthQuery.data) {
      setServerHealth(serverHealthQuery.data);
    }
  }, [settingsQuery.data, retrieveMetrics.data, serverHealthQuery.data]);

  useEffect(() => {
    if (metrics) {
      const responseTimeChart: ResponseTimeValue[] = [];
      const ttlChart: TTLValue[] = [];
      metrics
        .sort((a, b) => a.id - b.id)
        .map((metric) => {
          responseTimeChart.push({
            name: DateTime.fromISO(metric.time).toFormat("dd/MM HH:mm:ss"),
            "Response Time": metric.metrics.responseTime,
          });
          ttlChart.push({
            name: DateTime.fromISO(metric.time).toFormat("dd/MM HH:mm:ss"),
            "TTL Value": metric.metrics.ttl,
          });
        });
      setResponseTimeChart(responseTimeChart);
      setTTLChart(ttlChart);
    }
    if (serverHealth) {
      const tracker: Tracker[] = [];
      serverHealth.map((server) => {
        if (server.is_valid === true) {
          tracker.push({ color: "emerald", tooltip: "Server is healthy" });
        } else {
          tracker.push({ color: "rose", tooltip: "Server is unhealthy" });
        }
      });
      setServerHealthTracker(tracker);
    }
  }, [metrics, serverHealth]);

  // Table setup
  const columnHelper = createColumnHelper<Metrics>();
  const columns = useMemo<any[]>(
    () => [
      columnHelper.accessor("id", {
        id: "id",
        header: "ID",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("time", {
        id: "time",
        header: "Date",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("metrics.nameServer", {
        id: "nameServer",
        header: "Server name",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("metrics.region", {
        id: "region",
        header: "Region",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("metrics.statusCode", {
        id: "statusCode",
        header: "Status",
        cell: (info) => info.getValue(),
      }),
    ],
    [],
  );
  const table = useReactTable<Metrics>({
    data: metrics,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  // End Table setup
  console.log;
  return (
    <>
      <Head>
        <title>DNS HealthCheckly</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="p-12">
        <Title>Dashboard</Title>
        <Text></Text>

        <TabGroup className="mt-6">
          <TabList>
            <Tab>Monitoring</Tab>
            <Tab>Settings</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Grid numItemsMd={2} numItemsLg={3} className="mt-6 gap-6">
                <Card>
                  <Title>
                    Response time of the DNS over the last 10 checks (in
                    milliseconds)
                  </Title>
                  <BarChart
                    className="mt-6"
                    data={responseTimeChart}
                    index="name"
                    categories={["Response Time"]}
                    colors={["blue"]}
                    yAxisWidth={48}
                  />
                </Card>
                <Card>
                  <div className="h-28">
                    <Title>
                      Time to live of the DNS over the last 10 checks (in
                      seconds)
                    </Title>
                    <BarChart
                      className="mt-6"
                      data={ttlChart}
                      index="name"
                      categories={["TTL Value"]}
                      colors={["blue"]}
                      yAxisWidth={48}
                    />
                  </div>
                </Card>
                <Card>
                  <Flex>
                    <Title className="w-full">Server health status</Title>
                    <Flex justifyContent="end" className="-mr-2 -space-x-2">
                      <Icon
                        icon={CheckCircleIcon}
                        color="emerald"
                        tooltip="Operational"
                      />
                      <Icon
                        icon={ArrowDownCircleIcon}
                        color="yellow"
                        tooltip="Degraded"
                      />
                      <Icon icon={CogIcon} color="gray" tooltip="Maintenance" />
                      <Icon
                        icon={MinusCircleIcon}
                        color="rose"
                        tooltip="Downtime"
                      />
                    </Flex>
                  </Flex>

                  <Tracker data={serverHealthTracker} className="mt-2" />
                  <Flex className="mt-2">
                    <Text>Jul 14</Text>
                    <Text>Aug 23</Text>
                  </Flex>
                </Card>
              </Grid>
              <div className="mt-6">
                <Card>
                  <div>
                    <Table>
                      <TableHead>
                        {table.getHeaderGroups().map((headerGroup) => (
                          <TableRow>
                            {headerGroup.headers.map((header) => (
                              <TableHeaderCell>
                                {header.isPlaceholder
                                  ? null
                                  : flexRender(
                                      header.column.columnDef.header,
                                      header.getContext(),
                                    )}
                              </TableHeaderCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableHead>
                      <TableBody>
                        {table.getRowModel().rows.map((row) => (
                          <TableRow key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                              <TableCell>
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext(),
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="flex  items-center justify-end pt-2">
                      {table.getPageCount() !== 1 && (
                        <>
                          <Pagination
                            className="flex h-10 select-none items-center text-sm  sm:max-w-7xl"
                            currentPage={table.getState().pagination.pageIndex}
                            edgePageCount={2}
                            middlePagesSiblingCount={1}
                            setCurrentPage={(page) => {
                              table.setPageIndex(page);
                            }}
                            totalPages={table.getPageCount()}
                            truncableClassName="w-10 px-0.5 text-center"
                            truncableText="..."
                          >
                            <PrevButton className="mr-2 flex  cursor-pointer items-center text-tremor-brand hover:text-tremor-brand-subtle focus:outline-none">
                              <ArrowLeftIcon className="mr-3" />
                            </PrevButton>

                            <div className="flex flex-grow items-center justify-center">
                              <nav className="flex flex-grow justify-center">
                                <ul className="flex items-center">
                                  <PageButton
                                    activeClassName="bg-tremor-brand-subtle text-tremor-brand"
                                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full"
                                    inactiveClassName="text-gray-500"
                                  />
                                </ul>
                              </nav>

                              <NextButton className="hover:text-mine-shaft-600 dark:hover:text-mine-shaft-200 mr-2 flex cursor-pointer items-center text-gray-500 focus:outline-none">
                                <ArrowRightIcon className="ml-3" />
                              </NextButton>
                            </div>
                          </Pagination>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            </TabPanel>

            <TabPanel>
              <div className="mt-6">
                <Card>
                  <form>
                    <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
                      <div>
                        <Title>Monitoring Settings</Title>
                        <Subtitle>
                          Configure your DNS monitoring settings.
                        </Subtitle>
                      </div>

                      {settings && (
                        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                          {/* Domain Input */}
                          <div className="sm:col-span-4">
                            <Text>
                              <Bold>Domain</Bold>
                            </Text>
                            <TextInput
                              type="text"
                              name="domain"
                              id="domain"
                              value={settings?.domain}
                            ></TextInput>
                          </div>

                          {/* Region Input */}
                          <div className="sm:col-span-4">
                            <Text>
                              <Bold>Region</Bold>
                            </Text>
                            <RegionSelection currentRegion={settings?.region} />
                          </div>
                          <div className="sm:col-span-4">
                            <Text>
                              <Bold>Check Interval</Bold>
                            </Text>
                            <CheckIntervalSelection
                              currentInterval={settings?.checkInterval}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
                      <div>
                        <Title>Health Check Settings</Title>
                        <Subtitle>
                          Configure your DNS health check settings.
                        </Subtitle>
                      </div>

                      <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 pt-4 sm:grid-cols-6 md:col-span-2">
                        <div className="sm:col-span-4">
                          <Text>
                            <Bold>Response Time Threshold</Bold>
                          </Text>
                          <NumberInput
                            enableStepper={true}
                            name="response-time-threshold"
                            id="response-time-threshold"
                            value={settings?.thresholds.responseTime}
                          />
                        </div>
                        <div className="sm:col-span-4">
                          <Text>
                            <Bold>Time to Live Threshold</Bold>
                          </Text>
                          <Text>
                            <Italic>
                              Check the box to monitor DNS health via TTL
                              values.
                            </Italic>
                          </Text>
                          <div className="relative flex items-center space-x-4">
                            <div className="flex h-6 items-center">
                              <input
                                id="ttl_enabled"
                                aria-describedby="ttl_enabled-description"
                                name="ttl_enabled"
                                type="checkbox"
                                className={clsx(
                                  "h-6 w-6 rounded border-gray-300 text-tremor-brand-subtle focus:ring-tremor-brand-subtle",
                                  "hover:cursor-pointer   hover:border-tremor-brand-subtle",
                                )}
                              />
                            </div>
                            <NumberInput
                              enableStepper={true}
                              name="time-to-live-threshold"
                              id="time-to-live-threshold"
                              value={settings?.thresholds.ttl}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Save Button */}
                    <div className="mt-6 flex items-center justify-end gap-x-6">
                      <Button variant="secondary">Cancel</Button>
                      <Button variant="primary">Save</Button>
                    </div>
                  </form>
                </Card>
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </main>
    </>
  );
}
