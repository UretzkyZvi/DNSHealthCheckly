const dgram = require("dgram");
const dnsPacket = require("dns-packet");
const DNSOperator = require("../../lib/DNSOperator"); // Adjust the path as needed

jest.mock("dgram", () => ({
  createSocket: jest.fn().mockReturnThis(),
  on: jest.fn(),
  send: jest.fn(),
}));

jest.mock("dns-packet", () => ({
  encode: jest.fn(),
  decode: jest.fn(),
}));

describe("DNSOperator", () => {
  let dnsOperator;

  beforeEach(() => {
    dnsOperator = new DNSOperator();
  });

  it("should perform a DNS query and return metrics", async () => {
    const fakeDomain = "www.google.com";
    const fakeRegion = "Global";
    const fakeDnsServerIP = "8.8.8.8"; // Google's DNS
    const fakeResponsePacket = {
      rcode: "NOERROR",
      answers: [
        {
          ttl: 300,
          name: fakeDomain,
        },
      ],
    };

    const fakeMetrics = {
      responseTime: 50,
      statusCode: "NOERROR",
      ttl: 300,
      nameServer: fakeDomain,
    };

    // Mock external dependencies
    dgram.createSocket.mockReturnValue({
      on: jest.fn((event, cb) => {
        if (event === "message") {
          cb(Buffer.from("Fake message"));
        }
      }),
      send: jest.fn((packet, offset, length, port, address, cb) => {
        cb(null);
      }),
    });

    dnsPacket.encode.mockReturnValue(Buffer.from("Fake packet"));
    dnsPacket.decode.mockReturnValue(fakeResponsePacket);

    // Perform the test action
    const startTime = Date.now();
    const result = await dnsOperator.query(fakeDomain, fakeRegion);
    const endTime = Date.now();

    // Validate the result
    expect(result.statusCode).toEqual(fakeMetrics.statusCode);
    expect(result.ttl).toEqual(fakeMetrics.ttl);
    expect(result.nameServer).toEqual(fakeMetrics.nameServer);
    expect(result.responseTime).toBeGreaterThanOrEqual(0);
    expect(result.responseTime).toBeLessThanOrEqual(endTime - startTime);
  });
  it("should handle errors gracefully", async () => {
    const fakeDomain = "www.google.com";
    const fakeRegion = "Global";
    const fakeErrorMessage = "DNS query failed";

    // Mock external dependencies to simulate an error
    const mockSocket = {
      on: function (event, cb) {
        if (event === "error") {
          cb(new Error(fakeErrorMessage));
          this.close(); // Close the socket
        }
      },
      send: jest.fn((packet, offset, length, port, address, cb) => {
        cb(null);
      }),
      close: jest.fn(),
    };

    dgram.createSocket.mockReturnValue(mockSocket);

    // Perform the test action
    const result = await dnsOperator
      .query(fakeDomain, fakeRegion)
      .catch((e) => e);
    expect(result.statusCode).toBe("ERROR");
    expect(result.errorMessage).toBe(fakeErrorMessage);
  });
});
