/**
 * AWS SAP-C02 Question Bank
 * 40+ Professional-level questions covering all 4 content domains
 */

import type { Question } from "./types";
import { ContentDomain } from "./types";

export const questionBank: Question[] = [
  // Complex Organizations Domain (10 questions)
  {
    id: "q001",
    domain: ContentDomain.COMPLEX_ORGANIZATIONS,
    text: "A large enterprise with multiple AWS accounts needs to implement centralized logging and security monitoring across all accounts. The solution must provide real-time threat detection and compliance reporting. Which combination of services should be used?",
    choices: [
      {
        id: "q001-a",
        text: "AWS CloudTrail with S3 bucket in each account, Amazon GuardDuty in each account, AWS Config aggregator",
      },
      {
        id: "q001-b",
        text: "AWS Organizations with CloudTrail organization trail, GuardDuty delegated administrator, Security Hub with aggregation",
      },
      {
        id: "q001-c",
        text: "Individual CloudWatch Logs in each account, AWS Lambda for log aggregation, Amazon SNS for notifications",
      },
      {
        id: "q001-d",
        text: "AWS Control Tower with CloudTrail, AWS Config in each account, manual security reviews",
      },
    ],
    correctChoiceId: "q001-b",
    explanation:
      "AWS Organizations with CloudTrail organization trail provides centralized logging across all accounts. GuardDuty delegated administrator enables centralized threat detection management. Security Hub with aggregation provides unified security findings and compliance reporting across the organization. This is the most scalable and manageable solution for complex organizations. Reference: https://docs.aws.amazon.com/organizations/latest/userguide/orgs_integrate_services.html",
    difficulty: "hard",
    tags: ["AWS Organizations", "CloudTrail", "GuardDuty", "Security Hub", "Multi-Account"],
  },
  {
    id: "q002",
    domain: ContentDomain.COMPLEX_ORGANIZATIONS,
    text: "An organization uses AWS Organizations with multiple OUs for different business units. They need to enforce that all EC2 instances must use encrypted EBS volumes and prevent any unencrypted volumes from being created. What is the most effective approach?",
    choices: [
      {
        id: "q002-a",
        text: "Create an IAM policy in each account that denies ec2:CreateVolume without encryption",
      },
      {
        id: "q002-b",
        text: "Use AWS Config rules to detect unencrypted volumes and automatically remediate them",
      },
      {
        id: "q002-c",
        text: "Implement a Service Control Policy (SCP) at the OU level that denies ec2:CreateVolume and ec2:RunInstances when encryption is not enabled",
      },
      {
        id: "q002-d",
        text: "Enable AWS CloudTrail and use EventBridge to trigger Lambda functions that delete unencrypted volumes",
      },
    ],
    correctChoiceId: "q002-c",
    explanation:
      "Service Control Policies (SCPs) are the most effective way to enforce organizational policies across multiple accounts. An SCP at the OU level will prevent the creation of unencrypted EBS volumes at the API level, making it impossible to bypass. This is a preventive control rather than detective (Config) or reactive (Lambda deletion). Reference: https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html",
    difficulty: "hard",
    tags: ["AWS Organizations", "SCP", "EBS", "Encryption", "Compliance"],
  },
  {
    id: "q003",
    domain: ContentDomain.COMPLEX_ORGANIZATIONS,
    text: "A company needs to share VPC resources across 50+ AWS accounts in different regions while maintaining network isolation between business units. What is the most scalable solution?",
    choices: [
      { id: "q003-a", text: "VPC peering connections between all accounts" },
      { id: "q003-b", text: "AWS Transit Gateway with Resource Access Manager (RAM) sharing" },
      { id: "q003-c", text: "AWS PrivateLink endpoints in each account" },
      { id: "q003-d", text: "Site-to-Site VPN connections through a central hub account" },
    ],
    correctChoiceId: "q003-b",
    explanation:
      "AWS Transit Gateway with RAM sharing provides the most scalable solution for connecting multiple VPCs across accounts and regions. It supports up to 5,000 VPC attachments per gateway and can be shared across accounts using RAM. This eliminates the need for complex peering relationships and provides centralized routing control. Reference: https://docs.aws.amazon.com/vpc/latest/tgw/",
    difficulty: "hard",
    tags: ["Transit Gateway", "RAM", "VPC", "Multi-Account", "Networking"],
  },
  {
    id: "q004",
    domain: ContentDomain.COMPLEX_ORGANIZATIONS,
    text: "An enterprise requires centralized DNS resolution for on-premises and AWS resources across 100+ AWS accounts. The solution must support conditional forwarding and be highly available. What should be implemented?",
    choices: [
      {
        id: "q004-a",
        text: "Route 53 Resolver endpoints in each account with manual configuration",
      },
      {
        id: "q004-b",
        text: "Route 53 Resolver with RAM-shared rules and endpoints in a central networking account",
      },
      { id: "q004-c", text: "Amazon Route 53 private hosted zones replicated to each account" },
      { id: "q004-d", text: "Third-party DNS servers on EC2 instances in each account" },
    ],
    correctChoiceId: "q004-b",
    explanation:
      "Route 53 Resolver with RAM-shared rules provides centralized DNS management across multiple accounts. By creating resolver endpoints and rules in a central networking account and sharing them via RAM, you can manage conditional forwarding rules centrally while providing DNS resolution to all accounts. This is highly available and scalable. Reference: https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resolver.html",
    difficulty: "hard",
    tags: ["Route 53", "DNS", "RAM", "Hybrid", "Multi-Account"],
  },
  {
    id: "q005",
    domain: ContentDomain.COMPLEX_ORGANIZATIONS,
    text: "A financial services company needs to implement cross-account backup strategy for RDS databases across 30 accounts with 7-year retention for compliance. What is the most cost-effective solution?",
    choices: [
      {
        id: "q005-a",
        text: "AWS Backup with organization-wide backup policies and lifecycle rules to Glacier Deep Archive",
      },
      {
        id: "q005-b",
        text: "Manual RDS snapshots copied to S3 in each account with lifecycle policies",
      },
      {
        id: "q005-c",
        text: "AWS Database Migration Service continuous replication to a central account",
      },
      { id: "q005-d", text: "Third-party backup solution running on EC2 instances" },
    ],
    correctChoiceId: "q005-a",
    explanation:
      "AWS Backup with organization-wide backup policies provides centralized backup management across accounts. Lifecycle rules can automatically transition backups to Glacier Deep Archive for long-term retention at the lowest cost. This solution is fully managed, compliant, and cost-effective for 7-year retention requirements. Reference: https://docs.aws.amazon.com/aws-backup/latest/devguide/",
    difficulty: "medium",
    tags: ["AWS Backup", "RDS", "Compliance", "Cost Optimization", "Multi-Account"],
  },
  {
    id: "q006",
    domain: ContentDomain.COMPLEX_ORGANIZATIONS,
    text: "A company with 200+ AWS accounts needs to implement cost allocation and chargeback to business units. They require detailed cost tracking by project, environment, and cost center. What is the best approach?",
    choices: [
      { id: "q006-a", text: "Use AWS Cost Explorer with manual tagging in each account" },
      {
        id: "q006-b",
        text: "Implement AWS Organizations with tag policies, Cost Categories, and consolidated billing",
      },
      {
        id: "q006-c",
        text: "Create separate AWS accounts for each cost center and use billing alerts",
      },
      { id: "q006-d", text: "Use third-party cost management tools with API integration" },
    ],
    correctChoiceId: "q006-b",
    explanation:
      "AWS Organizations with tag policies enforces consistent tagging across all accounts. Cost Categories allow you to map costs to business units based on tags, accounts, or services. Consolidated billing provides a single bill with detailed cost allocation. This combination provides the most comprehensive and automated cost allocation solution. Reference: https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/cost-alloc-tags.html",
    difficulty: "medium",
    tags: ["Cost Management", "AWS Organizations", "Tagging", "Billing"],
  },
  {
    id: "q007",
    domain: ContentDomain.COMPLEX_ORGANIZATIONS,
    text: "An organization needs to implement a landing zone for 500+ AWS accounts with automated account provisioning, guardrails, and compliance monitoring. What solution should be used?",
    choices: [
      { id: "q007-a", text: "AWS Organizations with manual account creation and Config rules" },
      {
        id: "q007-b",
        text: "AWS Control Tower with Account Factory and detective/preventive guardrails",
      },
      { id: "q007-c", text: "AWS CloudFormation StackSets with custom automation scripts" },
      { id: "q007-d", text: "AWS Service Catalog with manual approval workflows" },
    ],
    correctChoiceId: "q007-b",
    explanation:
      "AWS Control Tower is specifically designed for setting up and governing multi-account AWS environments at scale. It provides Account Factory for automated account provisioning, pre-configured guardrails (SCPs and Config rules), and a dashboard for compliance monitoring. This is the most comprehensive solution for landing zone implementation. Reference: https://docs.aws.amazon.com/controltower/latest/userguide/",
    difficulty: "medium",
    tags: ["Control Tower", "Landing Zone", "Governance", "Multi-Account"],
  },
  {
    id: "q008",
    domain: ContentDomain.COMPLEX_ORGANIZATIONS,
    text: "A global company needs to implement cross-region disaster recovery for their multi-account AWS environment with RPO of 15 minutes and RTO of 1 hour. What is the most appropriate solution?",
    choices: [
      { id: "q008-a", text: "AWS Backup with cross-region copy and manual recovery procedures" },
      {
        id: "q008-b",
        text: "AWS Elastic Disaster Recovery (DRS) with continuous replication to a secondary region",
      },
      {
        id: "q008-c",
        text: "Pilot light architecture with periodic snapshots and manual failover",
      },
      { id: "q008-d", text: "Warm standby with Route 53 health checks and manual DNS failover" },
    ],
    correctChoiceId: "q008-b",
    explanation:
      "AWS Elastic Disaster Recovery (formerly CloudEndure) provides continuous block-level replication with RPO measured in seconds and RTO of minutes. It supports cross-region and cross-account replication, making it ideal for meeting aggressive RPO/RTO requirements. The service automates failover and failback processes. Reference: https://docs.aws.amazon.com/drs/latest/userguide/",
    difficulty: "hard",
    tags: ["Disaster Recovery", "DRS", "Multi-Region", "Business Continuity"],
  },
  {
    id: "q009",
    domain: ContentDomain.COMPLEX_ORGANIZATIONS,
    text: "A company needs to implement centralized security incident response across 80 AWS accounts. They require automated threat detection, investigation, and remediation capabilities. What combination provides the best solution?",
    choices: [
      { id: "q009-a", text: "GuardDuty in each account with manual investigation and remediation" },
      {
        id: "q009-b",
        text: "Security Hub with GuardDuty, Detective, and automated response via EventBridge and Lambda",
      },
      { id: "q009-c", text: "CloudWatch Logs Insights with manual log analysis and response" },
      { id: "q009-d", text: "Third-party SIEM solution with AWS CloudTrail integration" },
    ],
    correctChoiceId: "q009-b",
    explanation:
      "Security Hub aggregates findings from GuardDuty, Detective, and other services across accounts. Amazon Detective provides investigation capabilities with ML-powered analysis. EventBridge can trigger automated remediation via Lambda functions. This combination provides comprehensive threat detection, investigation, and automated response capabilities. Reference: https://docs.aws.amazon.com/securityhub/latest/userguide/",
    difficulty: "hard",
    tags: ["Security Hub", "GuardDuty", "Detective", "Incident Response", "Automation"],
  },
  {
    id: "q010",
    domain: ContentDomain.COMPLEX_ORGANIZATIONS,
    text: "An enterprise requires centralized network traffic inspection for all VPCs across 60 accounts. The solution must support IDS/IPS capabilities and scale to 100 Gbps. What should be implemented?",
    choices: [
      { id: "q010-a", text: "AWS Network Firewall in each VPC with manual rule management" },
      {
        id: "q010-b",
        text: "AWS Network Firewall in a central inspection VPC with Transit Gateway routing",
      },
      { id: "q010-c", text: "Third-party firewall appliances on EC2 instances in each VPC" },
      { id: "q010-d", text: "VPC Flow Logs with Lambda analysis and security groups" },
    ],
    correctChoiceId: "q010-b",
    explanation:
      "AWS Network Firewall in a central inspection VPC with Transit Gateway provides centralized traffic inspection at scale. Traffic from all VPCs can be routed through the inspection VPC using Transit Gateway route tables. Network Firewall supports IDS/IPS with Suricata-compatible rules and scales automatically to meet throughput requirements. Reference: https://docs.aws.amazon.com/network-firewall/latest/developerguide/",
    difficulty: "hard",
    tags: ["Network Firewall", "Transit Gateway", "IDS/IPS", "Centralized Security"],
  },
  // New Solutions Domain (10 questions)
  {
    id: "q011",
    domain: ContentDomain.NEW_SOLUTIONS,
    text: "A startup is building a serverless application that processes user uploads. Files can be up to 5GB and must be processed within 15 minutes. Processing includes video transcoding, thumbnail generation, and metadata extraction. What architecture should be used?",
    choices: [
      { id: "q011-a", text: "Lambda function triggered by S3 event with 15-minute timeout" },
      {
        id: "q011-b",
        text: "S3 event triggers Step Functions workflow orchestrating ECS Fargate tasks",
      },
      { id: "q011-c", text: "EC2 Auto Scaling group polling SQS queue for new uploads" },
      { id: "q011-d", text: "Lambda function that starts EC2 instances for processing" },
    ],
    correctChoiceId: "q011-b",
    explanation:
      "Step Functions can orchestrate long-running workflows beyond Lambda's 15-minute limit. ECS Fargate provides containerized compute without server management, ideal for processing large files. S3 events trigger the workflow, and Step Functions coordinates multiple processing tasks (transcoding, thumbnails, metadata). This is fully serverless and scalable. Reference: https://docs.aws.amazon.com/step-functions/latest/dg/",
    difficulty: "medium",
    tags: ["Step Functions", "ECS Fargate", "S3", "Serverless", "Workflow"],
  },
  {
    id: "q012",
    domain: ContentDomain.NEW_SOLUTIONS,
    text: "A company is designing a real-time analytics platform that ingests 500,000 events per second from IoT devices. The solution must provide sub-second query latency and support complex aggregations. What combination of services should be used?",
    choices: [
      { id: "q012-a", text: "Kinesis Data Streams → Lambda → DynamoDB with DAX" },
      { id: "q012-b", text: "Kinesis Data Streams → Kinesis Data Analytics → OpenSearch Service" },
      { id: "q012-c", text: "Kinesis Data Firehose → S3 → Athena with partition projection" },
      { id: "q012-d", text: "SQS → Lambda → RDS Aurora with read replicas" },
    ],
    correctChoiceId: "q012-b",
    explanation:
      "Kinesis Data Streams handles high-throughput ingestion (500K events/sec). Kinesis Data Analytics processes streaming data in real-time with SQL or Apache Flink. OpenSearch Service provides sub-second query latency with powerful aggregation capabilities. This architecture is purpose-built for real-time analytics at scale. Reference: https://docs.aws.amazon.com/kinesisanalytics/latest/dev/",
    difficulty: "hard",
    tags: ["Kinesis", "Real-time Analytics", "OpenSearch", "IoT", "Streaming"],
  },
  {
    id: "q013",
    domain: ContentDomain.NEW_SOLUTIONS,
    text: "A financial services company needs to build a trading platform that requires single-digit millisecond latency for database operations and must handle 1 million transactions per second. What database solution should be used?",
    choices: [
      { id: "q013-a", text: "DynamoDB with on-demand capacity and DAX caching" },
      { id: "q013-b", text: "Aurora PostgreSQL with read replicas and connection pooling" },
      { id: "q013-c", text: "ElastiCache for Redis with cluster mode enabled" },
      { id: "q013-d", text: "RDS MySQL with Multi-AZ and read replicas" },
    ],
    correctChoiceId: "q013-a",
    explanation:
      "DynamoDB with DAX (DynamoDB Accelerator) provides microsecond read latency and can handle millions of requests per second. On-demand capacity automatically scales to handle traffic spikes. DAX is an in-memory cache that provides single-digit millisecond response times. This combination is ideal for high-throughput, low-latency trading applications. Reference: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DAX.html",
    difficulty: "hard",
    tags: ["DynamoDB", "DAX", "Low Latency", "High Throughput", "Trading"],
  },
  {
    id: "q014",
    domain: ContentDomain.NEW_SOLUTIONS,
    text: "A company is building a machine learning platform that requires training models on petabytes of data stored in S3. Training jobs take 12-48 hours and must be cost-optimized. What compute solution should be used?",
    choices: [
      { id: "q014-a", text: "EC2 On-Demand instances with EBS volumes" },
      { id: "q014-b", text: "SageMaker Training Jobs with Spot instances and S3 data source" },
      { id: "q014-c", text: "ECS Fargate tasks with EFS storage" },
      { id: "q014-d", text: "Lambda functions with increased memory and timeout" },
    ],
    correctChoiceId: "q014-b",
    explanation:
      "SageMaker Training Jobs are purpose-built for ML training with native S3 integration. Spot instances can reduce costs by up to 90% for fault-tolerant workloads. SageMaker handles checkpointing and can resume training if Spot instances are interrupted. This provides the best combination of performance, scalability, and cost optimization for ML training. Reference: https://docs.aws.amazon.com/sagemaker/latest/dg/model-managed-spot-training.html",
    difficulty: "medium",
    tags: ["SageMaker", "Machine Learning", "Spot Instances", "Cost Optimization"],
  },
  {
    id: "q015",
    domain: ContentDomain.NEW_SOLUTIONS,
    text: "A media company needs to deliver live video streams to millions of concurrent viewers globally with less than 3 seconds of latency. What solution should be implemented?",
    choices: [
      { id: "q015-a", text: "MediaLive → MediaPackage → CloudFront with HLS" },
      { id: "q015-b", text: "MediaLive → MediaStore → CloudFront with CMAF" },
      { id: "q015-c", text: "EC2 instances running streaming servers with CloudFront" },
      { id: "q015-d", text: "S3 with CloudFront and signed URLs" },
    ],
    correctChoiceId: "q015-a",
    explanation:
      "MediaLive encodes live video streams, MediaPackage prepares and protects content for delivery, and CloudFront distributes globally with low latency. HLS (HTTP Live Streaming) with Low-Latency HLS can achieve sub-3-second latency. This AWS-native solution scales automatically to millions of viewers. Reference: https://docs.aws.amazon.com/medialive/latest/ug/",
    difficulty: "medium",
    tags: ["MediaLive", "MediaPackage", "CloudFront", "Live Streaming", "Video"],
  },
  {
    id: "q016",
    domain: ContentDomain.NEW_SOLUTIONS,
    text: "A SaaS company is building a multi-tenant application where each tenant's data must be cryptographically isolated. The solution must support automatic key rotation and audit logging. What should be implemented?",
    choices: [
      { id: "q016-a", text: "Single KMS key with encryption context for tenant isolation" },
      { id: "q016-b", text: "KMS key per tenant with automatic rotation and CloudTrail logging" },
      { id: "q016-c", text: "Client-side encryption with tenant-managed keys" },
      { id: "q016-d", text: "S3 bucket encryption with SSE-S3" },
    ],
    correctChoiceId: "q016-b",
    explanation:
      "KMS key per tenant provides cryptographic isolation ensuring one tenant cannot decrypt another's data. KMS supports automatic key rotation and integrates with CloudTrail for comprehensive audit logging. This approach provides the strongest security guarantees for multi-tenant applications. Reference: https://docs.aws.amazon.com/kms/latest/developerguide/multi-tenant.html",
    difficulty: "hard",
    tags: ["KMS", "Encryption", "Multi-Tenant", "Security", "Compliance"],
  },
  {
    id: "q017",
    domain: ContentDomain.NEW_SOLUTIONS,
    text: "A company needs to build a GraphQL API that aggregates data from multiple microservices (REST APIs, databases, and Lambda functions). The solution must support real-time subscriptions and offline sync. What should be used?",
    choices: [
      { id: "q017-a", text: "API Gateway with Lambda integration and WebSocket API" },
      { id: "q017-b", text: "AWS AppSync with multiple data sources and conflict resolution" },
      { id: "q017-c", text: "Application Load Balancer with Lambda targets" },
      { id: "q017-d", text: "EC2 instances running GraphQL server with ElastiCache" },
    ],
    correctChoiceId: "q017-b",
    explanation:
      "AWS AppSync is a managed GraphQL service that can integrate with multiple data sources (DynamoDB, Lambda, HTTP endpoints, RDS). It provides built-in support for real-time subscriptions via WebSockets and offline sync with conflict resolution. This eliminates the need to build and manage GraphQL infrastructure. Reference: https://docs.aws.amazon.com/appsync/latest/devguide/",
    difficulty: "medium",
    tags: ["AppSync", "GraphQL", "Real-time", "Microservices", "API"],
  },
  {
    id: "q018",
    domain: ContentDomain.NEW_SOLUTIONS,
    text: "A gaming company needs to implement a leaderboard system that updates in real-time for 10 million players. Queries must return top 100 players globally and by region with sub-100ms latency. What solution should be used?",
    choices: [
      { id: "q018-a", text: "DynamoDB with Global Secondary Indexes and DynamoDB Streams" },
      { id: "q018-b", text: "ElastiCache for Redis with sorted sets and read replicas" },
      { id: "q018-c", text: "Aurora PostgreSQL with materialized views and read replicas" },
      { id: "q018-d", text: "OpenSearch Service with aggregations and caching" },
    ],
    correctChoiceId: "q018-b",
    explanation:
      "ElastiCache for Redis with sorted sets (ZSET) is purpose-built for leaderboard use cases. Sorted sets provide O(log N) operations for updates and range queries. Redis read replicas enable global distribution with sub-millisecond latency. This solution can handle millions of concurrent users with real-time updates. Reference: https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/",
    difficulty: "hard",
    tags: ["ElastiCache", "Redis", "Gaming", "Real-time", "Leaderboard"],
  },
  {
    id: "q019",
    domain: ContentDomain.NEW_SOLUTIONS,
    text: "A healthcare company needs to build a HIPAA-compliant application that processes sensitive patient data. The solution must provide end-to-end encryption, audit logging, and data residency controls. What architecture should be implemented?",
    choices: [
      { id: "q019-a", text: "EC2 instances with self-managed encryption and logging" },
      { id: "q019-b", text: "S3 with SSE-KMS, CloudTrail, S3 Object Lock, and VPC endpoints" },
      { id: "q019-c", text: "RDS with Transparent Data Encryption and manual backups" },
      { id: "q019-d", text: "DynamoDB with client-side encryption and CloudWatch Logs" },
    ],
    correctChoiceId: "q019-b",
    explanation:
      "S3 with SSE-KMS provides encryption at rest with customer-managed keys. CloudTrail logs all API calls for audit compliance. S3 Object Lock ensures data immutability (WORM). VPC endpoints keep traffic within AWS network. This combination meets HIPAA requirements for encryption, audit logging, and data protection. Reference: https://docs.aws.amazon.com/whitepapers/latest/architecting-hipaa-security-and-compliance-on-aws/",
    difficulty: "hard",
    tags: ["HIPAA", "Compliance", "S3", "KMS", "Healthcare"],
  },
  {
    id: "q020",
    domain: ContentDomain.NEW_SOLUTIONS,
    text: "A company is building a serverless data lake that ingests data from 1000+ sources. The solution must support schema evolution, ACID transactions, and time travel queries. What should be used?",
    choices: [
      { id: "q020-a", text: "S3 with Glue Catalog and Athena" },
      { id: "q020-b", text: "S3 with Apache Iceberg tables and Athena" },
      { id: "q020-c", text: "Redshift Spectrum with S3 data lake" },
      { id: "q020-d", text: "EMR with Hive metastore and S3" },
    ],
    correctChoiceId: "q020-b",
    explanation:
      "Apache Iceberg on S3 provides ACID transactions, schema evolution, and time travel capabilities for data lakes. Athena supports querying Iceberg tables directly. This combination provides advanced data lake features (ACID, time travel) while remaining serverless and cost-effective. Iceberg handles schema evolution automatically. Reference: https://docs.aws.amazon.com/athena/latest/ug/querying-iceberg.html",
    difficulty: "hard",
    tags: ["Data Lake", "Iceberg", "Athena", "ACID", "Serverless"],
  },
  // Continuous Improvement Domain (10 questions)
  {
    id: "q021",
    domain: ContentDomain.CONTINUOUS_IMPROVEMENT,
    text: "An application running on EC2 instances is experiencing high CPU utilization during peak hours. CloudWatch metrics show CPU at 90% but memory at 40%. What optimization should be implemented?",
    choices: [
      { id: "q021-a", text: "Increase instance size to get more CPU and memory" },
      {
        id: "q021-b",
        text: "Switch to compute-optimized instances with higher CPU-to-memory ratio",
      },
      { id: "q021-c", text: "Add more instances to the Auto Scaling group" },
      { id: "q021-d", text: "Enable Enhanced Networking for better performance" },
    ],
    correctChoiceId: "q021-b",
    explanation:
      "Compute-optimized instances (C-family) provide higher CPU-to-memory ratios, ideal for CPU-intensive workloads. Since memory utilization is low (40%), switching to compute-optimized instances provides better price-performance by allocating resources where needed. This is more cost-effective than scaling up to larger general-purpose instances. Reference: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/compute-optimized-instances.html",
    difficulty: "medium",
    tags: ["EC2", "Performance Optimization", "Compute Optimized", "Right-sizing"],
  },
  {
    id: "q022",
    domain: ContentDomain.CONTINUOUS_IMPROVEMENT,
    text: "A company's S3 bucket contains 500TB of data with 80% of objects not accessed in the last 90 days. Monthly storage costs are $11,500. What optimization should be implemented to reduce costs?",
    choices: [
      { id: "q022-a", text: "Enable S3 Intelligent-Tiering for automatic cost optimization" },
      {
        id: "q022-b",
        text: "Create lifecycle policy to transition objects to Glacier after 90 days",
      },
      { id: "q022-c", text: "Enable S3 Transfer Acceleration for faster uploads" },
      { id: "q022-d", text: "Compress all objects and re-upload to S3" },
    ],
    correctChoiceId: "q022-a",
    explanation:
      "S3 Intelligent-Tiering automatically moves objects between access tiers based on usage patterns without retrieval fees or operational overhead. It's ideal when access patterns are unknown or changing. For 400TB of infrequently accessed data, this could save ~$8,000/month compared to S3 Standard. No lifecycle policies to manage. Reference: https://docs.aws.amazon.com/AmazonS3/latest/userguide/intelligent-tiering.html",
    difficulty: "medium",
    tags: ["S3", "Cost Optimization", "Intelligent-Tiering", "Storage"],
  },
  {
    id: "q023",
    domain: ContentDomain.CONTINUOUS_IMPROVEMENT,
    text: "A DynamoDB table is experiencing throttling during peak hours despite provisioned capacity being set to 5000 RCU/WCU. CloudWatch shows hot partition issues. What should be done to improve performance?",
    choices: [
      { id: "q023-a", text: "Increase provisioned capacity to 10000 RCU/WCU" },
      {
        id: "q023-b",
        text: "Switch to on-demand capacity mode and implement partition key design best practices",
      },
      { id: "q023-c", text: "Add Global Secondary Indexes for better query distribution" },
      { id: "q023-d", text: "Enable DynamoDB Auto Scaling" },
    ],
    correctChoiceId: "q023-b",
    explanation:
      "Hot partitions indicate poor partition key design, not insufficient capacity. On-demand mode eliminates capacity planning and handles traffic spikes automatically. More importantly, redesigning the partition key to distribute load evenly is essential. Adding capacity won't solve hot partition issues. Reference: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-partition-key-design.html",
    difficulty: "hard",
    tags: ["DynamoDB", "Performance", "Partition Key", "Hot Partition"],
  },
  {
    id: "q024",
    domain: ContentDomain.CONTINUOUS_IMPROVEMENT,
    text: "An RDS Aurora PostgreSQL cluster is experiencing slow query performance. The database has 2TB of data and queries scan large tables. What optimization should be implemented first?",
    choices: [
      { id: "q024-a", text: "Add more read replicas to distribute query load" },
      { id: "q024-b", text: "Upgrade to a larger instance class with more memory" },
      {
        id: "q024-c",
        text: "Enable Performance Insights and analyze slow queries to add appropriate indexes",
      },
      { id: "q024-d", text: "Enable Aurora Serverless for automatic scaling" },
    ],
    correctChoiceId: "q024-c",
    explanation:
      "Performance Insights provides detailed query analysis to identify slow queries and missing indexes. Adding indexes is often the most effective optimization for scan-heavy workloads. This should be done before scaling hardware, as proper indexing can provide 10-100x performance improvements at no additional cost. Reference: https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/USER_PerfInsights.html",
    difficulty: "medium",
    tags: ["Aurora", "Performance Insights", "Query Optimization", "Indexing"],
  },
  {
    id: "q025",
    domain: ContentDomain.CONTINUOUS_IMPROVEMENT,
    text: "A Lambda function processes S3 events but frequently times out after 15 minutes when processing large files. The function's memory is set to 512MB. What optimization should be implemented?",
    choices: [
      { id: "q025-a", text: "Increase Lambda memory to 3008MB for more CPU power" },
      {
        id: "q025-b",
        text: "Refactor to use Step Functions with ECS Fargate for long-running tasks",
      },
      { id: "q025-c", text: "Split large files into smaller chunks before processing" },
      { id: "q025-d", text: "Use Lambda layers to reduce deployment package size" },
    ],
    correctChoiceId: "q025-b",
    explanation:
      "Lambda has a hard limit of 15 minutes. For processing that exceeds this limit, Step Functions orchestrating ECS Fargate tasks is the appropriate solution. Fargate can run for hours and handle large files efficiently. Step Functions provides workflow orchestration and error handling. Reference: https://docs.aws.amazon.com/step-functions/latest/dg/",
    difficulty: "medium",
    tags: ["Lambda", "Step Functions", "ECS Fargate", "Timeout", "Architecture"],
  },
  {
    id: "q026",
    domain: ContentDomain.CONTINUOUS_IMPROVEMENT,
    text: "A company's CloudFront distribution serves static content from S3. Users in Asia report slow load times (5-10 seconds) while US users have fast load times (<1 second). What should be done?",
    choices: [
      { id: "q026-a", text: "Enable S3 Transfer Acceleration" },
      {
        id: "q026-b",
        text: "Create an S3 bucket in an Asia region and use CloudFront origin failover",
      },
      {
        id: "q026-c",
        text: "Verify CloudFront distribution has Price Class All and check cache hit ratio",
      },
      {
        id: "q026-d",
        text: "Use Route 53 geolocation routing to direct Asian users to a different distribution",
      },
    ],
    correctChoiceId: "q026-c",
    explanation:
      "CloudFront should provide fast global delivery. Slow performance in Asia suggests either the distribution isn't using all edge locations (Price Class) or cache hit ratio is low. Price Class All includes all edge locations globally. Low cache hit ratio means requests go back to origin frequently. These should be checked before architectural changes. Reference: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PriceClass.html",
    difficulty: "medium",
    tags: ["CloudFront", "Performance", "Global Delivery", "Caching"],
  },
  {
    id: "q027",
    domain: ContentDomain.CONTINUOUS_IMPROVEMENT,
    text: "An application uses ElastiCache for Redis with 6 nodes. Cache hit ratio is 45% and eviction rate is high. Memory utilization is at 95%. What optimization should be implemented?",
    choices: [
      { id: "q027-a", text: "Increase TTL values to keep data in cache longer" },
      { id: "q027-b", text: "Add more nodes to the cluster and implement better cache key design" },
      { id: "q027-c", text: "Switch to Memcached for better memory efficiency" },
      { id: "q027-d", text: "Enable cluster mode for automatic sharding" },
    ],
    correctChoiceId: "q027-b",
    explanation:
      "High eviction rate with 95% memory utilization indicates insufficient cache capacity. Low cache hit ratio (45%) suggests poor cache key design or inappropriate data being cached. Adding nodes increases capacity, and improving cache key design (caching frequently accessed data, appropriate TTLs) will improve hit ratio. Reference: https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/CacheMetrics.WhichShouldIMonitor.html",
    difficulty: "medium",
    tags: ["ElastiCache", "Redis", "Cache Optimization", "Performance"],
  },
  {
    id: "q028",
    domain: ContentDomain.CONTINUOUS_IMPROVEMENT,
    text: "A company's AWS bill shows $50,000/month for EC2 instances that run 24/7 with predictable usage. 70% of instances are t3.large running development workloads. What cost optimization should be implemented?",
    choices: [
      { id: "q028-a", text: "Purchase 1-year Reserved Instances for all instances" },
      { id: "q028-b", text: "Use Spot Instances for all development workloads" },
      {
        id: "q028-c",
        text: "Implement Compute Savings Plans with 1-year commitment for production, Spot for development",
      },
      { id: "q028-d", text: "Downsize all instances to t3.medium" },
    ],
    correctChoiceId: "q028-c",
    explanation:
      "Compute Savings Plans provide up to 66% savings with flexibility across instance families, sizes, and regions. For production workloads with predictable usage, Savings Plans are ideal. Development workloads can use Spot Instances for up to 90% savings. This combination maximizes savings while maintaining appropriate reliability for each environment. Reference: https://docs.aws.amazon.com/savingsplans/latest/userguide/",
    difficulty: "medium",
    tags: ["Cost Optimization", "Savings Plans", "Spot Instances", "EC2"],
  },
  {
    id: "q029",
    domain: ContentDomain.CONTINUOUS_IMPROVEMENT,
    text: "An application's RDS database backup window causes performance degradation during business hours. Backups take 2 hours and occur at 2 PM UTC. The application serves global users. What should be done?",
    choices: [
      { id: "q029-a", text: "Disable automated backups and use manual snapshots" },
      {
        id: "q029-b",
        text: "Change backup window to off-peak hours and enable backup replication to another region",
      },
      { id: "q029-c", text: "Migrate to Aurora with continuous backup to avoid backup windows" },
      { id: "q029-d", text: "Increase instance size to handle backup load" },
    ],
    correctChoiceId: "q029-c",
    explanation:
      "Aurora uses continuous backup to S3 without performance impact, eliminating backup windows entirely. Aurora also provides point-in-time recovery up to 35 days. For global applications where there's no true off-peak time, Aurora's continuous backup is the best solution. This also provides better RPO (seconds vs hours). Reference: https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Backups.html",
    difficulty: "medium",
    tags: ["Aurora", "Backup", "Performance", "Migration"],
  },
  {
    id: "q030",
    domain: ContentDomain.CONTINUOUS_IMPROVEMENT,
    text: "A company's NAT Gateway costs are $5,000/month with 50TB of data transfer. VPC Flow Logs show most traffic is to S3 and DynamoDB. What optimization should be implemented?",
    choices: [
      { id: "q030-a", text: "Use smaller NAT Gateway instances" },
      {
        id: "q030-b",
        text: "Implement VPC endpoints for S3 and DynamoDB to eliminate NAT Gateway traffic",
      },
      { id: "q030-c", text: "Use NAT instances instead of NAT Gateway" },
      { id: "q030-d", text: "Compress data before sending to reduce transfer volume" },
    ],
    correctChoiceId: "q030-b",
    explanation:
      "VPC endpoints for S3 and DynamoDB allow private connectivity without NAT Gateway, eliminating data transfer charges. For 50TB/month, this could save ~$4,500/month in NAT Gateway data processing charges. VPC endpoints are free (Gateway endpoints) or low-cost (Interface endpoints) and provide better security. Reference: https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints.html",
    difficulty: "medium",
    tags: ["VPC Endpoints", "NAT Gateway", "Cost Optimization", "Networking"],
  },
  // Migration and Modernization Domain (10 questions)
  {
    id: "q031",
    domain: ContentDomain.MIGRATION_MODERNIZATION,
    text: "A company needs to migrate 500 on-premises servers to AWS with minimal downtime. The servers run various operating systems and applications. What migration strategy should be used?",
    choices: [
      { id: "q031-a", text: "Manual server rebuild and application reinstallation" },
      { id: "q031-b", text: "AWS Application Migration Service (MGN) with continuous replication" },
      { id: "q031-c", text: "VM Import/Export for each server" },
      { id: "q031-d", text: "AWS Server Migration Service (SMS) with scheduled migrations" },
    ],
    correctChoiceId: "q031-b",
    explanation:
      "AWS Application Migration Service (MGN) provides continuous block-level replication with minimal downtime (minutes). It supports any source infrastructure and automates the conversion process. MGN is the recommended service for lift-and-shift migrations at scale, replacing the older SMS service. Reference: https://docs.aws.amazon.com/mgn/latest/ug/",
    difficulty: "medium",
    tags: ["Migration", "MGN", "Lift-and-Shift", "Replication"],
  },
  {
    id: "q032",
    domain: ContentDomain.MIGRATION_MODERNIZATION,
    text: "A company is migrating a 50TB Oracle database to AWS. The migration must complete within 1 week with minimal downtime. The on-premises data center has 1 Gbps internet connectivity. What migration approach should be used?",
    choices: [
      { id: "q032-a", text: "AWS Database Migration Service (DMS) over internet" },
      { id: "q032-b", text: "AWS Snowball Edge with DMS for ongoing replication" },
      { id: "q032-c", text: "Direct Connect with DMS continuous replication" },
      { id: "q032-d", text: "Oracle Data Pump export/import via S3" },
    ],
    correctChoiceId: "q032-b",
    explanation:
      "50TB over 1 Gbps would take ~5 days of continuous transfer, leaving no time for validation. Snowball Edge can transfer 50TB in 1-2 days. After initial load via Snowball, DMS can replicate ongoing changes for minimal downtime cutover. This combination provides the fastest migration within the 1-week window. Reference: https://docs.aws.amazon.com/dms/latest/userguide/CHAP_LargeDBs.html",
    difficulty: "hard",
    tags: ["Database Migration", "DMS", "Snowball", "Oracle", "Large Data"],
  },
  {
    id: "q033",
    domain: ContentDomain.MIGRATION_MODERNIZATION,
    text: "A company wants to migrate a monolithic .NET application to AWS and modernize it to microservices. The application has 200,000 lines of code. What approach should be taken?",
    choices: [
      { id: "q033-a", text: "Rewrite the entire application as microservices before migration" },
      {
        id: "q033-b",
        text: "Lift-and-shift to EC2, then gradually refactor to containers and microservices",
      },
      {
        id: "q033-c",
        text: "Use AWS App2Container to containerize, then refactor to microservices",
      },
      { id: "q033-d", text: "Migrate to Elastic Beanstalk and keep as monolith" },
    ],
    correctChoiceId: "q033-b",
    explanation:
      "The strangler fig pattern (lift-and-shift then gradual refactoring) minimizes risk and allows incremental modernization. Rewriting 200K LOC before migration is high-risk and time-consuming. Lift-and-shift to EC2 provides immediate cloud benefits, then gradually extract microservices while the monolith continues running. Reference: https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-decomposing-monoliths/",
    difficulty: "medium",
    tags: ["Modernization", "Microservices", "Strangler Fig", ".NET", "Refactoring"],
  },
  {
    id: "q034",
    domain: ContentDomain.MIGRATION_MODERNIZATION,
    text: "A company is migrating from on-premises Active Directory to AWS. They need to maintain existing user credentials and enable SSO to AWS services and on-premises applications. What solution should be implemented?",
    choices: [
      { id: "q034-a", text: "AWS Directory Service for Microsoft AD with AD Connector" },
      {
        id: "q034-b",
        text: "AWS Managed Microsoft AD with two-way trust to on-premises AD and AWS IAM Identity Center",
      },
      { id: "q034-c", text: "Simple AD with manual user synchronization" },
      { id: "q034-d", text: "Cognito User Pools with SAML federation" },
    ],
    correctChoiceId: "q034-b",
    explanation:
      "AWS Managed Microsoft AD with two-way trust maintains existing credentials while enabling cloud authentication. IAM Identity Center (formerly AWS SSO) provides SSO to AWS services and SAML-enabled applications. This solution supports hybrid scenarios and provides the best user experience. Reference: https://docs.aws.amazon.com/directoryservice/latest/admin-guide/",
    difficulty: "hard",
    tags: ["Active Directory", "IAM Identity Center", "SSO", "Hybrid", "Authentication"],
  },
  {
    id: "q035",
    domain: ContentDomain.MIGRATION_MODERNIZATION,
    text: "A company needs to migrate 2PB of file server data to AWS. The data must remain accessible via SMB protocol. Network bandwidth is limited to 100 Mbps. What solution should be used?",
    choices: [
      { id: "q035-a", text: "AWS DataSync over internet" },
      { id: "q035-b", text: "Multiple AWS Snowball Edge devices with FSx for Windows File Server" },
      { id: "q035-c", text: "AWS Storage Gateway File Gateway" },
      { id: "q035-d", text: "Direct Connect with AWS Transfer Family" },
    ],
    correctChoiceId: "q035-b",
    explanation:
      "2PB over 100 Mbps would take ~5 years. Multiple Snowball Edge devices can transfer 2PB in weeks. FSx for Windows File Server provides fully managed SMB file shares in AWS. After initial load via Snowball, DataSync can handle incremental changes. This is the only practical solution for this data volume and bandwidth constraint. Reference: https://docs.aws.amazon.com/fsx/latest/WindowsGuide/migrate-to-fsx.html",
    difficulty: "hard",
    tags: ["Data Migration", "Snowball", "FSx", "SMB", "Large Scale"],
  },
  {
    id: "q036",
    domain: ContentDomain.MIGRATION_MODERNIZATION,
    text: "A company is migrating a legacy application that uses Oracle RAC with 12 nodes. The application requires high availability and read scalability. What AWS database solution should be used?",
    choices: [
      { id: "q036-a", text: "RDS for Oracle with Multi-AZ" },
      { id: "q036-b", text: "Aurora PostgreSQL with read replicas" },
      { id: "q036-c", text: "EC2 instances running Oracle RAC" },
      { id: "q036-d", text: "RDS for Oracle with read replicas" },
    ],
    correctChoiceId: "q036-b",
    explanation:
      "Aurora PostgreSQL provides similar capabilities to Oracle RAC with better scalability and lower cost. It supports up to 15 read replicas with sub-10ms replication lag. Aurora's architecture provides high availability across 3 AZs automatically. For most Oracle RAC workloads, Aurora PostgreSQL is the recommended modernization path. Reference: https://docs.aws.amazon.com/dms/latest/sbs/chap-manageddatabases.oracle-postgresql-aurora.html",
    difficulty: "hard",
    tags: ["Database Migration", "Oracle", "Aurora", "Modernization", "High Availability"],
  },
  {
    id: "q037",
    domain: ContentDomain.MIGRATION_MODERNIZATION,
    text: "A company needs to migrate a mainframe application running COBOL to AWS. The application processes batch jobs overnight and has complex business logic. What modernization approach should be taken?",
    choices: [
      { id: "q037-a", text: "Rewrite the application in Java or Python" },
      {
        id: "q037-b",
        text: "Use AWS Mainframe Modernization with automated refactoring to managed runtime",
      },
      { id: "q037-c", text: "Lift-and-shift mainframe to EC2 instances" },
      { id: "q037-d", text: "Manual code conversion to Lambda functions" },
    ],
    correctChoiceId: "q037-b",
    explanation:
      "AWS Mainframe Modernization provides automated refactoring tools that convert COBOL to Java while preserving business logic. The managed runtime environment handles batch processing and provides modern DevOps capabilities. This approach is faster and lower-risk than manual rewriting. Reference: https://docs.aws.amazon.com/m2/latest/userguide/",
    difficulty: "medium",
    tags: ["Mainframe", "Modernization", "COBOL", "Refactoring", "Batch Processing"],
  },
  {
    id: "q038",
    domain: ContentDomain.MIGRATION_MODERNIZATION,
    text: "A company is migrating VMware workloads to AWS. They want to maintain VMware tools and operational procedures. The migration must support 1000+ VMs. What solution should be used?",
    choices: [
      { id: "q038-a", text: "VM Import/Export to convert VMs to EC2 instances" },
      { id: "q038-b", text: "VMware Cloud on AWS with hybrid connectivity" },
      { id: "q038-c", text: "AWS Application Migration Service to convert to EC2" },
      { id: "q038-d", text: "Manual VM rebuild on EC2 instances" },
    ],
    correctChoiceId: "q038-b",
    explanation:
      "VMware Cloud on AWS provides native VMware environment running on AWS infrastructure. It maintains VMware tools, vCenter, and operational procedures while providing AWS service integration. This is ideal for large-scale VMware migrations where maintaining existing tools and skills is important. Reference: https://docs.aws.amazon.com/vmware-cloud/",
    difficulty: "medium",
    tags: ["VMware", "Migration", "Hybrid Cloud", "vCenter"],
  },
  {
    id: "q039",
    domain: ContentDomain.MIGRATION_MODERNIZATION,
    text: "A company needs to migrate a SQL Server database with 10TB of data and 500 stored procedures. The migration must minimize downtime and maintain transactional consistency. What approach should be used?",
    choices: [
      { id: "q039-a", text: "Native SQL Server backup/restore to RDS" },
      { id: "q039-b", text: "AWS DMS with ongoing replication and Schema Conversion Tool (SCT)" },
      { id: "q039-c", text: "AWS DataSync to copy database files" },
      { id: "q039-d", text: "Manual export/import using SQL scripts" },
    ],
    correctChoiceId: "q039-b",
    explanation:
      "DMS provides continuous replication for minimal downtime migration. SCT converts stored procedures and database objects. DMS maintains transactional consistency during migration. This combination is the recommended approach for large SQL Server migrations to RDS or Aurora. Reference: https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.SQLServer.html",
    difficulty: "medium",
    tags: ["Database Migration", "SQL Server", "DMS", "SCT", "Stored Procedures"],
  },
  {
    id: "q040",
    domain: ContentDomain.MIGRATION_MODERNIZATION,
    text: "A company is modernizing a monolithic application to serverless. The application has a REST API, background jobs, and scheduled tasks. What architecture should be implemented?",
    choices: [
      {
        id: "q040-a",
        text: "API Gateway + Lambda for API, Lambda for jobs, CloudWatch Events for scheduling",
      },
      { id: "q040-b", text: "Application Load Balancer + ECS Fargate for all components" },
      { id: "q040-c", text: "EC2 Auto Scaling with containerized microservices" },
      { id: "q040-d", text: "Elastic Beanstalk with worker environments" },
    ],
    correctChoiceId: "q040-a",
    explanation:
      "API Gateway + Lambda provides fully serverless REST API with automatic scaling. Lambda handles background jobs triggered by events (SQS, SNS, etc.). EventBridge (CloudWatch Events) schedules tasks with cron expressions. This architecture is fully serverless, scales automatically, and follows AWS best practices for modernization. Reference: https://docs.aws.amazon.com/lambda/latest/dg/",
    difficulty: "medium",
    tags: ["Serverless", "Lambda", "API Gateway", "EventBridge", "Modernization"],
  },
];

/**
 * Get all questions from the question bank
 */
export function getAllQuestions(): Question[] {
  return questionBank;
}

/**
 * Get questions by domain
 */
export function getQuestionsByDomain(domain: ContentDomain): Question[] {
  return questionBank.filter((q) => q.domain === domain);
}

/**
 * Get a random sample of questions
 */
export function getRandomQuestions(count: number): Question[] {
  const shuffled = [...questionBank].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, questionBank.length));
}

/**
 * Validate that all questions meet the required structure
 *
 * @param questions - Optional array of questions to validate. If not provided, validates the internal question bank.
 * @returns Object with isValid boolean and array of error messages
 */
export function validateQuestionBank(questions?: Question[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const questionsToValidate = questions || questionBank;

  questionsToValidate.forEach((question, index) => {
    // Check required fields
    if (!question.id) errors.push(`Question ${index}: Missing id`);
    if (!question.text) errors.push(`Question ${index}: Missing text`);
    if (!question.explanation || question.explanation.trim() === "")
      errors.push(`Question ${index}: Missing explanation`);

    // Check choices
    if (question.choices.length !== 4) {
      errors.push(`Question ${index}: Must have exactly 4 choices`);
    }

    // Check correct choice ID exists
    const choiceIds = question.choices.map((c) => c.id);
    if (!choiceIds.includes(question.correctChoiceId)) {
      errors.push(`Question ${index}: correctChoiceId not found in choices`);
    }

    // Check domain
    if (!Object.values(ContentDomain).includes(question.domain)) {
      errors.push(`Question ${index}: Invalid domain`);
    }
  });

  // Log errors if validation fails
  if (errors.length > 0) {
    console.error("Question validation failed:", errors);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
