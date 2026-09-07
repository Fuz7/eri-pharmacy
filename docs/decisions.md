## teraform

Decided to use 
```
provider "aws" {
  region = var.region
  default_tags {}
}
```
Instead of 
```
variable "region" {
  description = "AWS Region"
  type        = string
  default     = "ap-southeast-1"
} 
```
Without the profile because it would look for
AWS credentials file (~/.aws/credentials) which could differ with different machines

Instead we are using
```
export AWS_ACCESS_KEY_ID=
export AWS_SECRET_ACCESS_KEY=
export AWS_SESSION_TOKEN=
```
To make it more consistent and removes the hassle of having profile for each machine

Makes it adding in the gh action easier too