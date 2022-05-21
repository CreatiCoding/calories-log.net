provider "aws" {
  region = local.region
}

locals {
  region = "ap-northeast-2"
}

module "lock-state" {
  source              = "git::https://github.com/div-ops/terraform-s3-lock.git//lock"
  aws_region          = local.region
  s3_bucket_name      = "calories-log-net-infra-state"
  dynamodb_table_name = "calories_log_net_infra_lock"
}
