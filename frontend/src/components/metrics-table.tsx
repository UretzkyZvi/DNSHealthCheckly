import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Badge,
  Color,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";
import { FC, useMemo } from "react";
import {
  NextButton,
  PageButton,
  Pagination,
  PrevButton,
} from "react-headless-pagination";
import { Metrics } from "~/lib/dtos/metrics.dto";

interface MetricsTableProps {
  metrics: Metrics[];
}

const StatusCodes = [
  {
    code: "NOERROR",
    color: "emerald",
    description: "The query was successful, and an answer has been returned.",
  },
  {
    code: "FORMERR",
    color: "amber",
    description: "Format error; the server was unable to interpret the query.",
  },
  {
    code: "SERVFAIL",
    color: "rose",
    description:
      "Server failure; the server was unable to process this query due to a problem with the server.",
  },
  {
    code: "NXDOMAIN",
    color: "gray",
    description:
      "Name Error; meaningful only for responses from an authoritative name server, this code signifies that the domain name referenced in the query does not exist.",
  },
  {
    code: "NOTIMP",
    color: "rose",
    description:
      "Not Implemented; the name server does not support the requested kind of query.",
  },
  {
    code: "REFUSED",
    color: "rose",
    description: "The server refused to answer for the query.",
  },
];

const MetricsTable: FC<MetricsTableProps> = ({ metrics }) => {
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
      columnHelper.accessor("metrics.responseTime", {
        id: "responseTime",
        header: "Response time",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("metrics.ttl", {
        id: "ttl",
        header: "TTL",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("metrics.statusCode", {
        id: "statusCode",
        header: "Status",
        cell: (info) => {
          const status = StatusCodes.find((sc) => sc.code === info.getValue());
          return (
            <Badge
              tooltip={status?.description}
              color={(status?.color as Color) ?? "gray"}
            >
              {status?.code}
            </Badge>
          );
        },
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
  return (
    <>
      <Table>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup, index) => (
            <TableRow key={index}>
              {headerGroup.headers.map((header) => (
                <TableHeaderCell key={header.index}>
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
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
    </>
  );
};

export default MetricsTable;
