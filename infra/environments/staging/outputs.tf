# Outputs.

output "ec2_public_ip" {
  description = "Elastic IP of the EC2 instance (stable across stop/start)"
  value       = aws_eip.app.public_ip
}
