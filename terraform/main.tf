terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# 1. Configuración del proveedor apuntando a LocalStack
provider "aws" {
  access_key                  = "test"
  secret_key                  = "test"
  region                      = "us-east-1"
  
  s3_use_path_style           = true
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true

  endpoints {
    s3 = "http://127.0.0.1:4566" # <--- Cambio clave aplicado aquí
  }
}

# 2. La creación del bucket
resource "aws_s3_bucket" "tallerBucket" {
  bucket = "tallerbucket-drive"
}

# 3. Configuración de permisos públicos haciendo referencia al nuevo ID
resource "aws_s3_bucket_public_access_block" "tallerBucket_public_access" {
  bucket = aws_s3_bucket.tallerBucket.id 

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}