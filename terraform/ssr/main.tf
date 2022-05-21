terraform {
  backend "s3" {
    bucket = "calories-log-net-infra-state"
    key    = "calories-log-net/ssr/terraform.tfstate"
    region = "ap-northeast-2"

    dynamodb_table = "calories_log_net_infra_lock"
    encrypt        = true
  }
}

module "docker-single-runner" {
  source              = "git::https://github.com/div-ops/terraform-docker-runner.git//modules/docker-single-runner"
  security_group_name = "web_security"
  service_ports       = [22, 80, 443]
  key_name            = "my-service"
  domain_name         = "calories-log.net"
  deploy_script_path  = "deploy.sh"
  dockerfile_path     = "Dockerfile"
  env_1_key           = "GIT_TOKEN"
  env_1_value         = var.GIT_TOKEN
  env_2_key           = "NOTION_SECRET"
  env_2_value         = var.NOTION_SECRET
  env_3_key           = "NOTION_DATABASE"
  env_3_value         = var.NOTION_DATABASE
  env_4_key           = "MASTER_ID"
  env_4_value         = var.MASTER_ID
  env_5_key           = "MASTER_PW"
  env_5_value         = var.MASTER_PW
  env_6_key           = "NOTION_STORAGE_DATABASE"
  env_6_value         = var.NOTION_STORAGE_DATABASE
  hash                = uuid()
  hosted_zone_id      = var.HOSTED_ZONE_ID
  certificate_arn     = var.CERTIFICATE_ARN
  local_exec          = "bash ./build.sh"
  target_path         = "../../calories-log.net.tar.gz"
}

provider "aws" {
  region = var.region
}

variable "region" {
  default = "ap-northeast-2"
}

variable "GIT_TOKEN" {
  type = string
}

variable "NOTION_SECRET" {
  type = string
}

variable "NOTION_DATABASE" {
  type = string
}

variable "NOTION_STORAGE_DATABASE" {
  type = string
}

variable "MASTER_ID" {
  type = string
}

variable "MASTER_PW" {
  type = string
}

variable "HOSTED_ZONE_ID" {
  type = string
}

variable "CERTIFICATE_ARN" {
  type = string
}

output "domain_url" {
  value = module.docker-single-runner.domain_url
}
