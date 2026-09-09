# Registers GitHub Actions as a trusted OIDC identity provider.
#
# IAM allows exactly ONE provider per URL per account, so this cannot be
# created in both infra/environments/staging and .../production. Each
# environment reads it with a data source and attaches its own role, with its
# own trust condition — sharing the registration does not share access.

resource "aws_iam_openid_connect_provider" "github" {
  url            = "https://token.actions.githubusercontent.com"
  client_id_list = ["sts.amazonaws.com"]

  # AWS validates GitHub's certificate against its own trusted roots, so this
  # value is no longer security-relevant — the API still requires the field.
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1"]

  tags = {
    Name      = "${var.project_name}-github-oidc"
    ManagedBy = "terraform"
    Scope     = "shared"
  }
}
