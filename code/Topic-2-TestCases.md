# Test Cases: Topic 2 - Containers on AWS: Docker, ECR, ECS Fargate & Container Architecture

## Overview
These test cases check ECS Fargate Task Definition CPU/memory ratios, container port mappings, and ECR mutable image tag rules audits.

---

## Test Case 1: Valid Fargate Task Specifications check
- **Description**: Verify that the deployer auditor passes valid configurations that conform to AWS Fargate guidelines.
- **Preconditions**: Codebase package dependencies are installed.
- **Steps**:
  1. Define a configuration: `cpu: 256`, `memory: 512`, `containerPort: 3000`, `imageTag: 'v1.0.0'`.
  2. Pass it to the auditor: `auditConfiguration(config)`.
- **Expected Result**:
  - The returned object has `valid` equal to `true`.
  - The `violations` list is empty.

---

## Test Case 2: Invalid Fargate Task CPU sizing checks
- **Description**: Verify that the auditor flags non-standard Fargate CPU configurations.
- **Preconditions**: Auditor is initialized.
- **Steps**:
  1. Define a configuration: `cpu: 300` (invalid Fargate size), `memory: 1024`, `containerPort: 3000`, `imageTag: 'v1.0.0'`.
  2. Pass it to the auditor: `auditConfiguration(config)`.
- **Expected Result**:
  - The auditor flags the configuration as invalid (`valid: false`).
  - The `violations` list contains: `"Invalid CPU value: 300"`.

---

## Test Case 3: Incompatible memory allocation check
- **Description**: Verify that the auditor flags memory sizes that do not match the assigned CPU.
- **Preconditions**: Auditor is initialized.
- **Steps**:
  1. Define a configuration: `cpu: 256`, `memory: 4096` (too large for 256 CPU units), `containerPort: 3000`, `imageTag: 'v1.0.0'`.
  2. Pass it to the auditor: `auditConfiguration(config)`.
- **Expected Result**:
  - The configuration is flagged as invalid.
  - The `violations` list contains: `"Invalid memory for 256 CPU: 4096MB. Must be between 512MB and 2048MB."`.

---

## Test Case 4: Non-standard container port mapping checks
- **Description**: Verify that exposing non-standard application ports flags a violation.
- **Preconditions**: Auditor is initialized.
- **Steps**:
  1. Define a configuration: `cpu: 512`, `memory: 1024`, `containerPort: 8080` (exposes 8080 instead of Node default 3000), `imageTag: 'v1.0.0'`.
  2. Pass it to the auditor: `auditConfiguration(config)`.
- **Expected Result**:
  - The configuration is flagged as invalid.
  - The `violations` list contains: `"Exposed containerPort 8080 does not match Node.js default service port (3000)."`.

---

## Test Case 5: Mutable ECR image tag deployment check
- **Description**: Verify that deploying a task with the mutable tag `latest` flags a risk warning.
- **Preconditions**: Auditor is initialized.
- **Steps**:
  1. Define a configuration: `cpu: 256`, `memory: 512`, `containerPort: 3000`, `imageTag: 'latest'`.
  2. Pass it to the auditor: `auditConfiguration(config)`.
- **Expected Result**:
  - The configuration is flagged as invalid due to mutable tag risks.
  - The `violations` list contains: `"Risk: Using 'latest' image tag is not recommended for stable production releases."`.
