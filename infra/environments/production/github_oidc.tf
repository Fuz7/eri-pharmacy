# Lets GitHub Actions assume an AWS role using a short-lived OIDC token instead
# of stored access keys. Nothing secret is kept in GitHub, and there is nothing
# to rotate — the credentials last about an hour per workflow run.

# The OIDC provider is ACCOUNT-WIDE: only one can exist per account for
# token.actions.githubusercontent.com, and staging already creates it.
# Creating a second here fails with EntityAlreadyExists, so read it instead.
#
# This means staging must be applied before production.
data "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"
}

resource "aws_iam_role" "github_actions" {
  name = "${local.name}-gha"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Action    = "sts:AssumeRoleWithWebIdentity"
      Principal = { Federated = data.aws_iam_openid_connect_provider.github.arn }
      Condition = {
        StringEquals = {
          "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
        }
        # THIS CONDITION IS LOAD-BEARING. Without it — or with a wildcard
        # repo — any GitHub repository on the internet could assume this role.
        # It fails open, so everything works while you test it.
        StringLike = {
          "token.actions.githubusercontent.com:sub" = "repo:${var.github_repository}:ref:refs/heads/${var.github_branch}"
        }
      }
    }]
  })

  tags = {
    Name = "${local.name}-gha"
  }
}

resource "aws_iam_role_policy" "github_actions_ecr" {
  name = "${local.name}-gha-ecr-push"
  role = aws_iam_role.github_actions.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        # Must be "*": the token is account-wide, not per-repository.
        Effect   = "Allow"
        Action   = "ecr:GetAuthorizationToken"
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "ecr:BatchCheckLayerAvailability",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload",
          "ecr:PutImage",
          "ecr:BatchGetImage",
          "ecr:GetDownloadUrlForLayer",
        ]
        Resource = [for r in aws_ecr_repository.app : r.arn]
      },
    ]
  })
}

# Lets the workflow trigger a deploy on the instance without SSH: no private
# key in GitHub, and port 22 can stay closed.
resource "aws_iam_role_policy" "github_actions_deploy" {
  name = "${local.name}-gha-deploy"
  role = aws_iam_role.github_actions.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        # Scoped to this one instance and the one document it may run.
        Effect = "Allow"
        Action = "ssm:SendCommand"
        Resource = [
          aws_instance.app.arn,
          "arn:aws:ssm:${var.region}::document/AWS-RunShellScript",
        ]
      },
      {
        # Command IDs are generated at send time, so they cannot be scoped.
        # These are read-only: they report status and output, nothing more.
        Effect = "Allow"
        Action = [
          "ssm:GetCommandInvocation",
          "ssm:ListCommandInvocations",
        ]
        Resource = "*"
      },
      {
        # Used to find the instance by tag, so a rebuilt instance needs no
        # change in GitHub. DescribeInstances cannot be resource-scoped.
        Effect   = "Allow"
        Action   = "ec2:DescribeInstances"
        Resource = "*"
      },
    ]
  })
}
