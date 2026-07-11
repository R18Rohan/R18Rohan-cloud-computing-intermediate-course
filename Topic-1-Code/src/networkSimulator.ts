// Advanced VPC Networking Traffic Simulator

export interface Packet {
  srcIp: string;
  destIp: string;
  destService?: string;
}

export interface SimulationResult {
  allowed: boolean;
  routeTaken: string;
  details: string;
}

export class NetworkSimulator {
  private vpcACidr = '10.0.0.0/16';
  private vpcBCidr = '10.1.0.0/16';
  private onPremCidr = '192.168.0.0/16';

  // Check route trace for a simulated packet
  simulateRoute(packet: Packet, subnet: 'public' | 'private'): SimulationResult {
    const { srcIp, destIp, destService } = packet;

    // 1. Check PrivateLink / VPC Interface Endpoint
    if (destService === 'aws.s3' && subnet === 'private') {
      return {
        allowed: true,
        routeTaken: 'PrivateLink (VPC Interface Endpoint)',
        details: 'Traffic routed privately to S3 endpoint in private subnet via AWS network backbone.'
      };
    }

    // 2. Check VPC Peering traffic between VPC A and VPC B
    if (srcIp.startsWith('10.0.') && destIp.startsWith('10.1.')) {
      return {
        allowed: true,
        routeTaken: 'VPC Peering Connection',
        details: `Direct route established from VPC A (${this.vpcACidr}) to VPC B (${this.vpcBCidr}).`
      };
    }

    // 3. Check Transit Gateway (TGW) Hub connectivity to On-Premises
    if (destIp.startsWith('192.168.')) {
      return {
        allowed: true,
        routeTaken: 'Transit Gateway (TGW)',
        details: 'Routed via TGW Attachment to simulated Virtual Private Gateway (VPN) / Direct Connect link.'
      };
    }

    // 4. Check Internet Egress paths
    if (destIp === '8.8.8.8') {
      if (subnet === 'public') {
        return {
          allowed: true,
          routeTaken: 'Internet Gateway (IGW)',
          details: 'Direct outbound internet routing permitted from public subnets.'
        };
      } else {
        // Private subnet requires NAT Gateway
        return {
          allowed: true,
          routeTaken: 'NAT Gateway',
          details: 'Outbound-only internet egress routed via VPC A NAT Gateway located in public subnet.'
        };
      }
    }

    // Default: blocked / unrouted
    return {
      allowed: false,
      routeTaken: 'None',
      details: `Destination address ${destIp} is unroutable or blocked by security policies.`
    };
  }
}
