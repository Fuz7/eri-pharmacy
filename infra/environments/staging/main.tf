# Provider configuration and shared naming.
# Resources live in network.tf, security.tf, compute.tf and iam.tf.

provider "aws" {
  region = var.region
}

locals {
  name = "${var.project_name}-${var.environment}"
}
