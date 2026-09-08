# Container registries. CI builds the images and pushes here; the EC2 instance
# pulls from here. Keeping the build off the t2.micro is the point — 1 GiB of
# RAM is not enough for `vite build` without swap.

locals {
  ecr_repos = toset(["nginx", "backend"])
}

resource "aws_ecr_repository" "app" {
  for_each = local.ecr_repos

  name = "${local.name}-${each.key}"

  # Tags are commit SHAs, which should never point at two different images.
  # This also makes `:latest` impossible to push, which is deliberate: a tag
  # that moves cannot be rolled back to.
  image_tag_mutability = "IMMUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  # Without this, `terraform destroy` fails while the repository still holds
  # images. Staging is torn down regularly, so accept the deletion.
  force_delete = true

  tags = {
    Name = "${local.name}-${each.key}"
  }
}

# Old images are billed storage forever otherwise.
resource "aws_ecr_lifecycle_policy" "app" {
  for_each = aws_ecr_repository.app

  repository = each.value.name

  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Keep the 10 most recent images"
      selection = {
        tagStatus   = "any"
        countType   = "imageCountMoreThan"
        countNumber = 10
      }
      action = { type = "expire" }
    }]
  })
}
