const dgram = require('dgram');  // For sending and receiving UDP packets
const dnsPacket = require('dns-packet');  // For encoding and decoding DNS packets

class DNSOperator {
  /**
   * Executes a DNS query for the given domain and DNS server.
   * @param {string} domain - The domain name to query.
   * @param {string} dnsServerIP - The IP address of the DNS server to query. Defaults to Google's DNS.
   * @returns {Promise<Object>} - A promise that resolves to an object containing DNS information.
   */
  async query(domain, dnsServerIP = '8.8.8.8') {  // Default to Google's DNS if no DNS server IP is provided
    const socket = dgram.createSocket('udp4');  // Create a UDP socket for faster DNS queries
    const result = {};  
    const startTime = Date.now();  // Record the start time

    // Create the DNS query packet
    const packet = dnsPacket.encode({
      type: 'query',
      id: 1, // Use a static ID for simplicity
      flags: dnsPacket.RECURSION_DESIRED, // Ask the DNS server to find the answer if it doesn't know it immediately
      questions: [{
        type: 'A', // Query for the IPv4 address of the domain
        name: domain
      }]
    });

    return new Promise((resolve, reject) => {
      // Listen for a response from the DNS server
      socket.on('message', (message) => {
        const endTime = Date.now(); 
        result.responseTime = endTime - startTime;  // Calculate response time

        const response = dnsPacket.decode(message); 
        result.statusCode = response.rcode || 'NOERROR';  // Record the status code
        result.ttl = response.answers[0]?.ttl || null;  // Record the Time to Live (TTL)
        result.nameServer = response.authorities[0]?.name || null;  // Record the Name Server

        resolve(result);
        socket.close();  // Close the socket
      });

      // Handle any errors
      socket.on('error', (err) => {
        result.statusCode = 'ERROR';  
        result.errorMessage = err.message; 
        reject(result);
        socket.close(); 
      });

      // Send the DNS query to the specified DNS server on port 53
      socket.send(packet, 0, packet.length, 53, dnsServerIP);
    });
  }
}

module.exports = DNSOperator;
