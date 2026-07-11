// AWS Cost Optimization & Well-Architected Framework Relational Models

export interface CloudResource {
  id: string;
  type: 'ec2' | 'rds' | 's3' | 'elb';
  instanceType: string; // e.g. "t3.micro", "m5.large", "c5.4xlarge"
  tags: Record<string, string>; // Cost Allocation tags
  spotEnabled?: boolean;
  spotBidPrice?: number;
}

export function isOverprovisioned(instanceType: string): boolean {
  // Simple simulator checking oversized instances family allocations (e.g. 4xlarge, 8xlarge, 16xlarge)
  const lowerCaseType = instanceType.toLowerCase();
  return lowerCaseType.includes("4xlarge") || 
         lowerCaseType.includes("8xlarge") || 
         lowerCaseType.includes("12xlarge") ||
         lowerCaseType.includes("16xlarge");
}
