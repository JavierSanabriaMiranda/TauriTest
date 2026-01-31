terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
  backend "azurerm" {
    resource_group_name  = "rg-terraform-state"      
    storage_account_name = "tfstatetestjavier"       
    container_name       = "tfstate"                 
    key                  = "prod.terraform.tfstate"  
  }
}

provider "azurerm" {
  features {}
}

# 1. Grupo de Recursos
resource "azurerm_resource_group" "rg" {
  name     = "rg-graphite-backend"
  location = "North Europe"
}

# 2. Plan de App Service (Linux Básico)
resource "azurerm_service_plan" "plan" {
  name                = "asp-graphite"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  os_type             = "Linux"
  sku_name            = "B1" # B1 es barato. F1 (gratis) a veces falla con Java.
}

# 3. Web App (Java 17)
resource "azurerm_linux_web_app" "webapp" {
  name                = "terraform-api-deploy-test-jsm" # ¡CAMBIA ESTO! Debe ser único
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_service_plan.plan.location
  service_plan_id     = azurerm_service_plan.plan.id

  site_config {
    application_stack {
      java_server         = "JAVA"
      java_server_version = "17"
      java_version        = "17"
    }
  }
}

# 4. Base de Datos PostgreSQL Flexible Server
resource "azurerm_postgresql_flexible_server" "postgres" {
  name                   = "jsm-db-server-test" # ¡CAMBIA ESTO!
  resource_group_name    = azurerm_resource_group.rg.name
  location               = azurerm_resource_group.rg.location
  version                = "13"
  administrator_login    = "testAdmin"
  administrator_password = var.db_password # Se pasa por variable secreta
  storage_mb             = 32768
  sku_name               = "B_Standard_B1ms"
  
  # Importante para ahorrar costes en pruebas
  auto_grow_enabled = false 
}

# Definimos la variable de contraseña
variable "db_password" {
  description = "Password for PostgreSQL"
  sensitive   = true
}