# Account-wide resources shared by every environment.
#
# These exist once per AWS account and cannot be duplicated per environment,
# so they must not live inside infra/environments/*. Keeping them here also
# means `terraform destroy` on staging or production cannot take them out from
# under the other.

provider "aws" {
  region = var.region
}
