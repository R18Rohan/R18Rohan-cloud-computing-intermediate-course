# Incident Response Runbook - Orion LMS

## 1. Escalation Pathways
- **Level 1 Support**: DevOps Operations On-Call Team (Slack: #devops-alerts)
- **Level 2 Escalation**: Infrastructure Platform Lead (PagerDuty)
- **Level 3 Escalation**: Chief Technology Officer / VP of Engineering

## 2. Alert Playbook: K8sPodCpuUtilizationHigh
- **Severity**: High (Critical if production namespaces are impacted)
- **Trigger Rule**: Container CPU usage > 85% for more than 5 minutes.
- **Remediation Protocol**:
  1. Inspect container logs: `kubectl logs -n orion-prod -l app=orion-app`
  2. Identify slow database queries or infinite loops.
  3. Scale container replica count: `kubectl scale deployment orion-lms-deployment --replicas=4 -n orion-prod`
  4. Perform Root Cause Analysis (RCA) and document findings.
