terraform {
  backend "s3" {
    bucket = "calories-log-net-infra-state"
    key    = "calories-log-net/certificate/terraform.tfstate"
    region = "ap-northeast-2"

    dynamodb_table = "calories_log_net_infra_lock"
    encrypt        = true
  }
}
provider "aws" {
  region = local.region
}

locals {
  domain_name = "calories-log.net"
  region      = "ap-northeast-2"
}

module "calories-log-net-hosted-zone" {
  source      = "git::https://github.com/div-ops/terraform-docker-runner.git//modules/hosted-zone"
  domain_name = local.domain_name
}

module "calories-log-net-certificate" {
  source      = "git::https://github.com/div-ops/terraform-docker-runner.git//modules/aws-certificate-manage"
  zone_id     = module.calories-log-net-hosted-zone.zone_id
  domain_name = local.domain_name
}

output "zone_id" {
  value = module.calories-log-net-hosted-zone.zone_id
}

output "name_servers" {
  value = module.calories-log-net-hosted-zone.name_servers
}

output "arn" {
  value = module.calories-log-net-certificate.arn
}
