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
