# Instance role: lets the box read its own configuration from SSM
# Parameter Store without any credentials stored on disk.

resource "aws_iam_role" "app" {
  name = "${local.name}-ec2"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy" "ssm_read" {
  role = aws_iam_role.app.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["ssm:GetParameter", "ssm:GetParametersByPath"]
      Resource = "arn:aws:ssm:${var.region}:*:parameter/${var.project_name}/${var.environment}/*"
      }, {
      Effect   = "Allow"
      Action   = ["kms:Decrypt"]
      Resource = "*" # the aws/ssm managed key
    }]
  })
}

resource "aws_iam_instance_profile" "app" {
  name = "${local.name}-ec2"
  role = aws_iam_role.app.name
}

# Pull permission for the images CI pushes. Scoped to the two staging
# repositories rather than using AmazonEC2ContainerRegistryReadOnly, which
# grants read on every repository in the account.
resource "aws_iam_role_policy" "ecr_pull" {
  name = "${local.name}-ec2-ecr-pull"
  role = aws_iam_role.app.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        # Must be "*": the registry auth token is account-wide.
        Effect   = "Allow"
        Action   = "ecr:GetAuthorizationToken"
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "ecr:BatchCheckLayerAvailability",
          "ecr:BatchGetImage",
          "ecr:GetDownloadUrlForLayer",
        ]
        Resource = [for r in aws_ecr_repository.app : r.arn]
      },
    ]
  })
}
