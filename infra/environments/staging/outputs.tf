# Outputs.

output "ec2_public_ip" {
  description = "Elastic IP of the EC2 instance (stable across stop/start)"
  value       = aws_eip.app.public_ip
}

output "ecr_registry" {
  description = "ECR registry host — set as the GitHub repo variable ECR_REGISTRY"
  value       = split("/", values(aws_ecr_repository.app)[0].repository_url)[0]
}

output "ecr_repository_urls" {
  description = "Full push URLs for each image"
  value       = { for k, r in aws_ecr_repository.app : k => r.repository_url }
}

output "github_actions_role_arn" {
  description = "Role ARN — set as the GitHub repo variable AWS_ROLE_ARN"
  value       = aws_iam_role.github_actions.arn
}
