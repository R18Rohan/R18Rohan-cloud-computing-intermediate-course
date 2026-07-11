import { NetworkSimulator, Packet } from '../src/networkSimulator';

describe('Advanced VPC Networking Simulation Tests', () => {
  let simulator: NetworkSimulator;

  beforeEach(() => {
    simulator = new NetworkSimulator();
  });

  test('should route internet traffic from public subnet via Internet Gateway', () => {
    const packet: Packet = { srcIp: '10.0.1.50', destIp: '8.8.8.8' };
    const result = simulator.simulateRoute(packet, 'public');

    expect(result.allowed).toBe(true);
    expect(result.routeTaken).toBe('Internet Gateway (IGW)');
    expect(result.details).toContain('Direct outbound internet routing');
  });

  test('should route internet traffic from private subnet via NAT Gateway', () => {
    const packet: Packet = { srcIp: '10.0.2.100', destIp: '8.8.8.8' };
    const result = simulator.simulateRoute(packet, 'private');

    expect(result.allowed).toBe(true);
    expect(result.routeTaken).toBe('NAT Gateway');
    expect(result.details).toContain('Outbound-only internet egress');
  });

  test('should route peering traffic between VPC A and VPC B', () => {
    const packet: Packet = { srcIp: '10.0.2.100', destIp: '10.1.2.200' };
    const result = simulator.simulateRoute(packet, 'private');

    expect(result.allowed).toBe(true);
    expect(result.routeTaken).toBe('VPC Peering Connection');
    expect(result.details).toContain('Direct route established');
  });

  test('should route on-premises traffic through Transit Gateway Hub', () => {
    const packet: Packet = { srcIp: '10.0.2.100', destIp: '192.168.1.50' };
    const result = simulator.simulateRoute(packet, 'private');

    expect(result.allowed).toBe(true);
    expect(result.routeTaken).toBe('Transit Gateway (TGW)');
    expect(result.details).toContain('Direct Connect link');
  });

  test('should route S3 requests privately using PrivateLink endpoints', () => {
    const packet: Packet = { srcIp: '10.0.2.100', destIp: '52.216.0.0', destService: 'aws.s3' };
    const result = simulator.simulateRoute(packet, 'private');

    expect(result.allowed).toBe(true);
    expect(result.routeTaken).toBe('PrivateLink (VPC Interface Endpoint)');
    expect(result.details).toContain('routed privately to S3 endpoint');
  });

  test('should block unrouted destination network endpoints', () => {
    const packet: Packet = { srcIp: '10.0.2.100', destIp: '9.9.9.9' };
    const result = simulator.simulateRoute(packet, 'private');

    expect(result.allowed).toBe(false);
    expect(result.routeTaken).toBe('None');
    expect(result.details).toContain('unroutable or blocked');
  });
});
