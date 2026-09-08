# The EC2 instance that runs the Docker Compose stack.

# --- EC2 ---

resource "aws_instance" "app" {
  ami                         = var.ami
  instance_type               = var.instance_type
  subnet_id                   = aws_subnet.public.id
  vpc_security_group_ids      = [aws_security_group.app.id]
  associate_public_ip_address = true
  key_name                    = var.key_name
  iam_instance_profile        = aws_iam_instance_profile.app.name

  # IMDSv2 only. IMDSv1 answers a plain GET to 169.254.169.254, so any SSRF in
  # the app — or a malicious dependency — could read this instance's role
  # credentials. IMDSv2 requires a PUT to obtain a token first, which SSRF
  # generally cannot perform. This matters now that the instance has a role.
  metadata_options {
    http_endpoint = "enabled"
    http_tokens   = "required"

    # Containers reach the metadata service through Docker's bridge, costing
    # one extra hop. The default of 1 would break `aws ssm get-parameter`
    # from inside a container.
    http_put_response_hop_limit = 2
  }

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }

  tags = {
    Name = "${local.name}-ec2"
  }
}

# A stable public address. Without this the instance gets a fresh auto-assigned
# IP on every stop/start, which would break the deploy script, any bookmark,
# and — once there is a domain — the DNS A record. That makes it a prerequisite
# for TLS, since certificates are issued against names that must resolve here.
#
# depends_on: an EIP cannot be associated until the VPC has an internet
# gateway attached, and Terraform does not infer that ordering on its own.
resource "aws_eip" "app" {
  instance = aws_instance.app.id
  domain   = "vpc"

  depends_on = [aws_internet_gateway.main]

  tags = {
    Name = "${local.name}-eip"
  }
}
