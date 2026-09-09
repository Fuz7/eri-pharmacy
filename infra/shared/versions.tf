terraform {
  backend "s3" {
    bucket = "eri-pharmacy-tfstate-225076308901-ap-southeast-1-an"
    key    = "shared/terraform.tfstate"
    region = "ap-southeast-1"

    encrypt      = true
    use_lockfile = true
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.92"
    }
  }

  required_version = ">= 1.16.1"
}
