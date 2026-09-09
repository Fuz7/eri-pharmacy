output "github_oidc_provider_arn" {
  description = "ARN of the shared GitHub Actions OIDC provider"
  value       = aws_iam_openid_connect_provider.github.arn
}
