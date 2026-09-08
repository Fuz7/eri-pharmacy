variable "region" {
  description = "AWS Region"
  type        = string
  default     = "ap-southeast-1"
}

variable "project_name" {
  description = "Name of the project, used for resource naming"
  type        = string
  default     = "eri-pharmacy"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "staging"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}

variable "ami" {
  description = "AMI ID for the EC2 instance (Amazon Linux 2023 in ap-southeast-1 as a starting point — check for the latest ID)"
  type        = string
}

variable "key_name" {
  description = "Name of an existing EC2 key pair for SSH access"
  type        = string
}

variable "github_repository" {
  description = "owner/repo allowed to assume the GitHub Actions role"
  type        = string
  default     = "Fuz7/eri-pharmacy"
}

variable "github_branch" {
  description = "Branch allowed to assume the GitHub Actions role. Must match the branch the staging workflow triggers on (.github/workflows/staging.yml) — a mismatch fails at the credentials step, not the build."
  type        = string
  default     = "develop"
}
